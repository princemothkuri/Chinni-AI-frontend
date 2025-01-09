import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "bg-secondary text-secondary-foreground";
    case "normal":
      return "bg-blue-500 text-white";
    case "medium":
      return "bg-yellow-500 text-white";
    case "high":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

export const priorityColors = {
  normal: "bg-secondary text-secondary-foreground hover:bg-secondary",
  medium: "bg-primary text-primary-foreground hover:bg-primary",
  high: "bg-destructive text-destructive-foreground hover:bg-destructive",
};
