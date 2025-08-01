import { useEffect, useState } from "react";

const words = ["E", "EA", "EAT", "EAT ", "EAT W", "EAT WI", "EAT WIT", "EAT WITH", "EAT WITH E", "EAT WITH EM", "EAT WITH EMO", "EAT WITH EMOT", "EAT WITH EMOTI", "EAT WITH EMOTIO", "EAT WITH EMOTION"];

const AnimatedHeroText = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < words.length - 1) {
      const timeout = setTimeout(() => {
        setIndex(index + 1);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <div className="flex justify-center items-center h-[60vh] text-5xl md:text-7xl font-extrabold tracking-wide">
      <span className="animate-fadeIn text-white">{words[index]}</span>
    </div>
  );
};

export default AnimatedHeroText;
