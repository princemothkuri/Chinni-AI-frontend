"use client";

import { motion } from "framer-motion";
import {
  Image,
  MessageCircleQuestion,
  Pencil,
  FileText,
  Code,
  Sparkles,
  Calendar,
  Brain,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface StarterAction {
  icon: typeof Image;
  label: string;
  message: string;
}

const starterActions: StarterAction[] = [
  {
    icon: Image,
    label: "Create image",
    message: "Create an image of a serene mountain landscape at sunset",
  },
  {
    icon: MessageCircleQuestion,
    label: "Get advice",
    message: "What's the best way to improve my productivity?",
  },
  {
    icon: Pencil,
    label: "Help me write",
    message: "Help me write a professional email to schedule a meeting",
  },
  {
    icon: FileText,
    label: "Summarize text",
    message: "Can you help me summarize a long article?",
  },
  {
    icon: Code,
    label: "Code",
    message: "Help me write a React component for a modal dialog",
  },
  {
    icon: Sparkles,
    label: "Surprise me",
    message: "Show me something interesting and unexpected",
  },
  {
    icon: Calendar,
    label: "Make a plan",
    message: "Help me create a weekly workout schedule",
  },
  {
    icon: Brain,
    label: "Brainstorm",
    message: "Let's brainstorm ideas for a new mobile app",
  },
  {
    icon: Mail,
    label: "Send email",
    message: "Help me draft a professional email",
  },
];

interface ChatStarterActionsProps {
  onMessageSelect: (message: string) => void;
}

export function ChatStarterActions({
  onMessageSelect,
}: ChatStarterActionsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-2xl mx-auto">
      {starterActions.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            className="w-full h-auto py-4 px-4 flex flex-col items-center gap-2 bg-card/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            onClick={() => onMessageSelect(action.message)}
          >
            <action.icon className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">{action.label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
