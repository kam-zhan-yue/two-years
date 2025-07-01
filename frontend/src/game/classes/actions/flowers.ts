import { ActionObject } from "../action-object";
import GameImage from "../game-image";

class Flowers extends ActionObject {
  activate(): void {
    new GameImage(this.level, new Phaser.Math.Vector2(0, 0), "flowers");
  }
}

export { Flowers };
