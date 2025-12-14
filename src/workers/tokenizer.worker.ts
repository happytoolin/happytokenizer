import { decode, encode, encodeChat } from "gpt-tokenizer";
import type { ChatMessage } from "../types/chat";
import type { EncodingType } from "../utils/modelEncodings";
import {
  decode as decodeCl100k,
  encode as encodeCl100k,
} from "gpt-tokenizer/encoding/cl100k_base";
import {
  decode as decodeP50k,
  encode as encodeP50k,
} from "gpt-tokenizer/encoding/p50k_base";
import {
  decode as decodeP50kEdit,
  encode as encodeP50kEdit,
} from "gpt-tokenizer/encoding/p50k_edit";
import {
  decode as decodeR50k,
  encode as encodeR50k,
} from "gpt-tokenizer/encoding/r50k_base";

// Re-export EncodingType for other modules
export type { EncodingType };

export interface TokenizerMessage {
  text: string;
  model?: EncodingType;
  chunkSize?: number;
  chatMessages?: ChatMessage[];
  isChatMode?: boolean;
}

export interface TokenizerResponse {
  tokens: number[];
  count: number;
  model: string;
  tokenTexts?: string[];
  chunkProgress?: {
    current: number;
    total: number;
    percentage: number;
  };
  isChatMode?: boolean;
  chatMessages?: ChatMessage[];
}

export interface ChunkProgressResponse {
  type: "progress";
  chunkIndex: number;
  totalChunks: number;
  percentage: number;
}

// Function to split text into chunks intelligently
function splitIntoChunks(text: string, chunkSize: number = 1000): string[] {
  if (text.length <= chunkSize) {
    return [text];
  }

  const chunks: string[] = [];
  let currentPos = 0;

  while (currentPos < text.length) {
    let endPos = Math.min(currentPos + chunkSize, text.length);

    // If we're not at the end, try to break at a word boundary
    if (endPos < text.length) {
      // Look backwards for whitespace, newline, or sentence end
      const breakChars = ["\n", " ", ".", "!", "?", ",", ";", ":"];
      let breakPos = endPos;

      for (let i = 0; i < 100; i++) {
        // Look back up to 100 chars
        if (breakPos <= currentPos) break;
        breakPos--;

        if (breakChars.includes(text[breakPos])) {
          // Include the break character
          endPos = breakPos + 1;
          break;
        }
      }
    }

    chunks.push(text.slice(currentPos, endPos));
    currentPos = endPos;
  }

  return chunks;
}

// Decode individual tokens to their text representation
function decodeTokens(tokens: number[], model: EncodingType): string[] {
  return tokens.map((token) => {
    try {
      let decoded: string;

      switch (model) {
        case "cl100k_base":
          decoded = decodeCl100k([token]);
          break;
        case "p50k_base":
          decoded = decodeP50k([token]);
          break;
        case "p50k_edit":
          decoded = decodeP50kEdit([token]);
          break;
        case "r50k_base":
          decoded = decodeR50k([token]);
          break;
        case "o200k_harmony":
        case "o200k_base":
        default:
          decoded = decode([token]);
          break;
      }

      return decoded;
    } catch (error) {
      console.error("Decoding error:", error);
      // Fallback for special tokens or decoding errors
      return `[${token}]`;
    }
  });
}

