import type { PlayerState } from "../types/player-state";
import type { PlayerAnimation } from "./animation";
import Character from "./character";

export default class Npc extends Character {
  constructor(
    physics: Phaser.Physics.Arcade.ArcadePhysics,
    position: Phaser.Math.Vector2,
    textureKey: PlayerAnimation,
  ) {
    super(physics, position, textureKey);
  }

  update(state: PlayerState) {
    this.setPosition(state.position);
    this.setAnimation(state.animation);
    this.updateCharacter();
  }
}
