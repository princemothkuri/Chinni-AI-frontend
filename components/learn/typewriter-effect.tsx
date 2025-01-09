"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterEffectProps {
  text: string;
  delay?: number;
}

export function TypewriterEffect({ text, delay = 50 }: TypewriterEffectProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return (
    <AnimatePresence>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="inline-block"
      >
        {displayedText}
        {currentIndex < text.length && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-[2px] h-[1em] bg-primary ml-1 align-middle"
          />
        )}
      </motion.span>
    </AnimatePresence>
  );
}
