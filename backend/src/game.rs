use serde::Serialize;
use tokio::sync::broadcast;

use crate::{
    payload::{MessageType, Payload},
    types::Player,
};

pub const TICKS_PER_SECOND: f64 = 120_f64;
pub const PLAYER_ONE: u64 = 1;
pub const PLAYER_TWO: u64 = 2;

#[derive(Debug, Clone)]
pub struct GameState {
    pub game: Game,
    pub tick: i64,
    pub tx: broadcast::Sender<String>,
}

impl GameState {
    pub fn server_update(&mut self) {
        self.tick += 1;
        if let Ok(game_state) = serde_json::to_string(&self.game) {
            self.tx.send(game_state).unwrap();
        }
    }

    pub fn client_update(&mut self, id: u64, payload: &str) {
        let payload: Payload = serde_json::from_str(payload).unwrap();
        self.game.client_update(id, payload);
    }

    pub fn connect(&mut self, id: u64) {
        println!("Player {} has connected!", id);
        match id {
            PLAYER_ONE => self.game.player_one = Some(Player::default()),
            PLAYER_TWO => self.game.player_two = Some(Player::default()),
            _ => {}
        }
    }

    pub fn disconnect(&mut self, id: u64) {
        println!("Player {} has disconnected!", id);
        match id {
            PLAYER_ONE => self.game.player_one = None,
            PLAYER_TWO => self.game.player_two = None,
            _ => {}
        }
    }
}

#[derive(Serialize, Debug, Clone)]
pub struct Game {
    player_one: Option<Player>,
    player_two: Option<Player>,
}

impl Default for Game {
    fn default() -> Self {
        Self {
            player_one: None,
            player_two: None,
        }
    }
}

impl Game {
    pub fn client_update(&mut self, id: u64, payload: Payload) {
        match payload.id {
            MessageType::Player => {
                if let Some(player) = self.get_player(id) {
                    if let Some(position) = payload.position {
                        player.position = position;
                    }
                    if let Some(animation) = payload.animation {
                        player.animation = animation;
                    }
                }
            }
        }
    }

    fn get_player(&mut self, id: u64) -> Option<&mut Player> {
        if id == PLAYER_ONE {
            self.player_one.as_mut()
        } else if id == PLAYER_TWO {
            self.player_two.as_mut()
        } else {
            None
        }
    }
}
