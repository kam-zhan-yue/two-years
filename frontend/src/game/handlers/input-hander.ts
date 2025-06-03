export default class InputHandler {
  private controls!: {
    upArrow: Phaser.Input.Keyboard.Key;
    downArrow: Phaser.Input.Keyboard.Key;
    leftArrow: Phaser.Input.Keyboard.Key;
    rightArrow: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    space: Phaser.Input.Keyboard.Key;
  };

  constructor(scene: Phaser.Scene) {
    this.controls = scene.input.keyboard?.addKeys(
      {
        upArrow: Phaser.Input.Keyboard.KeyCodes.UP,
        downArrow: Phaser.Input.Keyboard.KeyCodes.DOWN,
        leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
        rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      },
      false,
    ) as {
      upArrow: Phaser.Input.Keyboard.Key;
      downArrow: Phaser.Input.Keyboard.Key;
      leftArrow: Phaser.Input.Keyboard.Key;
      rightArrow: Phaser.Input.Keyboard.Key;
      up: Phaser.Input.Keyboard.Key;
      down: Phaser.Input.Keyboard.Key;
      left: Phaser.Input.Keyboard.Key;
      right: Phaser.Input.Keyboard.Key;
      space: Phaser.Input.Keyboard.Key;
    };
  }

  public isDown(): boolean {
    return this.controls?.downArrow?.isDown || this.controls?.down?.isDown;
  }

  public isUp(): boolean {
    return this.controls?.upArrow?.isDown || this.controls?.up?.isDown;
  }

  public isRight(): boolean {
    return this.controls?.rightArrow?.isDown || this.controls?.right?.isDown;
  }

  public isLeft(): boolean {
    return this.controls?.leftArrow?.isDown || this.controls?.left?.isDown;
  }

  public isInteractDown(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.controls?.space);
  }
}
