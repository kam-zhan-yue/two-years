import type { InteractionHandler } from "../handlers/interaction-handler";
import type { Interaction } from "../types/story-state";
import type { InteractionObject } from "./interaction-object";

abstract class InteractionSetup {
  protected scene: Phaser.Scene;
  protected interaction: Interaction;

  constructor(
    scene: Phaser.Scene,
    interaction: Interaction,
    handler: InteractionHandler,
  ) {
    this.interaction = interaction;
    this.scene = scene;
    const interactions = this.getInteractions();
    for (const interaction of interactions) {
      handler.add(interaction);
    }
  }

  abstract getInteractions(): InteractionObject[];
}

export { InteractionSetup };
