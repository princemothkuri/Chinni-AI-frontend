"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

interface AddButtonProps {
  type: "alarms" | "tasks";
  onClick: () => void;
}

export function AddButton({ type, onClick }: AddButtonProps) {
  const { defaultNavigation } = useSelector(
    (state: RootState) => state.dashBoard
  );
  const getLabel = useCallback(() => {
    if (defaultNavigation) {
      return defaultNavigation === "alarms" ? "Add Alarm" : "Add Task";
    }
    // return type === "alarms" ? "Add Alarm" : "Add Task";
  }, [defaultNavigation]);

  return (
    <Button
      onClick={onClick}
      className="flex items-center gap-2 bg-primary hover:bg-primary/90 w-full"
    >
      <Plus className="h-4 w-4" />
      {getLabel()}
    </Button>
  );
}
