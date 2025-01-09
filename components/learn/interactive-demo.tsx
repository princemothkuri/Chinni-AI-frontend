"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import axios from "axios";
import MarkdownRenderer from "../markdown/MarkdownRendererWithCodeHandling ";

interface Message {
  isUser: boolean;
  message: string;
}

export function InteractiveDemo() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  const { isLoggedIn } = useSelector((state: RootState) => state.chinniMain);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: Message = { isUser: true, message: message.trim() };
    setChatHistory((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/ai/demo-chat", {
        message: userMessage.message,
      });

      const aiMessage: Message = {
        isUser: false,
        message: response.data.response,
      };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        isUser: false,
        message:
          "Sorry, I'm having trouble responding right now. Please try again later.",
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Scroll chat container to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  if (!isLoggedIn)
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-card/50 backdrop-blur-sm border-2 p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Try ChinniAI
              </h2>

              <div className="space-y-4">
                {/* Render Chat History */}
                <div
                  ref={chatContainerRef}
                  className={`space-y-2 h-80 overflow-y-auto hide-scroll-bar`}
                >
                  {chatHistory?.length === 0 && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Try saying:
                      </p>
                      <p className="font-medium">
                        "Set a reminder for 7 PM today"
                      </p>
                    </div>
                  )}
                  {chatHistory.map((chat, index) => (
                    <div
                      key={index}
                      className={`flex ${chat.isUser ? "justify-end" : "justify-start"
                        }`}
                    >
                      <div
                        className={`p-3 rounded-lg ${chat.isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                          } max-w-xs`}
                      >
                        <MarkdownRenderer content={chat.message} />
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-2 items-center text-muted-foreground">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 bg-current rounded-full"
                      />
                      <span className="text-sm">Chinni is typing...</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    );
}
