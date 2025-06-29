export type PlayerAnimation = "alex" | "wato";
export type BaseAnimation = "idle" | "run";
export type TopDownAnimation = "up" | "down" | "left" | "right";
export type CharacterAnimation =
  `${PlayerAnimation}-${BaseAnimation}-${TopDownAnimation}`;
