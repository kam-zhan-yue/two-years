mod game;

use axum::{
    extract::{
        ws::{WebSocket, WebSocketUpgrade},
        State,
    },
    http::StatusCode,
    response::Response,
    routing::{any, get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};

use crate::game::GameState;

#[tokio::main]
async fn main() {
    let game_router: Router<GameState> =
        Router::new().route("/game", get(|_: State<GameState>| async {}));
    let api_router = Router::new()
        .route("/", get(root))
        .route("/new", get(root))
        .route("/users", post(create_user))
        .route("/ws", any(game_handler));
    let router = Router::new()
        .merge(api_router)
        .merge(game_router)
        .with_state(GameState {});
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8000")
        .await
        .unwrap();
    println!("Listening on http://127.0.0.1:8000");
    axum::serve(listener, router).await.unwrap();
}

async fn root() -> &'static str {
    println!("What!");
    "Hello, World!"
}

async fn create_user(Json(payload): Json<CreateUser>) -> (StatusCode, Json<User>) {
    println!("What!");
    let user = User {
        id: 1337,
        username: payload.username,
    };

    (StatusCode::CREATED, Json(user))
}

#[derive(Deserialize)]
struct CreateUser {
    username: String,
}

#[derive(Serialize)]
struct User {
    id: u64,
    username: String,
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
