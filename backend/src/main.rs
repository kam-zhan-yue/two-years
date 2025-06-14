mod game;
mod payload;
mod types;

use std::{sync::Arc, time::Duration};

use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        Path, State,
    },
    http::Method,
    response::Response,
    routing::{any, get},
    Router,
};
use futures_util::{
    lock::Mutex,
    stream::{SplitSink, SplitStream, StreamExt},
    SinkExt,
};
use serde_json::json;
use tokio::{
    sync::broadcast::{self, Receiver},
    time::interval,
};
use tower::ServiceBuilder;
use tower_http::cors::CorsLayer;

use crate::game::{Game, GameState};

#[tokio::main]
async fn main() {
    let cors_layer = CorsLayer::new()
        .allow_origin(["https://two-years-g1l1.onrender.com".parse().unwrap()])
        .allow_methods([Method::GET, Method::POST]);

    let game_router: Router<Arc<Mutex<GameState>>> =
        Router::new().route("/game/{id}", any(game_loop));

    let api_router = Router::new()
        .route("/", get(root))
        .route("/ws", any(game_handler));

    let (tx, _rx) = broadcast::channel(100);

    let game_state = Arc::new(Mutex::new(GameState {
        game: Game::default(),
        tick: 0,
        tx: tx,
    }));

    let game = Arc::clone(&game_state);

    let router = Router::new()
        .merge(api_router)
        .merge(game_router)
        .with_state(game_state)
        .layer(ServiceBuilder::new().layer(cors_layer));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
    println!("Listening on http://0.0.0.0:8000");

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

    axum::serve(listener, router).await.unwrap();
}

async fn root() -> &'static str {
    "Hello, World!"
}

async fn game_loop(
    ws: WebSocketUpgrade,
    State(game): State<Arc<Mutex<GameState>>>,
    Path(id): Path<u64>,
) -> Response {
    ws.on_upgrade(move |socket| game_websocket(socket, game, id))
}

async fn game_websocket(socket: WebSocket, game: Arc<Mutex<GameState>>, id: u64) {
    let (sender, receiver) = socket.split();

    // Subscribe to the game loop broadcast
    let game_clone = game.clone();
    {
        let mut game_thread = game_clone.lock().await;
        let rx = game_thread.tx.subscribe();
        game_thread.connect(id);
        tokio::spawn(write(sender, rx));
        tokio::spawn(read(receiver, game, id));
    }
}

async fn write(mut sender: SplitSink<WebSocket, Message>, mut rx: Receiver<String>) {
    // Send over all game loop broadcasts
    while let Ok(msg) = rx.recv().await {
        // In any websocket error, break loop
        if sender.send(Message::text(msg)).await.is_err() {
            break;
        }
    }
}

async fn read(mut receiver: SplitStream<WebSocket>, game: Arc<Mutex<GameState>>, id: u64) {
    while let Some(msg) = receiver.next().await {
        let mut game_ref = game.lock().await;
        if let Ok(msg) = msg {
            match msg {
                Message::Text(text) => {
                    game_ref.client_update(id, text.as_str());
                }
                Message::Close(_) => {
                    // client disconnected
                    game_ref.disconnect(id);
                }
                _ => {}
            }
        } else {
            // client disconnected
            game_ref.disconnect(id);
            return;
        };
    }
}

async fn game_handler(ws: WebSocketUpgrade) -> Response {
    ws.on_upgrade(handle_socket)
}

async fn handle_socket(mut socket: WebSocket) {
    let json = json!({
        "message": "Connected!",
    });
    let json_string = serde_json::to_string(&json).unwrap();
    socket.send(Message::text(json_string)).await.unwrap();
}
