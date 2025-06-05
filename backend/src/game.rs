use rocket::serde::Serialize;

pub struct Game {
    pub game_state: GameState,
}

impl Default for Game {
    fn default() -> Self {
        Self {
            game_state: GameState::default(),
        }
    }
}

#[derive(Serialize, Debug)]
#[serde(crate = "rocket::serde")]
pub struct GameState {
    pub player_one: Option<PlayerState>,
    pub player_two: Option<PlayerState>,
}

impl Default for GameState {
    fn default() -> Self {
        Self {
            player_one: None,
            player_two: None,
        }
    }
}

#[derive(Serialize, Debug)]
#[serde(crate = "rocket::serde")]
pub struct PlayerState {
    id: String,
    position: Vector2,
}

#[derive(Serialize, Debug)]
#[serde(crate = "rocket::serde")]
pub struct Vector2 {
    x: f64,
    y: f64,
}

impl Default for Vector2 {
    fn default() -> Self {
        Self { x: 0f64, y: 0f64 }
    }
}
