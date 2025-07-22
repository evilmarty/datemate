import React, { useState, useEffect } from "react";

interface EmojiCyclerProps {
  emojis: string[];
  delay?: number;
  className?: string;
}

const EmojiCycler: React.FC<EmojiCyclerProps> = ({
  emojis,
  delay = 1000,
  className = null,
}) => {
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmojiIndex((prevIndex) => (prevIndex + 1) % emojis.length);
    }, delay); // Change emoji every 1 second

    return () => clearInterval(interval);
  }, [emojis.length]);

  return (
    <div className={`${className} animate-bounce`}>
      {emojis[currentEmojiIndex]}
    </div>
  );
};

export default EmojiCycler;
