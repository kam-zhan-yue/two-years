import { ActionObject } from "../action-object";
import GameImage from "../game-image";

class Bracelet extends ActionObject {
  activate(): void {
    const player = this.level.getPlayerOne();
    if (!player) return;

    const bracelet = new GameImage(
      this.level,
      new Phaser.Math.Vector2(0, 0),
      "bracelet",
    );
    player.putOnHead(bracelet, new Phaser.Math.Vector2(0, -20));
  }
}

export { Bracelet };
