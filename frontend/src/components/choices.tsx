import type { StoryChoice } from "@/game/types/story-state";
import "../styles.css";

interface ChoiceProps {
  choices: StoryChoice[];
  onSelect: (choice: number) => void;
}

const Choices = ({ choices, onSelect }: ChoiceProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="dialogue-box flex gap-3 flex-col px-6 py-2 min-w-[300px] max-w-lg">
        {choices.map((choice) => (
          <button
            key={choice.index}
            onClick={() => onSelect(choice.index)}
            className="pixel-font block w-full text-lg font-semibold bg-amber-100 hover:bg-blue-200 cursor-pointer rounded-md px-4 py-2 transition-colors duration-150"
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export { Choices };
