use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Vector2 {
    x: f64,
    y: f64,
}

impl Default for Vector2 {
    fn default() -> Self {
        Self { x: 0_f64, y: 0_f64 }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "lowercase")]
pub enum Animation {
    Up,
    Down,
    Left,
    Right,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Player {
    pub position: Vector2,
    pub animation: Animation,
}

impl Default for Player {
    fn default() -> Self {
        Self {
            position: Vector2::default(),
            animation: Animation::Down,
        }
    }
}
