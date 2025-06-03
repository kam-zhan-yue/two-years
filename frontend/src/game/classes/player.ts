import Character from "./character";
import type InputHandler from "./input-hander";

export default class Player extends Character {
  private lastFacingDirection: "up" | "down" | "left" | "right";
  private inputHandler: InputHandler

  constructor(
    physics: Phaser.Physics.Arcade.ArcadePhysics,
    position: Phaser.Math.Vector2,
    textureKey: string,
    inputHandler: InputHandler
  ) {
    super(physics, position, textureKey)
    this.lastFacingDirection = 'down'
    this.inputHandler = inputHandler
  }

  checkInputs() {
    const speed = 100;

    let x: number = 0;
    let y: number = 0;

    //Handle speed
    if (this.inputHandler.isLeft()) {
      x = -speed;
      this.body.setVelocity(-speed, 0);
      this.lastFacingDirection = "left";
    } else if (this.inputHandler.isRight()) {
      x = speed;
      this.body.setVelocity(speed, 0);
      this.lastFacingDirection = "right";
    }
    if (this.inputHandler.isUp()) {
      y = -speed;
      this.body.setVelocity(0, -speed);
      this.lastFacingDirection = "up";
    } else if (this.inputHandler.isDown()) {
      y = speed;
      this.body.setVelocity(0, speed);
      this.lastFacingDirection = "down";
    }

    //Handle animations
    if (y < 0) this.body.anims.play("player-run-up", true);
    else if (y > 0) this.body.anims.play("player-run-down", true);
    else if (x < 0) this.body.anims.play("player-run-left", true);
    else if (x > 0) this.body.anims.play("player-run-right", true);
    if (x === 0 && y === 0) {
      this.idle();
    }
    this.body.setVelocity(x, y);
  }

  idle() {
    this.body.setVelocity(0, 0);
    switch (this.lastFacingDirection) {
      case "up":
        this.body.anims.play("player-idle-up", true);
        break;
      case "down":
        this.body.anims.play("player-idle-down", true);
        break;
      case "left":
        this.body.anims.play("player-idle-left", true);
        break;
      case "right":
        this.body.anims.play("player-idle-right", true);
        break;
    }
  }

  update() {
    this.checkInputs()
    this.updateCharacter()
  }
}
