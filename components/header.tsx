"use client";

import Link from "next/link";
import { Brain, LayoutDashboard, MessageSquare, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { UserMenu } from "./user-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

export function Header() {
  const { isLoggedIn } = useSelector((state: RootState) => state.chinniMain);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Brain className="w-8 h-8 text-primary" />
          <span className="font-bold text-xl">ChinniAI</span>
        </Link>

        <div className="flex items-center space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ThemeToggle />
              </TooltipTrigger>
              <TooltipContent>
                <p>Theme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {isLoggedIn ? (
            <>
              {/* Display when user is signed in */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="relative group"
                      >
                        <Link href="/chat">
                          <MessageSquare className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          <motion.div
                            className="absolute inset-0 bg-primary/10 rounded-md opacity-0 group-hover:opacity-100"
                            animate={{
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm mt-3">ChinniAI</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="relative group"
                      >
                        <Link href="/dashboard">
                          <LayoutDashboard className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          <motion.div
                            className="absolute inset-0 bg-primary/10 rounded-md opacity-0 group-hover:opacity-100"
                            animate={{
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm mt-3">Dashboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <UserMenu />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm mt-3">Profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <>
              <Button variant="ghost">
                <Link href="/login"> Sign In</Link>
              </Button>
              <Button>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
