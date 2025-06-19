use serde::{Deserialize, Serialize};

use crate::types::Vector2;

pub const PLAYER_ONE: u64 = 1;
pub const PLAYER_TWO: u64 = 2;

#[derive(Serialize, Deserialize, Copy, Clone, Debug, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum Player {
    #[serde(rename = "P1")]
    One,
    #[serde(rename = "P2")]
    Two,
}

impl Player {
    pub fn from_str(s: &str) -> Self {
        match s {
            "P1" => Player::One,
            "P2" => Player::Two,
            _ => panic!("Unknown speaker: {:?}", s),
        }
    }

    pub fn from_id(id: u64) -> Self {
        match id {
            PLAYER_ONE => Player::One,
            PLAYER_TWO => Player::Two,
            _ => panic!("Unknown speaker: {:?}", id),
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct PlayerState {
    pub id: Player,
    pub position: Vector2,
    pub animation: String,
}
