import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import "../styles/typewriter.css";
import type { DialogueLine } from "@/game/types/story-state";
import { useGameStore } from "@/store";
import { Speaker } from "./speaker";
import { constants } from "@/helpers/constants";

interface TypewriterProps {
  delay: number;
  fontSize: number;
  onComplete: () => void;
  onNext: () => void;
}

enum TypewriterState {
  Idle,
  Typing,
  Finished,
}

interface TypewriterHandle {
  setDialogueLine: (line: DialogueLine) => void;
  handleClick: () => void;
}

const Typewriter = forwardRef<TypewriterHandle, TypewriterProps>(
  ({ delay, fontSize, onComplete, onNext }, ref) => {
    const [speaker, setSpeaker] = useState("");
    const [line, setLine] = useState("");
    const [currentText, setCurrentText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [state, setState] = useState(TypewriterState.Idle);
    const storyState = useGameStore((store) => store.storyState);

    const setDialogueLine = useCallback(
      (dialogueLine: DialogueLine) => {
        setSpeaker(dialogueLine.speaker);
        setLine(dialogueLine.line);
        setState(TypewriterState.Typing);
        setCurrentText("");
        setCurrentIndex(0);
      },
      [setState, setCurrentText, setCurrentIndex],
    );

    const handleClick = useCallback(() => {
      if (currentText.length !== line.length) {
        setCurrentIndex(line.length);
        setCurrentText(line);
      } else {
        onNext();
      }
    }, [currentText, line, setCurrentIndex, setCurrentText, onNext]);

    useImperativeHandle(
      ref,
      () => ({
        setDialogueLine,
        handleClick,
      }),
      [setDialogueLine, handleClick],
    );

    const complete = useCallback(() => {
      setState(TypewriterState.Finished);
      onComplete();
    }, [setState, onComplete]);

    useEffect(() => {
      if (currentIndex < line.length) {
        const timeout = setTimeout(() => {
          setCurrentText((prevText) => prevText + line[currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }, delay);
        return () => clearTimeout(timeout);
      } else {
        complete();
      }
    }, [line, currentIndex, setCurrentText, setCurrentIndex, complete]);

    const canShow =
      storyState.type === "dialogue" || storyState.type === "question";

    const speakerTitle =
      speaker === constants.playerOne
        ? constants.playerOneInk
        : speaker === constants.playerTwo
          ? constants.playerTwoInk
          : "";

    return (
      <div
        className={`${canShow ? "flex" : "hidden"} justify-center fixed bottom-5 w-full h-60`}
      >
        <div className="w-4/5 dialogue-box">
          <div
            className="flex flex-row h-full items-end font-normal typewriter"
            style={{ fontSize: `${fontSize}px` }}
            onClick={handleClick}
          >
            {speakerTitle && (
              <>
                {speaker && <Speaker speaker={speaker} />}
                <div className="flex flex-col h-full w-full max-w-4/6 ml-6">
                  {speakerTitle && (
                    <div className="text-5xl">{speakerTitle}</div>
                  )}
                  <div className="flex">
                    {state === TypewriterState.Finished ? line : currentText}
                  </div>
                </div>
              </>
            )}
            {!speakerTitle && (
              <>
                <div className="flex-col h-full w-full">
                  <div className="h-full flex justify-center text-center">
                    {state === TypewriterState.Finished ? line : currentText}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
);

export { Typewriter, type TypewriterHandle };
