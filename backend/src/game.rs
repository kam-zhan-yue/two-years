pub const TICKS_PER_SECOND: f64 = 120_f64;

#[derive(Debug, Clone, Copy)]
pub struct GameState {
    pub game: Game,
    pub tick: i64,
}

impl Default for GameState {
    fn default() -> Self {
        Self {
            game: Game::default(),
            tick: 0,
        }
    }
}

#[derive(Debug, Clone, Copy)]
pub struct Game {}

impl Default for Game {
    fn default() -> Self {
        Self {}
    }
}
