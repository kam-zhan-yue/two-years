mod game;

use std::{sync::Arc, time::Duration};

use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        Path, State,
    },
    response::Response,
    routing::{any, get},
    Router,
};
use futures_util::{
    stream::{SplitSink, SplitStream, StreamExt},
    SinkExt,
};
use tokio::{
    sync::broadcast::{self, Receiver},
    time::interval,
};

use crate::game::{Game, GameState};

#[tokio::main]
async fn main() {
    let game_router: Router<Arc<GameState>> = Router::new().route("/game/{id}", any(game_loop));

    let api_router = Router::new()
        .route("/", get(root))
        .route("/ws", any(game_handler));

    let (tx, _rx) = broadcast::channel(100);

    let game_state = Arc::new(GameState {
        game: Game::default(),
        tick: 0,
        tx: tx,
    });

    let router = Router::new()
        .merge(api_router)
        .merge(game_router)
        .with_state(game_state);
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8000")
        .await
        .unwrap();
    println!("Listening on http://127.0.0.1:8000");

    // let game = game_state.clone();
    // tokio::spawn(async move {
    //     println!("Starting game loop!");
    //     let tick_duration = Duration::from_secs_f64(1_f64 / game::TICKS_PER_SECOND);
    //     let mut tick_interval = interval(tick_duration);
    //     loop {
    //         game.tick += 1;
    //         tick_interval.tick().await;
    //     }
    // });

    axum::serve(listener, router).await.unwrap();
}

async fn root() -> &'static str {
    println!("What!");
    "Hello, World!"
}

async fn game_loop(
    ws: WebSocketUpgrade,
    State(game): State<Arc<GameState>>,
    Path(id): Path<u64>,
) -> Response {
    ws.on_upgrade(|socket| game_websocket(socket, game, id))
}

async fn game_websocket(socket: WebSocket, game: Arc<GameState>, id: u64) {
    let (sender, receiver) = socket.split();

    // Subscribe to the game loop broadcast
    let rx = game.tx.subscribe();
    let msg = format!("Player {} Joined.", id);
    let _ = game.tx.send(msg);

    tokio::spawn(write(sender, rx));
    tokio::spawn(read(receiver, game, id));
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

async fn read(mut receiver: SplitStream<WebSocket>, game: Arc<GameState>, id: u64) {
    while let Some(msg) = receiver.next().await {
        let msg = if let Ok(msg) = msg {
            // process the message here for the game state
        } else {
            // client disconnected
            return;
        }
    }
}

async fn game_handler(ws: WebSocketUpgrade) -> Response {
    ws.on_upgrade(handle_socket)
}

async fn handle_socket(mut socket: WebSocket) {
    while let Some(msg) = socket.recv().await {
        let msg = if let Ok(msg) = msg {
            msg
        } else {
            // client disconnected
            return;
        };

        if socket.send(msg).await.is_err() {
            //client disconnected
            return;
        }
    }
}
