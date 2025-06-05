import { Math, Scene } from "phaser";
import GameImage from "./classes/game-image";
import Player from "./classes/player";
import type Npc from "./classes/npc";
import InputHandler from "./handlers/input-hander";
import createCharacterAnims from "./handlers/animation-handler";
import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";

export class Main extends Scene {
  public state: "game" | "ui";
  private other?: Npc;
  private player?: Player;
  private inputHandler?: InputHandler;

  constructor() {
    super({ key: "Main" });
    this.state = "game";
  }

  setupGame() {
    this.inputHandler = new InputHandler(this);
    const island = new GameImage(
      this,
      new Phaser.Math.Vector2(0, 0),
      "island",
      -100,
    );
    this.cameras.main.centerOn(island.image.x, island.image.y);
    this.cameras.main.setZoom(3);
    createCharacterAnims(this.anims);
  }

  initPlayer(id: string, send: SendJsonMessage) {
    if (!this.player && this.inputHandler) {
      this.player = new Player(
        id,
        this.physics,
        new Math.Vector2(0, 0),
        "player",
        this.inputHandler,
        send,
      );
      this.cameras.main.startFollow(this.player.body, false);
    }
  }

  create() {
    this.setupGame();
  }

  update(_time: number, _delta: number) {
    if (this.player) {
      switch (this.state) {
        case "game":
          this.player.update();
          break;
        case "ui":
          break;
      }
    }
  }
}
