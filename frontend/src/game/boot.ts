import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super({ key: "Boot" });
  }

  preload() {
    this.load.image("island", "images/island.png");
    this.load.image("level", "images/level.png");
    this.load.image("mailbox", "images/mailbox.png");
    this.load.image("picnic-mat", "images/picnic-mat.png");
    this.load.image("picnic-basket", "images/picnic-basket.png");
    this.load.image("spacebar", "images/spacebar.png");
    this.load.image("notification", "images/notification.png");

    this.load.image("shark", "images/shark.png");
    this.load.image("ice-cream", "images/ice-cream.png");
    this.load.image("bracelet", "images/bracelet.png");
    this.load.image("water-bottle", "images/water-bottle.png");

    this.load.atlas("player", "atlas/character.png", "atlas/character.json");
    this.load.aseprite("alex", "atlas/alex.png", "atlas/alex.json");
    this.load.aseprite("wato", "atlas/wato.png", "atlas/wato.json");
  }

  create() {
    this.scene.start("Main");
  }
}
