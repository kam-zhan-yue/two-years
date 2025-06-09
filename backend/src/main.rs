mod game;

use std::time::Duration;

use axum::{
    extract::{
        ws::{WebSocket, WebSocketUpgrade},
        Path, State,
    },
    response::Response,
    routing::{any, get},
    Router,
};
use tokio::time::interval;

use crate::game::GameState;

#[tokio::main]
async fn main() {
    let game_router: Router<GameState> = Router::new().route("/game/{id}", any(game_loop));

    let api_router = Router::new()
        .route("/", get(root))
        .route("/ws", any(game_handler));

    let mut game_state = GameState::default();

    let router = Router::new()
        .merge(api_router)
        .merge(game_router)
        .with_state(game_state);
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8000")
        .await
        .unwrap();
    println!("Listening on http://127.0.0.1:8000");

    tokio::spawn(async move {
        println!("Starting game loop!");
        let tick_duration = Duration::from_secs_f64(1_f64 / game::TICKS_PER_SECOND);
        let mut tick_interval = interval(tick_duration);
        loop {
            game_state.tick += 1;
            tick_interval.tick().await;
        }
    });

    axum::serve(listener, router).await.unwrap();
}

async fn root() -> &'static str {
    println!("What!");
    "Hello, World!"
}

async fn game_loop(
    ws: WebSocketUpgrade,
    mut _game: State<GameState>,
    Path(_id): Path<u64>,
) -> Response {
    ws.on_upgrade(|mut socket: WebSocket| async move {
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
    })
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
