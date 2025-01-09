"use client";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import { useState, useRef, useEffect } from "react";
import { SendHorizonal, Mic, MicOff, VolumeX, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { validateMessage } from "@/lib/chat-utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useDispatch } from "react-redux";
import { setSpeaker } from "@/lib/redux/features/chinniMain/chinniMainSlice";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isListening: boolean;
  onToggleListen: (isListening: boolean) => void;
  isDisabled?: boolean;
  initialMessage?: string;
}

export function ChatInput({
  onSendMessage,
  isListening,
  onToggleListen,
  isDisabled,
  initialMessage = "",
}: ChatInputProps) {
  const [message, setMessage] = useState(initialMessage);
  const [interimTranscript, setInterimTranscript] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isValid = validateMessage(message);
  const dispatch = useDispatch();

  const { chatHistory, isSpeakerOn } = useSelector(
    (state: RootState) => state.chinniMain
  );


  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setMessage((prevMessage) => prevMessage + finalTranscript);
      setInterimTranscript(interimTranscript);
    };

    recognition.onend = () => {
      onToggleListen(false);
    };

    const startRecognition = async () => {
      try {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permission.state === 'granted') {
          recognition.start();
        } else if (permission.state === 'prompt') {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          recognition.start();
        } else {
          console.error("Microphone permission denied");
          onToggleListen(false);
        }
      } catch (error) {
        console.error("Microphone permission denied");
        onToggleListen(false);
      }
    };

    if (isListening) {
      startRecognition();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening, onToggleListen]);

  const textPreProcessing = (text: string) => {
    // Remove emojis
    let cleanedText = text
      .replace(/[\p{Extended_Pictographic}]/gu, "") // Remove emojis
      .replace(/!|\*\*/g, ""); // Remove '!' and '**'


    // Extract text within square brackets and remove the links
    cleanedText = cleanedText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

    return cleanedText;
  };

  const speak = (text: string) => {
    text = textPreProcessing(text);
    console.log(text);

    const chunks = text.match(/[^.!?]+[.!?]+[\])'"`’”]*|.+/g) || [];

    const speakChunk = (chunk: string) => {
      return new Promise<void>((resolve) => {
        const textSpeak = new SpeechSynthesisUtterance(chunk);
        textSpeak.rate = 1;
        textSpeak.pitch = 1;
        textSpeak.volume = 1;
        textSpeak.lang = "hi-GB";
        textSpeak.onend = () => resolve();
        window.speechSynthesis.speak(textSpeak);
      });
    };

    const speakChunksSequentially = async () => {
      for (const chunk of chunks) {
        await speakChunk(chunk);
      }
    };

    speakChunksSequentially();
  };

  useEffect(() => {
    if (isSpeakerOn && chatHistory.length > 0) {
      const lastMessage = chatHistory[chatHistory.length - 1];
      if (lastMessage.sender === "ai") {
        window.speechSynthesis.cancel();
        speak(lastMessage.content);
      }
    }
  }, [chatHistory, isSpeakerOn]);

  const handleToggleSpeak = () => {
    if (isSpeakerOn) {
      window.speechSynthesis.cancel();
    }
    dispatch(setSpeaker(!isSpeakerOn));
  };

  useEffect(() => {
    setMessage(initialMessage);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [initialMessage]);

  const handleSubmit = () => {
    if (isValid && !isDisabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <div className="relative flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="relative shrink-0 hover:bg-transparent"
        onClick={handleToggleSpeak}
      >
        <AnimatePresence>
          {isSpeakerOn && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: 1,
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                duration: 2,
                // repeat: Infinity,
              }}
            />
          )}
        </AnimatePresence>
        {isSpeakerOn && (
          <Volume2
            className={cn(
              "h-5 w-5 transition-colors",
              isSpeakerOn && "text-primary"
            )}
          />
        )}
        {!isSpeakerOn && (
          <VolumeX
            className={cn(
              "h-5 w-5 transition-colors",
              isSpeakerOn && "text-primary"
            )}
          />
        )}
      </Button>

      <div className="relative flex-1">
        <Textarea
          ref={textareaRef}
          value={message + interimTranscript}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="pr-24 min-h-[48px] max-h-[120px] resize-none rounded-xl bg-background/50 border-2 focus:ring-2 focus:ring-primary/50 hide-scroll-bar"
          rows={1}
          disabled={isListening}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-transparent"
            onClick={() => onToggleListen(!isListening)}
          >
            <AnimatePresence>
              {isListening && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: 1,
                  }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{
                    duration: 2,
                    // repeat: Infinity,
                  }}
                />
              )}
            </AnimatePresence>
            {isListening && (
              <Mic
                className={cn(
                  "h-5 w-5 transition-colors",
                  isListening && "text-primary"
                )}
              />
            )}
            {!isListening && (
              <MicOff
                className={cn(
                  "h-5 w-5 transition-colors",
                  isListening && "text-primary"
                )}
              />
            )}
          </Button>
          <Button
            size="icon"
            className="h-8 w-8"
            onClick={handleSubmit}
            disabled={!isValid || isDisabled}
          >
            <SendHorizonal className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
