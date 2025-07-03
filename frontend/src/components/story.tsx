import { useGameStore } from "@/store";
import { Typewriter, type TypewriterHandle } from "./typewriter";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type StoryChoice,
  StoryStateSchema,
  type StoryState,
  type DialogueLine,
} from "@/game/types/story-state";
import useWebSocket from "react-use-websocket";
import { ECHO_URL } from "@/api/constants";
import {
  ChoiceMessageSchema,
  DialogueMessageSchema,
  MessageType,
} from "@/game/types/messages";
import { Waiting } from "./waiting";
import { Choices } from "./choices";

const Story = () => {
  // Web Socket Stuff
  const dialogueSocket = useGameStore((state) => state.dialogueSocket);
  const { sendJsonMessage: dialogueSend, lastJsonMessage: dialogueMessage } =
    useWebSocket(dialogueSocket, {}, true);

  // Game Store Stuff
  const setStoryState = useGameStore((state) => state.setStoryState);
  const storyState = useGameStore((store) => store.storyState);
  const playerId = useGameStore((store) => store.playerId);
  const game = useGameStore((store) => store.game);

  // Story State Stuff
  const [lineIndex, setLineIndex] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [choices, setChoices] = useState<StoryChoice[]>([]);
  const typewriterRef = useRef<TypewriterHandle>(null);

  // Audio Stuff
  const sfxAction = new Audio("/audio/boom.ogg");

  useEffect(() => {
    game?.initDialogue(dialogueSend);
  }, [game, dialogueSend]);

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
        console.error(
          `Invalid story state: ${parsed.error}\n${JSON.stringify(json, null, 2)}`,
        );
        return;
      }
      const storyState = parsed.data as StoryState;
      console.log(`Dialogue Message is ${JSON.stringify(storyState, null, 2)}`);

      setStoryState(storyState);

      // Set the state stuff here!
      if (!typewriterRef.current) {
        return;
      }
      // Init all variables
      setLineIndex(0);
      setWaiting(false);
      setChoices([]);

      if (storyState.type === "dialogue") {
        if (storyState.body.lines.length > 0) {
          const dialogue = storyState.body.lines[0];
          console.info("What the fuck");
          checkAction(dialogue);
          typewriterRef.current.setDialogueLine(dialogue);
        }
      } else if (storyState.type === "question") {
        const question = storyState.body.question;
        checkAction(question);
        typewriterRef.current.setDialogueLine(question);
      } else if (storyState.type === "interaction") {
        game?.setInteraction(storyState.body);
      } else if (storyState.type === "end") {
        typewriterRef.current.setDialogueLine({
          line: "The story has ended.",
          speaker: "All",
        });
      }
    }
  }, [
    dialogueMessage,
    dialogueSocket,
    setStoryState,
    setLineIndex,
    typewriterRef,
    game,
  ]);

  const onTypewriterComplete = useCallback(() => {}, []);

  const onTypewriterNext = useCallback(() => {
    if (storyState.type === "dialogue") {
      if (lineIndex < storyState.body.lines.length - 1) {
        const line = storyState.body.lines[lineIndex + 1];
        if (typewriterRef.current) {
          typewriterRef.current.setDialogueLine(line);
        }
        checkAction(line);
        setLineIndex(lineIndex + 1);
      } else {
        // go to the next dialogue!
        setWaiting(true);
        sendDialogue();
      }
    } else if (storyState.type === "question") {
      // If we are the answer, then populate the choices
      if (storyState.body.answerer === playerId) {
        setChoices(storyState.body.choices);
      } else {
        setWaiting(true);
      }
    }
  }, [storyState, lineIndex, setLineIndex, typewriterRef]);

  const checkAction = useCallback(
    (line: DialogueLine) => {
      if (line.action && game) {
        sfxAction.play();
        game.processAction(line.action);
      }
    },
    [game, sfxAction],
  );

  const handleClick = useCallback(() => {
    if (typewriterRef.current) {
      typewriterRef.current.handleClick();
    }
  }, [typewriterRef]);

  const handleSelectChoice = useCallback((choice: number) => {
    sendChoice(choice);
  }, []);

  const sendDialogue = useCallback(() => {
    const data = {
      id: MessageType.dialogue,
    };
    try {
      DialogueMessageSchema.parse(data);
      dialogueSend(data);
    } catch (error) {
      console.error("Validation failed for dialogue message: ", error);
    }
  }, [dialogueSend]);

  const sendChoice = useCallback(
    (choice: number) => {
      const data = {
        id: MessageType.choice,
        choice,
      };
      try {
        ChoiceMessageSchema.parse(data);
        dialogueSend(data);
      } catch (error) {
        console.error("Validation failed for dialogue message: ", error);
      }
    },
    [dialogueSend],
  );

  return (
    <div className="fixed w-full h-full" onClick={handleClick}>
      {choices.length > 0 && (
        <Choices choices={choices} onSelect={handleSelectChoice} />
      )}
      {waiting && <Waiting />}
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
