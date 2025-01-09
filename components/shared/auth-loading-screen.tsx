"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Brain } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

const AuthLoadingScreen = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      width: Math.random() * 4 + 1,
      height: Math.random() * 4 + 1,
    }));
    setParticles(newParticles);
  }, []);
  return (
    <div className="fixed inset-0 bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-background animate-gradient">
        <AnimatePresence>
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className={cn(
                  "absolute rounded-full",
                  "bg-primary/20 dark:bg-primary/10"
                )}
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  width: `${particle.width}px`,
                  height: `${particle.height}px`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="relative"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="relative z-10"
          >
            <Brain className="w-24 h-24 text-primary" />
          </motion.div>
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;
