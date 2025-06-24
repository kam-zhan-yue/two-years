import { useGameStore } from "@/store";
import { Typewriter } from "./typewriter";
import { useCallback, useEffect, useState } from "react";
import {
  StoryStateSchema,
  type DialogueLine,
  type StoryState,
} from "@/game/types/story-state";
import useWebSocket from "react-use-websocket";
import { ECHO_URL } from "@/api/constants";

const Story = () => {
  // Web Socket Stuff
  const dialogueSocket = useGameStore((state) => state.dialogueSocket);
  const { sendJsonMessage: dialogueSend, lastJsonMessage: dialogueMessage } =
    useWebSocket(dialogueSocket, {}, true);

  // Game Store Stuff
  const setStoryState = useGameStore((state) => state.setStoryState);
  const storyState = useGameStore((store) => store.storyState);

  // Story State Stuff
  const [line, setLine] = useState<DialogueLine>({
    speaker: "",
    line: "",
  });

  // Handle the dialogue loop
  useEffect(() => {
    // Ignore messages from the echo site, as it is for setup only
    if (dialogueSocket === ECHO_URL) {
      return;
    }

    if (!dialogueMessage) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json = dialogueMessage as any;
    if (json) {
      const parsed = StoryStateSchema.safeParse(json);
      if (!parsed.success) {
        console.error(`Invalid story state: ${parsed.error}`);
        return;
      }
      const storyState = parsed.data as StoryState;
      console.log(`Dialogue Message is ${JSON.stringify(storyState, null, 2)}`);

      setStoryState(storyState);

      // Set the state stuff here!
      if (storyState.type === "dialogue") {
        console.info(`Setting line to ${storyState.body.lines[0]}`);
        setLine(storyState.body.lines[0]);
      }
    }
  }, [dialogueMessage, dialogueSocket, setStoryState, setLine]);

  const onTypewriterComplete = useCallback(() => {}, []);
  const onTypewriterNext = useCallback(() => {}, []);

  return (
    <div className="fixed inset-0 w-full mx-auto p-4 bg-white/80">
      WHATT
      <Typewriter
        text={line.line}
        delay={15}
        fontSize={22}
        onComplete={onTypewriterComplete}
        onNext={onTypewriterNext}
      />
    </div>
  );
};

export { Story };