// Tokenize text with chunking for better performance on large documents
async function tokenizeWithChunks(
  text: string,
  model: EncodingType,
  onProgress?: (progress: ChunkProgressResponse) => void,
): Promise<{ tokens: number[]; tokenTexts: string[] }> {
  // For small texts, use direct tokenization
  if (text.length <= 5000) {
    let tokens: number[];

    switch (model) {
      case "cl100k_base":
        tokens = encodeCl100k(text);
        break;
      case "p50k_base":
        tokens = encodeP50k(text);
        break;
      case "p50k_edit":
        tokens = encodeP50kEdit(text);
        break;
      case "r50k_base":
        tokens = encodeR50k(text);
        break;
      case "o200k_harmony":
      case "o200k_base":
      default:
        tokens = encode(text);
        break;
    }

    const tokenTexts = decodeTokens(tokens, model);
    return { tokens, tokenTexts };
  }

  const chunkSize = 20000; // Increased to 20k for better performance
  const chunks = splitIntoChunks(text, chunkSize);
  const allTokens: number[] = [];

  // Calculate progress intervals - max 5 progress messages
  const totalProgressUpdates = Math.min(5, chunks.length);
  const progressInterval = Math.max(
    1,
    Math.floor(chunks.length / totalProgressUpdates),
  );

  // Process chunks in batches with yielding
  const batchSize = 50; // Increased batch size for better throughput
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batchEnd = Math.min(i + batchSize, chunks.length);

    for (let j = i; j < batchEnd; j++) {
      const chunk = chunks[j];

      // Tokenize this chunk
      let chunkTokens: number[];

      switch (model) {
        case "cl100k_base":
          chunkTokens = encodeCl100k(chunk);
          break;
        case "p50k_base":
          chunkTokens = encodeP50k(chunk);
          break;
        case "p50k_edit":
          chunkTokens = encodeP50kEdit(chunk);
          break;
        case "r50k_base":
          chunkTokens = encodeR50k(chunk);
          break;
        case "o200k_harmony":
        case "o200k_base":
        default:
          chunkTokens = encode(chunk);
          break;
      }

      allTokens.push(...chunkTokens);
    }

    // Report progress only at calculated intervals
    if (
      onProgress &&
      (i === 0 || i % progressInterval === 0 || batchEnd >= chunks.length)
    ) {
      onProgress({
        type: "progress",
        chunkIndex: batchEnd,
        totalChunks: chunks.length,
        percentage: Math.round((batchEnd / chunks.length) * 100),
      });
    }

    // Yield control to browser periodically
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  const tokenTexts = decodeTokens(allTokens, model);
  return { tokens: allTokens, tokenTexts };
}

self.onmessage = async (e: MessageEvent<TokenizerMessage>) => {
  const { text, model = "o200k_base", chatMessages, isChatMode } = e.data;

  try {
    // Handle chat mode
    if (isChatMode && chatMessages && chatMessages.length > 0) {
      // For chat mode, we need to use a model name that supports chat
      // Common chat-enabled models that use different encodings
      let chatModel = "gpt-4o"; // Default to gpt-4o which uses o200k_base

      // Map the encoding to a compatible chat model
      if (model === "cl100k_base") {
        chatModel = "gpt-3.5-turbo";
      } else if (model === "o200k_base" || model === "o200k_harmony") {
        chatModel = "gpt-4o";
      } else if (model === "p50k_base") {
        chatModel = "text-davinci-003";
      } else if (model === "p50k_edit") {
        chatModel = "code-davinci-edit-001";
      } else if (model === "r50k_base") {
        chatModel = "text-davinci-001";
      }

      console.log(
        "Tokenizing chat with model:",
        chatModel,
        "from encoding:",
        model,
      );

      // Cast chatMessages to any to handle type mismatch between our interface and library's interface
      const tokens = encodeChat(chatMessages as any, chatModel as any);
      const tokenTexts = decodeTokens(tokens, model);

      self.postMessage({
        tokens,
        count: tokens.length,
        model,
        tokenTexts,
        isChatMode: true,
        chatMessages,
      } as TokenizerResponse);
      return;
    }

    // Regular text tokenization
    // Check if we should use chunked processing
    const shouldChunk = text.length > 20000; // Increased threshold to match chunk size

    if (shouldChunk) {
      // Process with chunks and report progress
      const { tokens, tokenTexts } = await tokenizeWithChunks(
        text,
        model,
        (progress) => {
          self.postMessage(progress as ChunkProgressResponse);
        },
      );

      // Send final result
      self.postMessage({
        tokens,
        count: tokens.length,
        model,
        tokenTexts,
        isChatMode: false,
      } as TokenizerResponse);
    } else {
      // Direct tokenization for small texts
      let tokens: number[];

      switch (model) {
        case "cl100k_base":
          tokens = encodeCl100k(text);
          break;
        case "p50k_base":
          tokens = encodeP50k(text);
          break;
        case "p50k_edit":
          tokens = encodeP50kEdit(text);
          break;
        case "r50k_base":
          tokens = encodeR50k(text);
          break;
        case "o200k_harmony":
        case "o200k_base":
        default:
          tokens = encode(text);
          break;
      }

      const tokenTexts = decodeTokens(tokens, model);

      self.postMessage({
        tokens,
        count: tokens.length,
        model,
        tokenTexts,
        isChatMode: false,
      } as TokenizerResponse);
    }
  } catch (error) {
    console.error("Tokenizer error:", error);
    self.postMessage({
      tokens: [],
      count: 0,
      model,
      tokenTexts: [],
      isChatMode: isChatMode || false,
      chatMessages,
    } as TokenizerResponse);
  }
};
