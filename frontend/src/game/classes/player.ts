import Character from "./character";
import type InputHandler from "../handlers/input-hander";
import { constants } from "@/helpers/constants";
import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { MessageType, PlayerMessageSchema } from "../types/messages";

export default class Player extends Character {
  private id: string
  private inputHandler: InputHandler
  private send: SendJsonMessage

  constructor(
    id: string,
    physics: Phaser.Physics.Arcade.ArcadePhysics,
    position: Phaser.Math.Vector2,
    textureKey: string,
    inputHandler: InputHandler,
    send: SendJsonMessage
  ) {
    super(physics, position, textureKey)
    this.id = id
    this.inputHandler = inputHandler
    this.send = send
  }

  checkInputs() {
    const speed = constants.speed
    let x: number = 0;
    let y: number = 0;

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
    if (y < 0) this.animation = 'up';
    else if (y > 0) this.animation = 'down'
    else if (x < 0) this.animation = 'left'
    else if (x > 0) this.animation = 'right'
    //Handle animations
    if (x === 0 && y === 0) {
      this.body.setVelocity(0, 0);
      this.play('player-idle')
    } else {
      this.body.setVelocity(x, y);
      this.play('player-run')
    }
    this.sendMessage()
  }

  sendMessage() {
    const data = {
      message_id: MessageType.player,
      player_id: this.id,
      animation: this.animation
    }
    try {
      PlayerMessageSchema.parse(data)
      this.send(data)
    } catch (error) {
      console.error("Validation failed for player message: ", error);
    }
  }

  update() {
    this.checkInputs()
    this.updateCharacter()
  }
}
