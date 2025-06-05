mod game;

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
    let game: Game = Game::default();

    rocket::build()
        .mount("/", routes![index, echo_stream, game_stream])
        .manage(game)
}

#[get("/echo")]
fn echo_stream(ws: ws::WebSocket) -> ws::Stream!['static] {
    let ws = ws.config(ws::Config {
        write_buffer_size: 10usize,
        max_write_buffer_size: 100usize,
        ..Default::default()
    });

    ws::Stream! { ws =>
        for await message in ws {
            yield message?;
        }
    }
}

#[get("/game_state/<player_id>")]
fn game_stream(ws: ws::WebSocket, game: State<Game>, player_id: &str) -> ws::Channel<'static> {
    ws.channel(move |mut stream| {
        Box::pin(async move {
            while let Some(message) = stream.next().await {
                println!("Got a message!");
                let _ = stream.send(message?).await;
            }
            Ok(())
        })
    })
}
