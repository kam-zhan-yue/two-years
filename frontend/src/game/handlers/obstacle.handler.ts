import { constants } from "@/helpers/constants";
import { Obstacle } from "../classes/obstacle";
import type Player from "../classes/player";

export default class ObstacleHandler {
  private scene: Phaser.Scene;
  private obstacles: Obstacle[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    // Top Wall
    this.obstacles.push(
      new Obstacle(
        this.scene,
        new Phaser.Math.Vector2(0, -constants.islandHeight / 2),
        new Phaser.Math.Vector2(constants.islandWidth, 2),
      ),
    );

    // Bottom Wall
    this.obstacles.push(
      new Obstacle(
        this.scene,
        new Phaser.Math.Vector2(0, 70),
        new Phaser.Math.Vector2(constants.islandWidth, 10),
      ),
    );

    // Right Wall
    this.obstacles.push(
      new Obstacle(
        this.scene,
        new Phaser.Math.Vector2(constants.islandWidth / 2, 0),
        new Phaser.Math.Vector2(2, constants.islandHeight),
      ),
    );

    // Left Wall
    this.obstacles.push(
      new Obstacle(
        this.scene,
        new Phaser.Math.Vector2(-constants.islandWidth / 2, 0),
        new Phaser.Math.Vector2(2, constants.islandHeight),
      ),
    );
  }

  init(player: Player) {
    for (const obstacle of this.obstacles) {
      this.scene.physics.add.collider(player.body, obstacle.body);
    }
  }
}
