use serde::Serialize;
use tokio::sync::broadcast;

use crate::{
    payload::{MessageType, Payload},
    player::{Player, PlayerState, PLAYER_ONE, PLAYER_TWO},
    story::{StoryNode, StoryState},
    types::Vector2,
};

pub const TICKS_PER_SECOND: f64 = 120_f64;

#[derive(Debug, Clone)]
pub struct GameState {
    pub game: Game,
    pub story: StoryState,
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
        match payload.id {
            MessageType::Player => self.game.update_player(id, payload),
            MessageType::Dialogue => self.update_dialogue(id),
            MessageType::Choice => self.update_choice(payload),
        }
    }

    pub fn update_dialogue(&mut self, id: u64) {
        let story = &mut self.story;
        story.update_dialogue(id);
        if story.can_continue() {
            let node = self.story.get_node();
            self.broadcast_story_node(node);
        }
    }

    pub fn update_choice(&mut self, payload: Payload) {
        if let Some(choice) = payload.choice {
            let node = self.story.choose(choice);
            self.broadcast_story_node(node);
        }
    }

    fn broadcast_story_node(&mut self, node: StoryNode) {
        self.story.reset_players();
        if let Ok(node) = serde_json::to_string(&node) {
            if let Err(_) = self.tx.send(node) {}
        }
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

        // When the player first connects, signal that the game is ready
        self.update_dialogue(id);
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
    pub player_one: PlayerState,
    pub player_two: PlayerState,
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
    pub fn update_player(&mut self, id: u64, payload: Payload) {
        if let Some(player) = self.get_player(id) {
            if let Some(position) = payload.position {
                player.position = position;
            }
            if let Some(animation) = payload.animation {
                player.animation = animation;
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
