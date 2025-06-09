import { z } from "zod";

export enum MessageType {
  player = "player",
}

export const PlayerMessageSchema = z.object({
  id: z.literal(MessageType.player),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  animation: z.string(),
});
