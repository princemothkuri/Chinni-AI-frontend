import { Message } from "@/lib/types";

export function validateMessage(content: string): boolean {
  const trimmedContent = content.trim();
  return trimmedContent.length > 0 && trimmedContent.length <= 2000;
}

export function createMessage(content: string, sender: "user" | "ai"): Message {
  return {
    id: Date.now().toString(),
    content: content.trim(),
    sender,
    timestamp: new Date().toISOString(),
  };
}

export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}
