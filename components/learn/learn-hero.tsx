"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { TypewriterEffect } from "./typewriter-effect";

export function LearnHero() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-secondary/20 to-background" />
      <div className="container mx-auto px-4 text-center relative">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Brain className="w-24 h-24 mx-auto text-primary animate-pulse" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <TypewriterEffect text="ChinniAI - Your Personal Assistant" />
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Your tasks, alarms, real-time info, and creativity—powered by AI.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
