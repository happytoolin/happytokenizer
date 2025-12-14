// Type definitions for chat messages
export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
  // Additional optional fields for future use
  recipient?: string;
  recipientPlacement?: "role" | "channel";
  channel?: string;
  constraint?: string;
  terminator?: string;
}
