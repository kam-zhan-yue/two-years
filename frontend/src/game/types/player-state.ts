import { z } from "zod";
import type { CharacterAnimation } from "../classes/animation";
import { Math } from "phaser";

export interface PlayerState {
  id: number;
  position: Math.Vector2;
  animation: CharacterAnimation;
}

export const RawPlayerSchema = z.object({
  id: z.number(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  animation: z.string(),
});

export const PlayerSchema = RawPlayerSchema.transform((raw) => {
  if (raw === null) {
    return null;
  }
  return {
    id: raw.id,
    position: new Math.Vector3(raw.position.x, raw.position.y),
    animation: raw.animation,
  };
});
