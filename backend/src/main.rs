mod game;
mod payload;
mod player;
mod story;
mod tests;
mod types;

use std::{
    fs::{self},
    sync::Arc,
    time::Duration,
};

use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        Path, State,
    },
    http::{Method, StatusCode},
    response::Response,
    routing::{any, get, post},
    Router,
};
use futures_util::{
    lock::Mutex,
    stream::{SplitSink, SplitStream, StreamExt},
    SinkExt,
};
use tokio::{
    sync::broadcast::{self, Receiver},
    time::interval,
};
use tower::ServiceBuilder;
use tower_http::cors::CorsLayer;

use crate::{
    game::{Game, GameState},
    player::Player,
    story::StoryState,
};

#[tokio::main]
async fn main() {
    let router = app();
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
    println!("Listening on http://0.0.0.0:8000");

    axum::serve(listener, router).await.unwrap();
}

pub fn app() -> Router {
    let contents =
        fs::read_to_string("ink/game.ink.json").expect("Should have been able to read the file");

    let cors_layer = CorsLayer::new()
        .allow_origin(["https://two-years-g1l1.onrender.com".parse().unwrap()])
        .allow_methods([Method::GET, Method::POST]);

    let game_router: Router<Arc<Mutex<GameState>>> = Router::new()
        .route("/game", get(game_loop))
        .route("/game/{id}", any(player_loop))
        .route("/dialogue/{id}", any(dialogue_loop))
        .route("/integration-testable", get(integration_testable_handler));

    let api_router = Router::new()
        .route("/", get(root))
        .route("/connect/{id}", post(connect_handler));

    let (tx, _rx) = broadcast::channel(100);

    let game_state = Arc::new(Mutex::new(GameState {
        game: Game::default(),
        story: StoryState {
            json: String::from(contents),
            instructions: Vec::new(),
            player_one_ready: false,
            player_two_ready: false,
        },
        game_tx: tx,
    }));

    let game = Arc::clone(&game_state);
    let router = Router::new()
        .merge(api_router)
        .merge(game_router)
        .with_state(game_state)
        .layer(ServiceBuilder::new().layer(cors_layer));

    tokio::spawn(async move {
        println!("Starting game loop!");
        let tick_duration = Duration::from_secs_f64(1_f64 / game::TICKS_PER_SECOND);
        let mut tick_interval = interval(tick_duration);
        loop {
            // Block so that the lock drops after completion
            {
                let mut game_thread = game.lock().await;
                game_thread.server_update();
            }
            tick_interval.tick().await;
        }
    });
    return router;
}

async fn root() -> &'static str {
    "Hello, World!"
}

/// Players will connect to the game loop before player_loop.
/// They are only able to get all of the world information.
/// Connection should happen in a POST request.
async fn game_loop(ws: WebSocketUpgrade, State(game): State<Arc<Mutex<GameState>>>) -> Response {
    ws.on_upgrade(move |socket| game_websocket(socket, game))
}

async fn game_websocket(socket: WebSocket, game: Arc<Mutex<GameState>>) {
    let (sender, _) = socket.split();

    let game_clone = game.clone();
    // Subscribe to the game loop broadcast
    {
        let game_thread = game_clone.lock().await;
        let rx = game_thread.game_tx.subscribe();
        tokio::spawn(game_loop_write(sender, rx));
    }
}

async fn game_loop_write(mut sender: SplitSink<WebSocket, Message>, mut rx: Receiver<String>) {
    // Send over all game loop broadcasts
    while let Ok(msg) = rx.recv().await {
        // In any websocket error, break loop
        if sender.send(Message::text(msg)).await.is_err() {
            break;
        }
    }
}

/// Players will use this endpoint to try to connect as a player.
async fn connect_handler(
    State(game): State<Arc<Mutex<GameState>>>,
    Path(id): Path<u64>,
) -> (StatusCode, String) {
    let game_clone = game.clone();
    let mut game_thread = game_clone.lock().await;
    match id {
        1 => {
            if game_thread.game.player_one.id != Player::None {
                return (StatusCode::INTERNAL_SERVER_ERROR, "0".to_owned());
            }
        }
        2 => {
            if game_thread.game.player_two.id != Player::None {
                return (StatusCode::INTERNAL_SERVER_ERROR, "0".to_owned());
            }
        }
        _ => {}
    }
    game_thread.connect(id);
    (StatusCode::OK, id.to_string())
}

