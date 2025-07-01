import { ActionObject } from "../action-object";
import GameImage from "../game-image";

class WaterBottle extends ActionObject {
  activate(): void {
    const player = this.level.getPlayerTwo();
    if (!player) return;

    const waterBottle = new GameImage(
      this.level,
      new Phaser.Math.Vector2(0, 0),
      "water-bottle",
    );
    player.putOnHead(waterBottle, new Phaser.Math.Vector2(0, -17));
  }
}

export { WaterBottle };
