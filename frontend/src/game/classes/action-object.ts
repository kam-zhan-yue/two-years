import type { Level } from "../level";

abstract class ActionObject {
  protected level: Level;

  constructor(level: Level) {
    this.level = level;
    this.activate();
  }

  abstract activate(): void;
}

export { ActionObject };
