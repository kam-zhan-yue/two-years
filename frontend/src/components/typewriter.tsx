import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

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
  setText: (text: string) => void;
  handleClick: () => void;
}

const Typewriter = forwardRef<TypewriterHandle, TypewriterProps>(
  ({ delay, fontSize, onComplete, onNext }, ref) => {
    const [line, setLine] = useState("");
    const [currentText, setCurrentText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [state, setState] = useState(TypewriterState.Idle);

    const setText = useCallback(
      (text: string) => {
        setLine(text);
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

    useImperativeHandle(ref, () => ({
      setText,
      handleClick,
    }));

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

    return (
      <div
        className="font-normal"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: "1em",
          overflowWrap: "break-word",
          userSelect: "none",
        }}
        onClick={handleClick}
      >
        {state === TypewriterState.Finished
          ? line
          : currentText
              .split("")
              .map((char, idx) => <span key={idx}>{char}</span>)}
      </div>
    );
  },
);

export { Typewriter, type TypewriterHandle };
