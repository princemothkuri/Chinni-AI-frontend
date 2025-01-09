"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className={cn("relative", "flex-1")}>
      <Input
        type="text"
        placeholder="Search alarms and tasks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-background/50 backdrop-blur-sm"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    </div>
  );
}
