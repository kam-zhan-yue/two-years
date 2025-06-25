import { constants } from "@/helpers/constants";
import type { Interaction } from "../types/story-state";
import GameImage from "./game-image";

class InteractionObject {
  private scene: Phaser.Scene;
  private position: Phaser.Math.Vector2;
  private size: Phaser.Math.Vector2;
  public interaction?: Interaction;
  private graphics?: Phaser.GameObjects.Graphics;
  protected image?: GameImage;
  private tooltip?: GameImage;

  constructor(
    scene: Phaser.Scene,
    position: Phaser.Math.Vector2,
    size: Phaser.Math.Vector2,
    imageKey?: string,
    interaction?: Interaction,
    depth?: number,
    offset?: number,
  ) {
    this.scene = scene;
    this.interaction = interaction;
    this.position = position;
    this.size = size;

    if (imageKey) {
      this.image = new GameImage(this.scene, this.position, imageKey, depth);
    }

    if (constants.debug) {
      this.graphics = this.scene.add.graphics();
      this.graphics.fillStyle(0x00ff00, 0.5);
      this.graphics.fillRect(
        this.getMinBound().x,
        this.getMinBound().y,
        this.size.x,
        this.size.y,
      );
    }

    // Create a tooltip image if the object is interactable
    if (interaction) {
      this.tooltip = new GameImage(
        scene,
        new Phaser.Math.Vector2(0, 0),
        "spacebar",
        1000,
      );
      this.tooltip.image.setPosition(
        this.position.x,
        this.position.y - this.size.y / 2 + (offset || 0),
      );
      this.tooltip.image.setOrigin(0.5);
      this.tooltip.image.setVisible(false);
    }
  }

  getMinBound(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(
      this.position.x - this.size.x / 2,
      this.position.y - this.size.y / 2,
    );
  }

  showTooltip() {
    this.tooltip?.image.setVisible(true);
  }

  hideTooltip() {
    this.tooltip?.image.setVisible(false);
  }

  // Method to check if a point (x, y) is inside the rectangle
  containsPoint(x: number, y: number) {
    const contains =
      x >= this.getMinBound().x &&
      x <= this.getMinBound().x + this.size.x &&
      y >= this.getMinBound().y &&
      y <= this.getMinBound().y + this.size.y;
    if (contains) {
      this.showTooltip();
    } else {
      this.hideTooltip();
    }
    return contains;
  }

  update(playerPos: Phaser.Math.Vector2) {
    this.containsPoint(playerPos.x, playerPos.y);
  }
}

export { InteractionObject };
