class Obstacle {
  private scene: Phaser.Scene;
  private position: Phaser.Math.Vector2;
  private size: Phaser.Math.Vector2;
  public body: Phaser.Physics.Arcade.Image;

  constructor(
    scene: Phaser.Scene,
    position: Phaser.Math.Vector2,
    size: Phaser.Math.Vector2,
  ) {
    this.scene = scene;
    this.position = position;
    this.size = size;

    // @ts-expect-error: An empty image is used as a placeholder for the obstacle
    this.body = this.scene.physics.add.image(this.position.x, this.position.y);
    this.body.setSize(this.size.x, this.size.y);
    this.body.setImmovable(true);
  }
}

export { Obstacle };
