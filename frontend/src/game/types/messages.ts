import { z } from "zod";

export enum MessageType {
    player = "player",
}

export const PlayerMessageSchema = z.object({
    message_id: z.literal(MessageType.player),
    player_id: z.string(),
    position: z.object({
        x: z.number(),
        y: z.number(),
    }),
    animation: z.string(),
});
