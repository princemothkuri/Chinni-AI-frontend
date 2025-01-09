"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

export function CallToAction() {
  const { isLoggedIn } = useSelector((state: RootState) => state.chinniMain);
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-secondary/20 to-background" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started with ChinniAI?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {isLoggedIn ? "Chat with ChinniAI " : "Sign up "}
            today and simplify your life with the power of AI.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {isLoggedIn ? (
              <>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="min-w-[140px]"
                >
                  <Link href="/chat">
                    Try ChinniAI
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="min-w-[140px]">
                  <Link href="/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="min-w-[140px]"
                >
                  <Link href="/chat">Try Demo</Link>
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
