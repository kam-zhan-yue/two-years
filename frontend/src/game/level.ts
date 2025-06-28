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
import type { PlayerState } from "./types/player-state";
import type { Interaction } from "./types/story-state";
import { Start } from "./classes/setups/start";
import { InteractionHandler } from "./handlers/interaction-handler";
import { InteractionMessageSchema, MessageType } from "./types/messages";
import { PicnicContinue } from "./classes/setups/picnic-continue";

export class Level extends Scene {
  public state: "game" | "ui";
  public player?: Player;
  private id: string;
  private playerOneNpc?: Npc;
  private playerTwoNpc?: Npc;
  private inputHandler?: InputHandler;
  private interactionHandler?: InteractionHandler;
  private sendDialogue?: SendJsonMessage;

  constructor() {
    super({ key: "Main" });
    this.state = "game";
    this.id = constants.emptyId;
  }

  setupGame() {
    this.inputHandler = new InputHandler(this);
    this.interactionHandler = new InteractionHandler(this);
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

  initDialogue(sendDialogue: SendJsonMessage) {
    console.info("Inited Dialogue");
    this.sendDialogue = sendDialogue;
  }

  initPlayer(id: string, send: SendJsonMessage) {
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

  create() {
    this.setupGame();
  }

  setInteraction(interaction: Interaction) {
    if (!this.interactionHandler) return;
    console.info(`Setting interaction to ${interaction}`);
    this.interactionHandler.reset();
    if (interaction === "GAME_START") {
      new Start(this, interaction, this.interactionHandler);
    } else if (interaction === "COFFEE") {
    } else if (interaction === "PICNIC_CONTINUE") {
      new PicnicContinue(this, interaction, this.interactionHandler);
    }
  }

  update(_time: number, _delta: number) {
    const state = useGameStore.getState().gameState;
    this.updateState(state);

    if (this.player) {
      switch (this.state) {
        case "game":
          this.interactionHandler?.update();
          this.player.update();
          break;
        case "ui":
          break;
      }
    }

    if (this.inputHandler?.isInteractDown()) {
      const interaction = this.interactionHandler?.getCurrentInteraction();
      if (interaction?.interaction) {
        this.sendInteraction(interaction.interaction);
      } else if (interaction) {
        console.info(`Locally interact with ${interaction.getId()}`);
      }
    }
  }

  sendInteraction(interaction: Interaction) {
    console.info(`Send interact to server ${interaction}`);
    const data = {
      id: MessageType.interaction,
      interaction,
    };
    try {
      InteractionMessageSchema.parse(data);
      this.sendDialogue?.(data);
    } catch (error) {
      console.error(
        `Validation failed for interaction message: ${error}\nData is ${data}`,
      );
    }
  }

  updateState(state: GameState) {
    this.checkNpc(state);
  }

  checkNpc(state: GameState) {
    // If our id is currently unset, we want to show NPCs that represent the other players
    if (this.id === constants.emptyId) {
      this.updateNpc(state.playerOne, constants.playerOne);
      this.updateNpc(state.playerTwo, constants.playerTwo);
    } else {
      const otherId =
        this.id === constants.playerTwo
          ? constants.playerOne
          : constants.playerTwo;
      const otherPlayer =
        this.id === constants.playerTwo ? state.playerOne : state.playerTwo;
      this.updateNpc(otherPlayer, otherId);
    }
  }

  updateNpc(player: PlayerState, id: string) {
    // If the player is empty, destroy it and move on
    if (player.id === constants.emptyId) {
      if (id === constants.playerOne) {
        this.playerOneNpc?.destroy();
        this.playerOneNpc = undefined;
      } else if (id === constants.playerTwo) {
        this.playerTwoNpc?.destroy();
        this.playerTwoNpc = undefined;
      }
      return;
    }

    let npc =
      id === constants.playerOne ? this.playerOneNpc : this.playerTwoNpc;
    // Else, simulate the npc
    if (!npc) {
      console.log(`Creating an NPC for ${id}`);
      if (id === constants.playerOne) {
        this.playerOneNpc = new Npc(
          this.physics,
          new Math.Vector2(0, 0),
          "player",
        );
      } else if (id === constants.playerTwo) {
        this.playerTwoNpc = new Npc(
          this.physics,
          new Math.Vector2(0, 0),
          "player",
        );
      }
    }
    if (id === constants.playerOne) {
      this.playerOneNpc?.update(player);
    } else if (id === constants.playerTwo) {
      this.playerTwoNpc?.update(player);
    }
  }
}
