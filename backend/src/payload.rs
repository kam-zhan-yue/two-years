use serde::Deserialize;

use crate::types::Vector2;

#[derive(Deserialize, Clone, Debug)]
pub struct Payload {
    pub id: MessageType,
    pub position: Option<Vector2>,
    pub animation: Option<String>,
    pub choice: Option<i32>,
    pub interaction: Option<String>,
}

#[derive(Deserialize, Clone, Debug)]
#[serde(rename_all = "lowercase")]
pub enum MessageType {
    Player,
    Dialogue,
    Choice,
    Interaction,
}
