import { AnimatedDots } from "./animated-dots";

const Waiting = () => {
  return (
    <h1 className="fixed inset-y-10 w-full text-center pixel-font text-4xl">
      Waiting for the other player <AnimatedDots />
    </h1>
  );
};

export { Waiting };
