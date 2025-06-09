use tokio::sync::broadcast;

pub const TICKS_PER_SECOND: f64 = 120_f64;

#[derive(Debug, Clone)]
pub struct GameState {
    pub game: Game,
    pub tick: i64,
    pub tx: broadcast::Sender<String>,
}

impl GameState {
    pub fn update(&mut self) {
        self.tick += 1;
        self.tx
            .send(String::from(format!("Tick is {}", self.tick)))
            .unwrap();
    }
}

#[derive(Debug, Clone, Copy)]
pub struct Game {}

impl Default for Game {
    fn default() -> Self {
        Self {}
    }
}
