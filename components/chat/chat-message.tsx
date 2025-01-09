"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";
import { Brain } from "lucide-react";
import MarkdownRenderer from "../markdown/MarkdownRendererWithCodeHandling ";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.sender === "ai";

  const { firstName, image } = useSelector(
    (state: RootState) => state.chinniMain
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "flex items-start gap-4",
        isAI ? "justify-start" : "justify-end"
      )}
    >
      {isAI && (
        <>
          <Avatar
            className={cn("w-8 h-8", isAI ? "bg-primary" : "bg-secondary")}
          >
            <Brain className="w-5 h-5 text-primary-foreground" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        </>
      )}

      <div
        className={cn(
          "rounded-2xl px-4 py-2 max-w-[80%] shadow-md",
          isAI
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        {/* <MarkdownRenderer
          content={message.content}
          // className="text-sm [&>p]:my-0 [&>ul]:my-2 [&>ol]:my-2"
        /> */}
        <MarkdownRenderer
          content={message.content}
        // className={cn(
        //   "text-sm [&>p]:my-0 [&>ul]:my-2 [&>ol]:my-2",
        //   "[&_pre]:bg-transparent [&_pre]:p-0",
        //   "[&_code.language-python]:text-inherit",
        //   isAI
        //     ? "[&_.language-python]:bg-background/50"
        //     : "[&_.language-python]:bg-primary-foreground/10"
        // )}
        />
        <time className="text-xs opacity-70 mt-1 block">
          {new Date(message.timestamp).toLocaleTimeString()}
        </time>
      </div>

      {!isAI && (
        <>
          <Avatar
            className={cn("w-8 h-8", isAI ? "bg-primary" : "bg-secondary")}
          >
            <AvatarImage src={image} />
            <AvatarFallback>{firstName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </>
      )}
    </motion.div>
  );
}
