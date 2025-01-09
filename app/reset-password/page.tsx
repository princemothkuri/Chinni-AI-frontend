"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { PasswordResetVerification } from "@/components/auth/password-reset-verification";
import { PasswordResetForm } from "@/components/auth/password-reset-form";
import { ParticlesBackground } from "@/components/shared/particles-background";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PasswordResetPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("");

  const handleVerificationSuccess = (verifiedEmail: string) => {
    setIsVerified(true);
    setEmail(verifiedEmail);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] mt-16 relative flex items-center justify-center p-4">
      <ParticlesBackground />
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card/50 backdrop-blur-sm border-2 rounded-xl p-6 md:p-8 space-y-6"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <Brain className="w-12 h-12 md:w-16 md:h-16 text-primary animate-pulse" />
          </motion.div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Reset Your Password
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {isVerified
                ? "Enter your new password below"
                : "Enter your email and username to reset"}
            </p>
          </div>

          {!isVerified ? (
            <PasswordResetVerification
              onVerificationSuccess={handleVerificationSuccess}
            />
          ) : (
            <PasswordResetForm email={email} />
          )}

          <div className="text-center">
            <Button
              variant="link"
              asChild
              className="text-muted-foreground hover:text-primary"
            >
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
