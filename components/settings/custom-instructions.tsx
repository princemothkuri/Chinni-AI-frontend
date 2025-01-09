"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const MAX_CHARS = 1500;

export function CustomInstructions() {
  const [instructions, setInstructions] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your custom instructions have been updated.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <Label htmlFor="instructions" className="text-lg font-medium">
          Custom Instructions
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors cursor-help" />
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="max-w-sm bg-card/50 backdrop-blur-sm border-2"
            >
              <p>
                Provide specific instructions to guide ChinniAI's responses and
                behavior to suit your needs.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Textarea
          id="instructions"
          value={instructions}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) {
              setInstructions(e.target.value);
            }
          }}
          placeholder="Enter your custom instructions here..."
          className="min-h-[120px] resize-none backdrop-blur-sm border-2 focus:ring-2 focus:ring-primary/50"
        />
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>
            {instructions.length}/{MAX_CHARS} characters
          </span>
        </div>
      </div>

      <Button
        onClick={handleSave}
        className="w-full relative group overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 group-hover:opacity-100 opacity-0 transition-opacity"
          animate={{
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        <span className="relative">Save Changes</span>
      </Button>
    </motion.div>
  );
}
