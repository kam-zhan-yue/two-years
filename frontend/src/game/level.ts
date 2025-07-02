import { Scene } from "phaser";
import GameImage from "./classes/game-image";
import Player from "./classes/player";
import Npc from "./classes/npc";
import InputHandler from "./handlers/input-hander";
import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import type { GameState } from "./types/game-state";
import { constants } from "@/helpers/constants";
import { useGameStore } from "@/store";
import type { PlayerState } from "./types/player-state";
import type { Action, Interaction } from "./types/story-state";
import { GameStart } from "./classes/setups/game-start";
import { InteractionHandler } from "./handlers/interaction-handler";
import { InteractionMessageSchema, MessageType } from "./types/messages";
import { PicnicContinue } from "./classes/setups/picnic-continue";
import createCharacterAnims from "./handlers/animation-handler";
import ObstacleHandler from "./handlers/obstacle.handler";
import { PicnicBasket } from "./classes/setups/picnic-basket";
import { BasketReturn } from "./classes/setups/basket-return";
import { GiftStart } from "./classes/setups/gift-start";
import type Character from "./classes/character";
import { Shark } from "./classes/actions/shark";
import { Bracelet } from "./classes/actions/bracelet";
import { IceCream } from "./classes/actions/ice-cream";
import { WaterBottle } from "./classes/actions/water-bottle";
import { Flowers } from "./classes/actions/flowers";

const PLAYER_ONE_SPAWN = new Phaser.Math.Vector2(-20, -70);
const PLAYER_TWO_SPAWN = new Phaser.Math.Vector2(20, -70);

export class Level extends Scene {
  public player?: Player;
  private id: string;
  private playerOneNpc?: Npc;
  private playerTwoNpc?: Npc;
  private inputHandler?: InputHandler;
  private interactionHandler?: InteractionHandler;
  private obstacleHandler?: ObstacleHandler;
  private sendDialogue?: SendJsonMessage;

  constructor() {
    super({ key: "Main" });
    this.id = constants.emptyId;
  }

  setupGame() {
    this.anims.createFromAseprite("alex");
    this.anims.createFromAseprite("wato");
    this.inputHandler = new InputHandler(this);
    this.interactionHandler = new InteractionHandler(this);
    this.obstacleHandler = new ObstacleHandler(this);
    const island = new GameImage(
      this,
      new Phaser.Math.Vector2(0, 0),
      "level",
      -10000,
    );
    this.cameras.main.startFollow(island.image);
    this.cameras.main.setZoom(4);
    const width = constants.islandWidth;
    const height = constants.islandHeight;
    this.cameras.main.setBounds(-width / 2, -height / 2, width, height, true);
    createCharacterAnims(this.anims);
    new GameStart(this, "", this.interactionHandler);
  }

  initDialogue(sendDialogue: SendJsonMessage) {
    this.sendDialogue = sendDialogue;
  }

  initPlayer(id: string, send: SendJsonMessage) {
    const sprite = id === constants.playerOne ? "alex" : "wato";
    const spawnPoint =
      id === constants.playerOne ? PLAYER_ONE_SPAWN : PLAYER_TWO_SPAWN;
    this.id = id;
    if (!this.player && this.inputHandler) {
      this.player = new Player(
        this,
        spawnPoint,
        sprite,
        this.inputHandler,
        send,
      );
      this.obstacleHandler?.init(this.player);
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
    this.interactionHandler.reset();
    console.info(`Set Interaction ${interaction}`);
    if (interaction === "GAME_START") {
      new GameStart(this, interaction, this.interactionHandler);
    } else if (interaction === "PICNIC_BASKET") {
      new PicnicBasket(this, interaction, this.interactionHandler);
    } else if (interaction === "PICNIC_CONTINUE") {
      new PicnicContinue(this, interaction, this.interactionHandler);
    } else if (interaction === "BASKET_RETURN") {
      new BasketReturn(this, interaction, this.interactionHandler);
    } else if (interaction === "GIFT_START") {
      new GiftStart(this, interaction, this.interactionHandler);
    }
  }

  update(_time: number, _delta: number) {
    const state = useGameStore.getState().gameState;
    const storyState = useGameStore.getState().storyState;
    this.updateState(state);

    if (this.player) {
      if (storyState.type === "dialogue" || storyState.type === "question") {
        this.interactionHandler?.hide();
      } else {
        this.interactionHandler?.update();
        this.player.update();
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
      const spawnPoint =
        id === constants.playerOne ? PLAYER_ONE_SPAWN : PLAYER_TWO_SPAWN;
      if (id === constants.playerOne) {
        this.playerOneNpc = new Npc(this, spawnPoint, "alex");
      } else if (id === constants.playerTwo) {
        this.playerTwoNpc = new Npc(this, spawnPoint, "wato");
      }
    }
    if (id === constants.playerOne) {
      this.playerOneNpc?.update(player);
    } else if (id === constants.playerTwo) {
      this.playerTwoNpc?.update(player);
    }
  }

  getPlayerOne(): Character | undefined {
    if (this.id === constants.playerOne) {
      return this.player;
    } else {
      return this.playerOneNpc;
    }
  }

  getPlayerTwo(): Character | undefined {
    if (this.id === constants.playerTwo) {
      return this.player;
    } else {
      return this.playerTwoNpc;
    }
  }

  processAction(action: Action) {
    switch (action) {
      case "SHARK":
        new Shark(this);
        break;
      case "BRACELET":
        new Bracelet(this);
        break;
      case "ICE_CREAM":
        new IceCream(this);
        break;
      case "WATER_BOTTLE":
        new WaterBottle(this);
        break;
      case "FLOWERS":
        new Flowers(this);
        break;
    }
  }
}
