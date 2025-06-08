mod game;

use std::sync::{Arc, Mutex};

use game::Game;
use rocket::{
    futures::{SinkExt, StreamExt},
    State,
};

#[macro_use]
extern crate rocket;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[launch]
fn rocket() -> _ {
    let game = Arc::new(Mutex::new(Game::default()));

    rocket::build()
        .mount("/", routes![index, echo_stream, game_stream])
        .manage(game)
}

#[get("/echo")]
fn echo_stream(ws: ws::WebSocket) -> ws::Stream!['static] {
    let ws = ws.config(ws::Config {
        ..Default::default()
    });

    ws::Stream! { ws =>
        for await message in ws {
            yield message?;
        }
    }
}

#[get("/game_state/<player_id>")]
fn game_stream<'r>(
    ws: ws::WebSocket,
    game: &'r State<Arc<Mutex<Game>>>,
    player_id: &'r str,
) -> ws::Channel<'r> {
    ws.channel(move |mut stream| {
        Box::pin(async move {
            // Start a Task to send the game state
            // Start another Task to wait for input
            tokio::spawn(async move { game.update() });
            while let Some(message) = stream.next().await {
                println!("Got a message! {:?} from {:?}", game.seconds, player_id);
                let _ = stream.send(message?).await;
            }
            Ok(())
        })
    })
}