/// Players will interact with the game with their designated ID in this websocket.
async fn player_loop(
    ws: WebSocketUpgrade,
    State(game): State<Arc<Mutex<GameState>>>,
    Path(id): Path<u64>,
) -> Response {
    ws.on_upgrade(move |socket| player_websocket(socket, game, id))
}

async fn player_websocket(socket: WebSocket, game: Arc<Mutex<GameState>>, id: u64) {
    let (sender, receiver) = socket.split();

    // Subscribe to the game loop broadcast
    let game_clone = game.clone();
    {
        let mut game_thread = game_clone.lock().await;
        let rx = game_thread.game_tx.subscribe();
        game_thread.connect(id);
        tokio::spawn(player_write(sender, rx));
        tokio::spawn(player_read(receiver, game, id));
    }
}

async fn player_write(mut sender: SplitSink<WebSocket, Message>, mut rx: Receiver<String>) {
    // Send over all game loop broadcasts
    while let Ok(msg) = rx.recv().await {
        // In any websocket error, break loop
        if sender.send(Message::text(msg)).await.is_err() {
            break;
        }
    }
}

async fn player_read(mut receiver: SplitStream<WebSocket>, game: Arc<Mutex<GameState>>, id: u64) {
    while let Some(msg) = receiver.next().await {
        let mut game_ref = game.lock().await;
        if let Ok(msg) = msg {
            match msg {
                Message::Text(text) => game_ref.client_update(id, text.as_str()),
                // client disconnected
                Message::Close(_) => game_ref.disconnect(id),
                _ => {}
            }
        } else {
            // client disconnected
            game_ref.disconnect(id);
            return;
        };
    }
}

async fn dialogue_loop(
    ws: WebSocketUpgrade,
    State(game): State<Arc<Mutex<GameState>>>,
    Path(id): Path<u64>,
) -> Response {
    ws.on_upgrade(move |socket| dialogue_websocket(socket, game, id))
}

async fn dialogue_websocket(socket: WebSocket, game: Arc<Mutex<GameState>>, id: u64) {
    let (sender, receiver) = socket.split();
    let game_clone = game.clone();
    {
        let mut game_thread = game_clone.lock().await;
        let rx = game_thread.story_tx.subscribe();
        // When the player first connects, signal that the game is ready
        game_thread.update_dialogue(id);
        tokio::spawn(dialogue_write(sender, rx));
        tokio::spawn(dialogue_read(receiver, game, id));
    }
}

async fn dialogue_write(mut sender: SplitSink<WebSocket, Message>, mut rx: Receiver<String>) {
    // Send over all dialogue broadcasts
    while let Ok(msg) = rx.recv().await {
        // In any websocket error, break loop
        if sender.send(Message::text(msg)).await.is_err() {
            break;
        }
    }
}

async fn dialogue_read(mut receiver: SplitStream<WebSocket>, game: Arc<Mutex<GameState>>, id: u64) {
    while let Some(msg) = receiver.next().await {
        let mut game_ref = game.lock().await;
        if let Ok(msg) = msg {
            match msg {
                Message::Text(text) => game_ref.client_update(id, text.as_str()),
                // client disconnected
                Message::Close(_) => game_ref.disconnect(id),
                _ => {}
            }
        } else {
            // client disconnected
        }
    }
}

// A WebSocket handler that echos any message it receives.
//
// This one we'll be integration testing so it can be written in the regular way.
async fn integration_testable_handler(ws: WebSocketUpgrade) -> Response {
    ws.on_upgrade(integration_testable_handle_socket)
}

async fn integration_testable_handle_socket(mut socket: WebSocket) {
    while let Some(Ok(msg)) = socket.recv().await {
        if let Message::Text(msg) = msg {
            if socket
                .send(Message::Text(format!("You said: {msg}").into()))
                .await
                .is_err()
            {
                break;
            }
        }
    }
}
