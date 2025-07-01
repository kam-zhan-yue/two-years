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
  public body: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public animation: CharacterAnimation;
  private textureKey: PlayerAnimation;

  constructor(
    scene: Phaser.Scene,
    position: Phaser.Math.Vector2,
    textureKey: PlayerAnimation,
  ) {
    this.textureKey = textureKey;
    this.body = scene.physics.add.sprite(0, 0, textureKey);
    this.body.body.setSize(constants.playerWidth, constants.playerHeight);
    this.animation = `${textureKey}-${"idle" as BaseAnimation}-${"down" as TopDownAnimation}`;

    this.container = scene.add.container(position.x, position.y, [this.body]);
  }

  setPosition(position: Phaser.Math.Vector2) {
    this.container.setPosition(position.x, position.y);
  }

  setAnimation(animation: CharacterAnimation) {
    this.animation = animation;
    this.body.anims.play(this.animation, true);
  }

  stop() {
    this.body.setVelocity(0, 0);
  }

  play(base: BaseAnimation, animation: TopDownAnimation) {
    this.animation = `${this.textureKey}-${base}-${animation}`;
    this.body.anims.play(
      {
        key: this.animation,
        repeat: -1,
      },
      true,
    );
  }

  updateCharacter() {
    this.body.depth = this.body.y + this.body.height / 2;
  }

  putOnHead(image: GameImage, offset: Phaser.Math.Vector2) {
    this.container.add(image.image);
  }

  destroy() {
    this.body.destroy();
  }
}
