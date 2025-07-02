import { InteractionObject } from "../classes/interaction-object";
import type { Level } from "../level";

class InteractionHandler {
  private level: Level;
  private interactions: InteractionObject[];

  constructor(level: Level) {
    this.level = level;
    this.interactions = [];
  }

  add(interaction: InteractionObject) {
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

  hide() {
    this.interactions.forEach((interaction) => {
      interaction.hideTooltip();
    });
  }

  getCurrentInteraction(): InteractionObject | undefined {
    const playerPos = this.level.player?.getPos();
    if (!playerPos) return undefined;
    for (const interaction of this.interactions) {
      if (
        interaction.interaction &&
        interaction.containsPoint(playerPos.x, playerPos.y)
      ) {
        return interaction;
      }
    }
    return undefined;
  }

  reset() {
    for (const interaction of this.interactions) {
      interaction.destroy();
    }
    this.interactions = [];
  }
}

export { InteractionHandler };
