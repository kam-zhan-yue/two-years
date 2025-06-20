use serde::Serialize;
use tokio::sync::broadcast;

use crate::{
    payload::{MessageType, Payload},
    player::{Player, PlayerState, PLAYER_ONE, PLAYER_TWO},
    story::StoryState,
    types::Vector2,
};

pub const TICKS_PER_SECOND: f64 = 120_f64;

#[derive(Debug, Clone)]
pub struct GameState {
    pub game: Game,
    pub story: StoryState,
    pub tick: i64,
    pub tx: broadcast::Sender<String>,
}

impl GameState {
    pub fn server_update(&mut self) {
        // self.tick += 1;
        if let Ok(game_state) = serde_json::to_string(&self.game) {
            // Don't error out if there are no receivers
            if let Err(_) = self.tx.send(game_state) {}
        }
    }

    pub fn client_update(&mut self, id: u64, payload: &str) {
        let payload: Payload = serde_json::from_str(payload).unwrap();
        self.game.client_update(id, payload);
    }

    pub fn connect(&mut self, id: u64) {
        println!("Player {} has connected!", id);
        let player = PlayerState {
            id: Player::from_id(id),
            position: Vector2::default(),
            animation: String::from("player-idle-down"),
        };
        match id {
            PLAYER_ONE => self.game.player_one = player,
            PLAYER_TWO => self.game.player_two = player,
            _ => {}
        }
    }

    pub fn disconnect(&mut self, id: u64) {
        println!("Player {} has disconnected!", id);
        match id {
            PLAYER_ONE => self.game.player_one = PlayerState::default(),
            PLAYER_TWO => self.game.player_two = PlayerState::default(),
            _ => {}
        }
    }
}

#[derive(Serialize, Debug, Clone)]
pub struct Game {
    player_one: PlayerState,
    player_two: PlayerState,
}

impl Default for Game {
    fn default() -> Self {
        Self {
            player_one: PlayerState::default(),
            player_two: PlayerState::default(),
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

    fn get_player(&mut self, id: u64) -> Option<&mut PlayerState> {
        if id == PLAYER_ONE {
            Some(&mut self.player_one)
        } else if id == PLAYER_TWO {
            Some(&mut self.player_two)
        } else {
            None
        }
    }
}
