import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super({ key: "Boot" });
  }

  preload() {
    this.load.image("island", "images/island.png");
    this.load.image("mailbox", "images/mailbox.png");
    this.load.image("spacebar", "images/spacebar.png");
    this.load.image("notification", "images/notification.png");

    this.load.atlas("player", "atlas/character.png", "atlas/character.json");
    this.load.aseprite("alex", "atlas/alex.png", "atlas/alex.json");
    this.load.aseprite("wato", "atlas/wato.png", "atlas/wato.json");
  }

  create() {
    this.scene.start("Main");
  }
}
