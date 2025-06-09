export type BaseAnimation = "player-idle" | "player-run";
export type TopDownAnimation = "up" | "down" | "left" | "right";
export type CharacterAnimation = `${BaseAnimation}-${TopDownAnimation}`;
