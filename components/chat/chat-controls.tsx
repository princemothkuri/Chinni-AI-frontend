"use client";

import { Mic, Speaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  onToggleListen: () => void;
  onToggleSpeak: () => void;
}

export function ChatControls({
  isListening,
  isSpeaking,
  onToggleListen,
  onToggleSpeak,
}: ChatControlsProps) {
  return (
    <div className="absolute -top-14 left-0 right-0 flex justify-between px-4">
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={onToggleSpeak}
      >
        {isSpeaking && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
        <Speaker className={cn("h-5 w-5", isSpeaking && "text-primary")} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={onToggleListen}
      >
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
        <Mic className={cn("h-5 w-5", isListening && "text-primary")} />
      </Button>
    </div>
  );
}