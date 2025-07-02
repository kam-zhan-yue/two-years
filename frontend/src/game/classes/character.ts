import { constants } from "@/helpers/constants";
import type {
  BaseAnimation,
  CharacterAnimation,
  PlayerAnimation,
  TopDownAnimation,
} from "./animation";
import type GameImage from "./game-image";

export default class Character {
  public container: Phaser.GameObjects.Container;
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public body: Phaser.Physics.Arcade.Body;
  public animation: CharacterAnimation;
  private textureKey: PlayerAnimation;

  constructor(
    scene: Phaser.Scene,
    position: Phaser.Math.Vector2,
    textureKey: PlayerAnimation,
  ) {
    this.textureKey = textureKey;
    this.sprite = scene.physics.add.sprite(0, 0, textureKey);
    this.sprite.body.setSize(constants.playerWidth, constants.playerHeight);
    this.animation = `${textureKey}-${"idle" as BaseAnimation}-${"down" as TopDownAnimation}`;

    this.container = scene.add.container(position.x, position.y, [this.sprite]);
    scene.physics.add.existing(this.container);
    this.body = this.container.body as Phaser.Physics.Arcade.Body;
    this.body.setSize(constants.playerWidth, constants.playerHeight);
    // Centers the body
    this.body.setOffset(
      -constants.playerWidth / 2,
      -constants.playerHeight / 2,
    );
  }

  setVelocity(velocity: Phaser.Math.Vector2) {
    this.body.setVelocity(velocity.x, velocity.y);
  }

  setPosition(position: Phaser.Math.Vector2) {
    this.body.position = new Phaser.Math.Vector2(position.x, position.y);
  }

  setAnimation(animation: CharacterAnimation) {
    this.animation = animation;
    this.sprite.anims.play(this.animation, true);
  }

  stop() {
    this.body.setVelocity(0, 0);
  }

  play(base: BaseAnimation, animation: TopDownAnimation) {
    this.animation = `${this.textureKey}-${base}-${animation}`;
    this.sprite.anims.play(
      {
        key: this.animation,
        repeat: -1,
      },
      true,
    );
  }

  updateCharacter() {
    this.container.depth = this.body.y + this.body.height / 2;
  }

  putOnHead(image: GameImage, offset: Phaser.Math.Vector2) {
    image.image.setPosition(offset.x, offset.y);
    this.container.add(image.image);
  }

  destroy() {
    this.container.destroy();
  }
}
