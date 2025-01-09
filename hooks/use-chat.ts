"use client";

import { useState, useCallback, useEffect } from "react";
import { Message, ChatState, ChatActions } from "@/lib/types";
import { createMessage, validateMessage } from "../lib/chat-utils";
import { useSocket } from "@/context/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useDispatch } from "react-redux";
import {
  clearChatHistory,
  setChatHistory,
} from "@/lib/redux/features/chinniMain/chinniMainSlice";

export function useChat(): ChatState & ChatActions {
  const { chatHistory } = useSelector((state: RootState) => state.chinniMain);
  // const [messages, setMessages] = useState<Message[]>(chatHistory);
  const [isProcessing, setIsProcessing] = useState(false);

  const { socket } = useSocket();

  const dispatch = useDispatch();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!validateMessage(content)) return;

      const userMessage = createMessage(content, "user");
      dispatch(setChatHistory(userMessage));
      // setMessages((prev) => [...prev, userMessage]);
      setIsProcessing(true);

      try {
        if (!socket) return;

        socket.send(content);

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.type === "ai_response") {
            // Update AI response with the actual message
            const aiMessage = createMessage(data.message, "ai");
            dispatch(setChatHistory(aiMessage));
            // setMessages((prev) => [...prev, aiMessage]);
            setIsProcessing(false);
          } else if (data.type === "error") {
            const errorMessage = createMessage(`Error: ${data.message}`, "ai");
            dispatch(setChatHistory(errorMessage));
            // setMessages((prev) => [...prev, errorMessage]);
            setIsProcessing(false);
          }
        };
      } catch (error) {
        console.error(error);
        const errorMessage = createMessage("Error sending message", "ai");
        dispatch(setChatHistory(errorMessage));
        // setMessages((prev) => [...prev, errorMessage]);
        setIsProcessing(false);
      }
    },
    [socket, chatHistory]
  );

  const clearChat = useCallback(() => {
    dispatch(clearChatHistory());
    // setMessages([]);
  }, []);

  return {
    isProcessing,
    sendMessage,
    clearChat,
  };
}
