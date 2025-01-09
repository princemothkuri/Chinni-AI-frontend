"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { ParticlesBackground } from "@/components/shared/particles-background";

export default function ChatPage() {
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="absolute inset-0 z-[-1]">
        <ParticlesBackground />
      </div>
      <div className="container mx-auto px-4 h-[calc(100vh-4rem)]">
        <ChatInterface />
      </div>
    </div>
  );
}