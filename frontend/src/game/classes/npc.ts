import type { PlayerState } from "../types/player-state";
import Character from "./character";

export default class Npc extends Character {
  private prevPos: Phaser.Math.Vector2;

  constructor(
    physics: Phaser.Physics.Arcade.ArcadePhysics,
    position: Phaser.Math.Vector2,
    textureKey: string,
  ) {
    super(physics, position, textureKey);
    this.prevPos = position;
  }

  update(state: PlayerState) {
    this.setPosition(state.position);
  }
}
