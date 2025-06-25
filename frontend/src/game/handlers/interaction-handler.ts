import type { InteractionObject } from "../classes/interaction-object";
import type { Level } from "../level";

class InteractionHandler {
  private level: Level;
  private interactions: InteractionObject[];

  constructor(level: Level) {
    this.level = level;
    this.interactions = [];

    console.info(`Interactions is ${this.interactions}.`);
  }

  add(interaction: InteractionObject) {
    console.info(
      `Interactions is ${this.interactions}. Interaction Object is ${interaction}`,
    );
    this.interactions.push(interaction);
  }

  update() {
    const player = this.level.player;
    if (player) {
      this.interactions.forEach((interaction) => {
        interaction.update(player.getPos());
      });
    }
  }

  getCurrentInteraction(): InteractionObject | undefined {
    const playerPos = this.level.player?.getPos();
    if (!playerPos) return undefined;
    for (const interaction of this.interactions) {
      if (interaction.containsPoint(playerPos.x, playerPos.y)) {
        return interaction;
      }
    }
    return undefined;
  }

  reset() {
    this.interactions = [];
  }
}

export { InteractionHandler };
