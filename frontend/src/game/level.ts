import { Math, Scene } from "phaser";
import GameImage from "./classes/game-image";
import Player from "./classes/player";
import Npc from "./classes/npc";
import InputHandler from "./handlers/input-hander";
import createCharacterAnims from "./handlers/animation-handler";
import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import type { GameState } from "./types/game-state";
import { constants } from "@/helpers/constants";

export class Level extends Scene {
  public state: "game" | "ui";
  private id: number;
  private npc?: Npc;
  private player?: Player;
  private inputHandler?: InputHandler;

  constructor() {
    super({ key: "Main" });
    this.state = "game";
    this.id = 0;
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

  initPlayer(id: number, send: SendJsonMessage) {
    this.id = id;
    if (!this.player && this.inputHandler) {
      this.player = new Player(
        this.physics,
        new Math.Vector2(0, 0),
        "player",
        this.inputHandler,
        send,
      );
      this.cameras.main.startFollow(this.player.body, false);
    }
  }

  removePlayer() {
    this.player?.body.destroy();
    this.player = undefined;
  }

  initNpc() {
    if (!this.npc) {
      this.npc = new Npc(this.physics, new Math.Vector2(0, 0), "player");
    }
  }

  removeNpc() {
    this.npc?.body.destroy();
    this.npc = undefined;
  }

  create() {
    this.setupGame();
  }

  updateState(state: GameState) {
    const npcState =
      this.id === constants.playerTwo ? state.playerOne : state.playerTwo;
    if (npcState) {
      this.npc?.update(npcState);
    }
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
