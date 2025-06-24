import { useCallback, useEffect, useState } from "react";
import "../css/typewriter.css";

interface TypewriterProps {
  text: string;
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

const Typewriter = ({
  text,
  delay,
  fontSize,
  onComplete,
  onNext,
}: TypewriterProps) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState(TypewriterState.Idle);

  const complete = useCallback(() => {
    setState(TypewriterState.Finished);
    onComplete();
  }, [setState, onComplete]);

  // Reset whenever new text gets added
  useEffect(() => {
    setState(TypewriterState.Typing);
    setCurrentText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      complete();
    }
  }, [currentIndex, setCurrentText, setCurrentIndex, complete]);

  const handleClick = () => {
    if (currentText.length !== text.length) {
      setCurrentIndex(text.length);
      setCurrentText(text);
      complete();
    } else {
      onNext();
    }
  };

  return (
    <div
      className="font-normal"
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: "1em",
        overflowWrap: "break-word",
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={handleClick}
    >
      {state === TypewriterState.Finished
        ? text
        : currentText.split("").map((char, idx) => (
            <span
              key={idx}
              className="fade-in"
              style={{ animationDelay: `${idx * 0.03}s` }}
            >
              {char}
            </span>
          ))}
    </div>
  );
};

export { Typewriter };
