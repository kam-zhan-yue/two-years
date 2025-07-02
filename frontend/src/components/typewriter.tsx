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
        <div className="w-4/5 bg-white">
          <div
            className="flex flex-row h-full items-end font-normal typewriter"
            style={{ fontSize: `${fontSize}px` }}
            onClick={handleClick}
          >
            {speaker && <Speaker speaker={speaker} />}
            <div className="flex flex-col h-full w-full max-w-4/6 p-2">
              {speakerTitle && (
                <>
                  <div className="text-5xl">{speakerTitle}</div>
                  <hr className="w-full border-t-2 border-gray-300 mt-0 mb-1" />
                </>
              )}
              {state === TypewriterState.Finished
                ? line
                : currentText
                    .split("")
                    .map((char, idx) => <span key={idx}>{char}</span>)}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export { Typewriter, type TypewriterHandle };
