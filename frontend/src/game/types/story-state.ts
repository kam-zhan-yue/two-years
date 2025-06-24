import { z } from "zod";

type StoryType = "dialogue" | "question" | "response";

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

interface End {}

interface StoryState {
  type: StoryType;
  body: Dialogue | Question | Response | End;
}

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
  player: z.string(),
  answerer: z.string(),
  choices: z.array(StoryChoiceSchema),
});

const EndSchema = z.object({});

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
    body: EndSchema,
  }),
]);

export {
  type StoryState,
  type Question,
  type Response,
  type Dialogue,
  type DialogueLine,
  type StoryChoice,
  StoryStateSchema,
};
