import { ActionObject } from "../action-object";
import GameImage from "../game-image";

class IceCream extends ActionObject {
  activate(): void {
    const player = this.level.getPlayerOne();
    if (!player) return;

    const iceCream = new GameImage(
      this.level,
      new Phaser.Math.Vector2(0, 0),
      "ice-cream",
    );
    player.putOnHead(iceCream, new Phaser.Math.Vector2(0, -20));
  }
}

export { IceCream };
