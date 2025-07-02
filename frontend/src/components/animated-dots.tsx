import { useEffect, useState } from "react";

const AnimatedDots = () => {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev === 3 ? 0 : prev + 1));
    }, 500);
    return () => clearInterval(interval);
  });

  return <span>{".".repeat(dotCount)}</span>;
};

export { AnimatedDots };
