export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
}

export interface ChatState {
  // messages: Message[];
  isProcessing: boolean;
}

export interface ChatActions {
  sendMessage: (content: string) => void;
  clearChat: () => void;
}
