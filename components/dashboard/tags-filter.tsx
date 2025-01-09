"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TagsFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const availableTags = [
  "Work",
  "Personal",
  "Important",
  "Urgent",
  "Meeting",
  "Follow-up",
  "Project",
  "Deadline",
];

export function TagsFilter({ selectedTags, onTagsChange }: TagsFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newTags);
  };

  return (
    <div className="relative w-full">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild className="w-full">
          <Button
            variant="outline"
            className="gap-2 bg-background/50 backdrop-blur-sm"
          >
            <Tag className="h-4 w-4" />
            Filter by Tags
            <ChevronDown
              className="h-4 w-4 transition-transform duration-200"
              style={{ transform: isOpen ? "rotate(180deg)" : undefined }}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-background/50 backdrop-blur-sm"
        >
          <AnimatePresence>
            {availableTags.map((tag) => (
              <DropdownMenuItem
                key={tag}
                onSelect={(e) => {
                  e.preventDefault();
                  toggleTag(tag);
                }}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{tag}</span>
                {selectedTags.includes(tag) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Badge variant="secondary" className="ml-2">
                      Selected
                    </Badge>
                  </motion.div>
                )}
              </DropdownMenuItem>
            ))}
          </AnimatePresence>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
