use serde::Deserialize;

use crate::types::Vector2;

#[derive(Deserialize, Clone, Debug)]
pub struct Payload {
    pub id: MessageType,
    pub position: Option<Vector2>,
}

#[derive(Deserialize, Clone, Debug)]
#[serde(rename_all = "lowercase")]
pub enum MessageType {
    Player,
}
