import type {
  BaseAnimation,
  CharacterAnimation,
  TopDownAnimation,
} from "./animation";

export default class Character {
  public physics: Phaser.Physics.Arcade.ArcadePhysics;
  public body: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public animation: CharacterAnimation;

  constructor(
    physics: Phaser.Physics.Arcade.ArcadePhysics,
    position: Phaser.Math.Vector2,
    textureKey: string,
  ) {
    this.physics = physics;
    this.body = this.physics.add.sprite(position.x, position.y, textureKey);
    this.animation = "player-idle-down";
  }

  setPosition(position: Phaser.Math.Vector2) {
    this.body.setPosition(position.x, position.y);
  }

  setAnimation(animation: CharacterAnimation) {
    this.animation = animation;
    this.body.anims.play(this.animation, true);
  }

  stop() {
    this.body.setVelocity(0, 0);
  }

  play(base: BaseAnimation, animation: TopDownAnimation) {
    this.animation = `${base}-${animation}`;
    this.body.anims.play(this.animation, true);
  }

  updateCharacter() {
    this.body.depth = this.body.y + this.body.height / 2;
  }

  destroy() {
    this.body.destroy();
  }
}
