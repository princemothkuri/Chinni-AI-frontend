"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import heroImage from "@/assets/hero-image.jpg";

export function HeroSection() {
  const router = useRouter();

  const { isLoggedIn } = useSelector((state: RootState) => state.chinniMain);

  return (
    <section className="min-h-screen pt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/20 to-background" />

      <div className="container mx-auto px-4 h-[calc(100vh-4rem)] flex items-center relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left lg:text-left md:text-center max-w-2xl mx-auto lg:mx-0"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Your Personal AI Assistant
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Meet Chinni, your intelligent companion for managing tasks,
              setting alarms, and staying productive with AI-powered assistance.
            </p>
            <div className="flex flex-wrap gap-4 md:justify-center lg:justify-start">
              {!isLoggedIn && (
                <Button size="lg" className="min-w-[140px]">
                  <Link href="/login">Get Started</Link>
                </Button>
              )}

              <Button
                size="lg"
                variant="outline"
                className="min-w-[140px]"
                onClick={() => router.push("/learn")}
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative aspect-square hidden md:hidden lg:block"
          >
            <Image
              src={heroImage}
              alt="AI Assistant Visualization"
              fill
              className="object-cover rounded-2xl shadow-2xl"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
