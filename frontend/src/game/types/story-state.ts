import { z } from "zod";

interface DialogueLine {
  speaker: string;
  line: string;
  action?: Action;
}

interface StoryChoice {
  index: number;
  text: string;
}

interface Dialogue {
  lines: DialogueLine[];
}

interface Question {
  question: DialogueLine;
  answerer: string;
  choices: StoryChoice[];
}

type Action = "SHARK" | "WATER_BOTTLE" | "BRACELET" | "ICE_CREAM" | "FLOWERS";

type Interaction =
  | ""
  | "GAME_START"
  | "PICNIC_BASKET"
  | "PICNIC_CONTINUE"
  | "BASKET_RETURN"
  | "GIFT_START";

type StoryState =
  | { type: "start" }
  | { type: "dialogue"; body: Dialogue }
  | { type: "question"; body: Question }
  | { type: "interaction"; body: Interaction }
  | { type: "end" };

const DialogueLineSchema = z.object({
  speaker: z.string(),
  line: z.string(),
  action: z.string().optional().nullable(),
});

const StoryChoiceSchema = z.object({
  index: z.number(),
  text: z.string(),
});

const DialogueSchema = z.object({
  lines: z.array(DialogueLineSchema),
});

const InteractionSchema = z.union([
  z.literal(""),
  z.literal("GAME_START"),
  z.literal("PICNIC_BASKET"),
  z.literal("PICNIC_CONTINUE"),
  z.literal("BASKET_RETURN"),
  z.literal("GIFT_START"),
]);

const QuestionSchema = z.object({
  question: DialogueLineSchema,
  answerer: z.string(),
  choices: z.array(StoryChoiceSchema),
});

const StoryStateSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("dialogue"),
    body: DialogueSchema,
  }),
  z.object({
    type: z.literal("question"),
    body: QuestionSchema,
  }),
  z.object({
    type: z.literal("interaction"),
    body: InteractionSchema,
  }),
  z.object({
    type: z.literal("end"),
  }),
  z.object({
    type: z.literal("start"),
  }),
]);

const defaultStoryState: StoryState = {
  type: "start",
};

export {
  type Action,
  type StoryState,
  type Question,
  type Interaction,
  type Dialogue,
  type DialogueLine,
  type StoryChoice,
  StoryStateSchema,
  defaultStoryState,
};
