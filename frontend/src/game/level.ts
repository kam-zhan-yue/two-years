import { Math, Scene } from "phaser";
import GameImage from "./classes/game-image";
import Player from "./classes/player";
import Npc from "./classes/npc";
import InputHandler from "./handlers/input-hander";
import createCharacterAnims from "./handlers/animation-handler";
import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import type { GameState } from "./types/game-state";
import { constants } from "@/helpers/constants";
import { useGameStore } from "@/store";

export class Level extends Scene {
  public state: "game" | "ui";
  private id: number;
  private npc?: Npc;
  private player?: Player;
  private inputHandler?: InputHandler;
  private gameState: GameState;

  constructor(gameState: GameState) {
    super({ key: "Main" });
    this.state = "game";
    this.id = 0;
    this.gameState = gameState;
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
      console.log("Creating a new Player");
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
    this.player?.destroy();
    this.player = undefined;
  }

  initNpc() {
    if (!this.npc) {
      console.log("Creating a new NPC");
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

  update(_time: number, _delta: number) {
    const state = useGameStore.getState().gameState;
    this.updateState(state);

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

  updateState(state: GameState) {
    this.checkNpc(state);
  }

  checkNpc(state: GameState) {
    // console.log(`State is ${JSON.stringify(state, null, 2)}`);
    const npcState =
      this.id === constants.playerTwo ? state.playerOne : state.playerTwo;
    // There is a state, but there is no NPC, then make an NPC
    if (npcState) {
      if (!this.npc) {
        console.log("Creating an NPC");
        this.npc = new Npc(this.physics, new Math.Vector2(0, 0), "player");
      }
      this.npc?.update(npcState);
    } else {
      this.npc?.destroy();
      this.npc = undefined;
    }
  }
}
