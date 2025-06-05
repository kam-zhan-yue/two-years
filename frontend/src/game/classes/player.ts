import Character from "./character";
import type InputHandler from "../handlers/input-hander";
import { constants } from "@/helpers/constants";
import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { MessageType, PlayerMessageSchema } from "../types/messages";
import { Math as PhaserMath } from "phaser";

export default class Player extends Character {
  private id: string;
  private inputHandler: InputHandler;
  private send: SendJsonMessage;

  constructor(
    id: string,
    physics: Phaser.Physics.Arcade.ArcadePhysics,
    position: Phaser.Math.Vector2,
    textureKey: string,
    inputHandler: InputHandler,
    send: SendJsonMessage,
  ) {
    super(physics, position, textureKey);
    this.id = id;
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
    if (y < 0) this.animation = "up";
    else if (y > 0) this.animation = "down";
    else if (x < 0) this.animation = "left";
    else if (x > 0) this.animation = "right";
    //Handle animations
    if (x === 0 && y === 0) {
      this.body.setVelocity(0, 0);
      this.play("player-idle");
    } else {
      this.sendMessage();
      const direction = new PhaserMath.Vector2(x, y).normalize();
      const velocity = direction.scale(constants.speed);
      this.body.setVelocity(velocity.x, velocity.y);
      this.play("player-run");
    }
  }

  getPos() {
    return new PhaserMath.Vector2(this.body.x, this.body.y);
  }

  sendMessage() {
    const data = {
      message_id: MessageType.player,
      player_id: this.id,
      position: this.getPos(),
      animation: this.animation,
    };
    try {
      PlayerMessageSchema.parse(data);
      this.send(data);
    } catch (error) {
      console.error("Validation failed for player message: ", error);
    }
  }

  update() {
    this.checkInputs();
    // this.updateCharacter();
  }
}
