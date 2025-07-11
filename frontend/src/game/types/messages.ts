import { z } from "zod";

enum MessageType {
  player = "player",
  dialogue = "dialogue",
  choice = "choice",
  interaction = "interaction",
}

const PlayerMessageSchema = z.object({
  id: z.literal(MessageType.player),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  animation: z.string(),
});

const DialogueMessageSchema = z.object({
  id: z.literal(MessageType.dialogue),
});

const ChoiceMessageSchema = z.object({
  id: z.literal(MessageType.choice),
  choice: z.number(),
});

const InteractionMessageSchema = z.object({
  id: z.literal(MessageType.interaction),
  interaction: z.string(),
});

export {
  MessageType,
  PlayerMessageSchema,
  DialogueMessageSchema,
  ChoiceMessageSchema,
  InteractionMessageSchema,
};
