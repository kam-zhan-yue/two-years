import { z } from "zod";
import type { CharacterAnimation } from "../classes/animation";
import { Math } from "phaser";

interface PlayerState {
  id: string;
  position: Math.Vector2;
  animation: CharacterAnimation;
}

const RawPlayerSchema = z.object({
  id: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  animation: z.string(),
});

const PlayerSchema = RawPlayerSchema.transform((raw) => {
  if (raw === null) {
    return null;
  }
  return {
    id: raw.id,
    position: new Math.Vector2(raw.position.x, raw.position.y),
    animation: raw.animation,
  };
});

const defaultPlayerState: PlayerState = {
  id: "0",
  position: new Math.Vector2(0, 0),
  animation: "alex-idle-down",
};

export { type PlayerState, RawPlayerSchema, PlayerSchema, defaultPlayerState };
