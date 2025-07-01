import Character from "./character";
import type InputHandler from "../handlers/input-hander";
import { constants } from "@/helpers/constants";
import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { MessageType, PlayerMessageSchema } from "../types/messages";
import { Math as PhaserMath } from "phaser";
import type {
  BaseAnimation,
  PlayerAnimation,
  TopDownAnimation,
} from "./animation";

export default class Player extends Character {
  private inputHandler: InputHandler;
  private send: SendJsonMessage;

  constructor(
    scene: Phaser.Scene,
    position: Phaser.Math.Vector2,
    textureKey: PlayerAnimation,
    inputHandler: InputHandler,
    send: SendJsonMessage,
  ) {
    super(scene, position, textureKey);
    this.inputHandler = inputHandler;
    this.send = send;
  }

  checkInputs() {
    const speed = constants.speed;
    let x = 0;
    let y = 0;

    //Handle speed
    if (this.inputHandler.isLeft()) {
      x += -speed;
    }
    if (this.inputHandler.isRight()) {
      x += speed;
    }
    if (this.inputHandler.isUp()) {
      y += -speed;
    }
    if (this.inputHandler.isDown()) {
      y += speed;
    }

    let baseAnimation: BaseAnimation = "idle";
    let topDownAnimation: TopDownAnimation = "down";
    if (y < 0) topDownAnimation = "up";
    else if (y > 0) topDownAnimation = "down";
    else if (x < 0) topDownAnimation = "left";
    else if (x > 0) topDownAnimation = "right";
    //Handle animations
    if (x === 0 && y === 0) {
      this.body.setVelocity(0, 0);
      this.play("idle", topDownAnimation);
    } else {
      const direction = new PhaserMath.Vector2(x, y).normalize();
      const velocity = direction.scale(constants.speed);
      this.setVelocity(velocity);
      baseAnimation = "run";
    }
    this.play(baseAnimation, topDownAnimation);
    this.sendMessage();
  }

  getPos() {
    return new PhaserMath.Vector2(this.body.x, this.body.y);
  }

  sendMessage() {
    const data = {
      id: MessageType.player,
      position: this.getPos(),
      animation: this.animation,
    };
    try {
      PlayerMessageSchema.parse(data);
      this.send(data);
    } catch (error) {
      console.error(
        `Validation failed for player message: ${error}\nData is ${data}`,
      );
    }
  }

  update() {
    this.checkInputs();
    this.updateCharacter();
  }
}
