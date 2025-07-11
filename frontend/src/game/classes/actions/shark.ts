import { ActionObject } from "../action-object";
import GameImage from "../game-image";

class Shark extends ActionObject {
  activate(): void {
    const player = this.level.getPlayerTwo();
    if (!player) return;

    const shark = new GameImage(
      this.level,
      new Phaser.Math.Vector2(0, 0),
      "shark",
    );
    player.putOnHead(shark, new Phaser.Math.Vector2(-5, -20));
  }
}

export { Shark };
