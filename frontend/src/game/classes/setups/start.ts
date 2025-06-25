import { InteractionObject } from "../interaction-object";
import { InteractionSetup } from "../interaction-setup";

class Start extends InteractionSetup {
  getInteractions(): InteractionObject[] {
    return [
      new InteractionObject(
        "mailbox",
        this.scene,
        new Phaser.Math.Vector2(-80, 10),
        new Phaser.Math.Vector2(50, 50),
        "mailbox",
        this.interaction,
      ),
    ];
  }
}

export { Start };
