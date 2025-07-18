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
