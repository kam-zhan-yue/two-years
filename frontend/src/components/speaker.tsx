import { constants } from "@/helpers/constants";
import "../styles.css";

interface SpeakerProps {
  speaker: string;
  expression?: string;
}

const Speaker = ({ speaker, expression }: SpeakerProps) => {
  const playerOne = speaker === constants.playerOne;
  const playerTwo = speaker === constants.playerTwo;

  let image = playerOne ? "alex" : playerTwo ? "wato" : "";

  if (!image) {
    return;
  }

  if (expression) {
    image += `-${expression}.png`;
  } else {
    image += "-normal.png";
  }

  const path = `images/${image}`;

  return <img className="pixel h-full" src={path} />;
};

export { Speaker };
