"use client";

import { motion } from "framer-motion";
import { Brain, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ParticlesBackground } from "@/components/learn/particles-background";

export default function PageNotFound() {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <ParticlesBackground />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <Brain className="w-24 h-24 mx-auto text-primary animate-pulse" />

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              404 - Page Not Found
            </h1>
            <p className="text-xl text-muted-foreground">
              Oops! It seems you&apos;re lost in the digital space.
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild size="lg" className="group">
              <Link href="/">
                <Home className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                Back to Home
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
