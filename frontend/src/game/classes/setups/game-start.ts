import { InteractionObject } from "../interaction-object";
import { InteractionSetup } from "../interaction-setup";

class GameStart extends InteractionSetup {
  getInteractions(): InteractionObject[] {
    return [
      new InteractionObject(
        "picnic-mat",
        this.scene,
        new Phaser.Math.Vector2(0, 10),
        new Phaser.Math.Vector2(80, 50),
        "picnic-mat",
        this.interaction,
        -500,
      ),
      new InteractionObject(
        "picnic-basket",
        this.scene,
        new Phaser.Math.Vector2(0, 10),
        new Phaser.Math.Vector2(75, 75),
        "picnic-basket",
      ),
    ];
  }
}

export { GameStart };
