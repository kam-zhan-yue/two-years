import type { Level } from "../level";

abstract class Action {
  protected level: Level;

  constructor(level: Level) {
    this.level = level;
    this.activate();
  }

  abstract activate(): void;
}

export { Action };
