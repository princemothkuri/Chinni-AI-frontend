"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ParticlesBackground } from "@/components/shared/particles-background";
import { RegisterForm } from "@/components/auth/register-form";
import { Footer } from "@/components/footer";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (data: any) => {
    setIsLoading(true);
    try {
      // Make the POST request to the backend
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (response.data.status === 201) {
        toast({
          title: "Success",
          description: "User registered successfully.",
        });
        router.push("/login");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data.error,
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      if (error.response) {
        console.error(error.response.data.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response.data.message,
        });
      } else {
        // Handle network or other unexpected errors
        console.error("Something went wrong", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong. Please try again.",
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-[calc(100vh-4rem)] mt-16 relative flex items-center justify-center p-4 overflow-y-auto">
        <ParticlesBackground />
        <div className="relative z-10 w-full max-w-md my-8">
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
                Join ChinniAI Today
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Start organizing your life with the power of AI.
              </p>
            </div>

            <RegisterForm
              onSubmit={handleSignUp}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline underline-offset-4"
              >
                Login
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <div className="w-full backdrop-blur-sm">
        <Footer />
      </div>
    </>
  );
}
