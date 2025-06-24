import { z } from "zod";

interface DialogueLine {
  speaker: string;
  line: string;
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

interface Response {
  line: DialogueLine;
}

type StoryState =
  | { type: "start" }
  | { type: "dialogue"; body: Dialogue }
  | { type: "question"; body: Question }
  | { type: "response"; body: Response }
  | { type: "end" };

const DialogueLineSchema = z.object({
  speaker: z.string(),
  line: z.string(),
});

const StoryChoiceSchema = z.object({
  index: z.number(),
  text: z.string(),
});

const DialogueSchema = z.object({
  lines: z.array(DialogueLineSchema),
});

const ResponseSchema = z.object({
  line: DialogueLineSchema,
});

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
    type: z.literal("response"),
    body: ResponseSchema,
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
  type StoryState,
  type Question,
  type Response,
  type Dialogue,
  type DialogueLine,
  type StoryChoice,
  StoryStateSchema,
  defaultStoryState,
};
