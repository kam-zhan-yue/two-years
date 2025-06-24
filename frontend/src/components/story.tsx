import { useGameStore } from "@/store";
import { Typewriter, type TypewriterHandle } from "./typewriter";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [lineIndex, setLineIndex] = useState(0);
  const typewriterRef = useRef<TypewriterHandle>(null);

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
        if (storyState.body.lines.length > 0) {
          setLineIndex(0);
          if (typewriterRef.current) {
            typewriterRef.current.setText(storyState.body.lines[0].line);
          }
        }
      }
    }
  }, [
    dialogueMessage,
    dialogueSocket,
    setStoryState,
    setLineIndex,
    typewriterRef,
  ]);

  const onTypewriterComplete = useCallback(() => {}, []);

  const onTypewriterNext = useCallback(() => {
    if (storyState.type === "dialogue") {
      if (lineIndex < storyState.body.lines.length - 1) {
        console.info(`Setting line index to ${lineIndex + 1}`);
        if (typewriterRef.current) {
          typewriterRef.current.setText(
            storyState.body.lines[lineIndex + 1].line,
          );
        }

        setLineIndex(lineIndex + 1);
      } else {
        // go to the next dialogue!
        console.info("go to next!");
      }
    }
  }, [storyState, lineIndex, setLineIndex, typewriterRef]);

  const handleClick = useCallback(() => {
    console.info("clicking");
    if (typewriterRef.current) {
      typewriterRef.current.handleClick();
    }
  }, [typewriterRef]);

  return (
    <div
      onClick={handleClick}
      className="fixed inset-0 w-full mx-auto p-4 bg-white/80"
    >
      <Typewriter
        ref={typewriterRef}
        delay={15}
        fontSize={22}
        onComplete={onTypewriterComplete}
        onNext={onTypewriterNext}
      />
    </div>
  );
};

export { Story };
