import { InteractionObject } from "../interaction-object";
import { InteractionSetup } from "../interaction-setup";

class PicnicBasket extends InteractionSetup {
  getInteractions(): InteractionObject[] {
    return [
      new InteractionObject(
        "picnic-mat",
        this.scene,
        new Phaser.Math.Vector2(0, 10),
        new Phaser.Math.Vector2(50, 50),
        "picnic-mat",
        undefined,
        -500,
      ),
      new InteractionObject(
        "picnic-basket",
        this.scene,
        new Phaser.Math.Vector2(0, 10),
        new Phaser.Math.Vector2(75, 75),
        "picnic-basket",
        this.interaction,
      ),
    ];
  }
}

export { PicnicBasket };
