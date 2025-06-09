import type { TopDownAnimation } from "./animation";

export default class Character {
  public physics: Phaser.Physics.Arcade.ArcadePhysics;
  public body: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public animation: TopDownAnimation;

  constructor(
    physics: Phaser.Physics.Arcade.ArcadePhysics,
    position: Phaser.Math.Vector2,
    textureKey: string,
  ) {
    this.physics = physics;
    this.body = this.physics.add.sprite(position.x, position.y, textureKey);
    this.animation = "down";
  }

  setPosition(position: Phaser.Math.Vector2) {
    this.body.setPosition(position.x, position.y);
  }

  stop() {
    this.body.setVelocity(0, 0);
  }

  play(animationName: string) {
    this.body.anims.play(`${animationName}-${this.animation}`, true);
  }

  updateCharacter() {
    this.body.depth = this.body.y + this.body.height / 2;
  }

  destroy() {
    this.body.destroy();
  }
}
