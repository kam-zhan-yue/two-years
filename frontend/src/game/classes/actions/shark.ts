import { Action } from "../action";
import GameImage from "../game-image";

class Shark extends Action {
  activate(): void {
    const playerTwo = this.level.getPlayerTwo();
    if (!playerTwo) return;

    const shark = new GameImage(
      this.level,
      new Phaser.Math.Vector2(0, 0),
      "shark",
    );
    playerTwo.putOnHead(shark, new Phaser.Math.Vector2(0, 0));
  }
}

export { Shark };
