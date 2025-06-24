import type { StoryChoice } from "@/game/types/story-state";

interface ChoiceProps {
  choices: StoryChoice[];
  onSelect: (choice: number) => void;
}

const Choices = ({ choices, onSelect }: ChoiceProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white/90 border-4 border-gray-800 rounded-xl shadow-xl px-8 py-6 min-w-[300px] max-w-lg">
        {choices.map((choice) => (
          <button
            key={choice.index}
            onClick={() => onSelect(choice.index)}
            className="block w-full text-lg font-semibold text-gray-800 bg-gray-100 hover:bg-blue-200 rounded-md px-4 py-2 my-2 transition-colors duration-150"
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export { Choices };
