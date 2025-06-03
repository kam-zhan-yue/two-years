export default class GameImage {
  public image: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    position: Phaser.Math.Vector2,
    key: string,
    depth: number | undefined = undefined,
  ) {
    this.image = scene.add.image(position.x, position.y, key);
    if (depth) {
      this.image.depth = depth;
    } else {
      this.image.depth = this.image.y + this.image.height / 2;
    }
  }
}
