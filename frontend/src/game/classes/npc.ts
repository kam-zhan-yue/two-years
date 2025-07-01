import type { PlayerState } from "../types/player-state";
import type { PlayerAnimation } from "./animation";
import Character from "./character";

export default class Npc extends Character {
  constructor(
    scene: Phaser.Scene,
    position: Phaser.Math.Vector2,
    textureKey: PlayerAnimation,
  ) {
    super(scene, position, textureKey);
  }

  update(state: PlayerState) {
    this.setPosition(state.position);
    this.setAnimation(state.animation);
    this.updateCharacter();
  }
}
