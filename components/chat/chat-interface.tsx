"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";
import { useChat } from "@/hooks/use-chat";
import { ChatStarterActions } from "./chat-starter-actions";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

export function ChatInterface() {
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { isProcessing, sendMessage, clearChat } = useChat();

  const { chatHistory } = useSelector((state: RootState) => state.chinniMain);

  const [selectedMessage, setSelectedMessage] = useState("");

  const handleMessageSelect = (message: string) => {
    setSelectedMessage(message);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);
  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent hide-scroll-bar">
        <AnimatePresence initial={false}>
          {chatHistory?.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-8 space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Welcome to ChinniAI
                </h2>
                <p className="text-muted-foreground">
                  Choose an action below or type your own message to get started
                </p>
              </div>
              <ChatStarterActions onMessageSelect={handleMessageSelect} />
            </motion.div>
          )}
          {chatHistory?.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2 text-muted-foreground p-5 pl-12"
            >
              <span className="text-sm">Chinni is typing</span>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-current rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 pt-2 bg-transparent backdrop-blur-md">
        <div className="relative max-w-4xl mx-auto">
          <ChatInput
            onSendMessage={sendMessage}
            isListening={isListening}
            onToggleListen={(isListening) => setIsListening(isListening)}
            isDisabled={isProcessing}
            initialMessage={selectedMessage}
            key={selectedMessage}
          />
        </div>
      </div>
    </div>
  );
}
