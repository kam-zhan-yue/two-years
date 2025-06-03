import { Scene } from "phaser";
import GameImage from "./classes/game-image";

export class Main extends Scene {
  constructor() {
    super({ key: "Main" })
  }

  setupGame() {
    console.log('created island')
    const island = new GameImage(this, new Phaser.Math.Vector2(0, 0), 'island', -100)
    this.cameras.main.centerOn(island.image.x, island.image.y)
    this.cameras.main.setZoom(3.0)
  }

  create() {
    this.setupGame()
  }
}
