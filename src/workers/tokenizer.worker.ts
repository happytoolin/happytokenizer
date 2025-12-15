import type { ChatMessage } from "../types/chat";
import type { EncodingType } from "../utils/modelEncodings";
import {
  getTokenizer,
  loadCl100k,
  loadP50kBase,
  loadP50kEdit,
  loadR50kBase,
} from "./tokenizerWrapper";

// Dynamic encoding strategy map - load on demand
interface EncodingStrategy {
  encode: (text: string) => number[];
  decode: (tokens: number[]) => string;
}

const ENCODING_STRATEGIES: Record<EncodingType, EncodingStrategy | null> = {
  cl100k_base: null,
  p50k_base: null,
  p50k_edit: null,
  r50k_base: null,
  o200k_base: null,
  o200k_harmony: null,
};

// Dynamic import functions for each encoding using wrapper
const loadEncoding = async (
  encodingType: EncodingType,
): Promise<EncodingStrategy> => {
  switch (encodingType) {
    case "cl100k_base": {
      return await loadCl100k();
    }
    case "p50k_base": {
      return await loadP50kBase();
    }
    case "p50k_edit": {
      return await loadP50kEdit();
    }
    case "r50k_base": {
      return await loadR50kBase();
    }
    case "o200k_base":
    case "o200k_harmony": {
      const tokenizer = await getTokenizer();
      return { encode: tokenizer.encode, decode: tokenizer.decode };
    }
    default:
      throw new Error(`Unknown encoding type: ${encodingType}`);
  }
};

// Get or load encoding strategy with caching
const getEncodingStrategy = async (
  model: EncodingType,
): Promise<EncodingStrategy> => {
  let strategy = ENCODING_STRATEGIES[model];
  if (!strategy) {
    strategy = await loadEncoding(model);
    ENCODING_STRATEGIES[model] = strategy;
  }
  return strategy;
};

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
  tokens: Uint32Array | number[];
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
async function decodeTokens(
  tokens: number[],
  model: EncodingType,
): Promise<string[]> {
  const decoder = (await getEncodingStrategy(model)).decode;

  return tokens.map((token) => {
    try {
      return decoder([token]);
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
    const encoder = (await getEncodingStrategy(model)).encode;
    const tokens = encoder(text);
    const tokenTexts = await decodeTokens(tokens, model);
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

    // Get the encoder once per batch for efficiency
    const encoder = (await getEncodingStrategy(model)).encode;

    for (let j = i; j < batchEnd; j++) {
      const chunk = chunks[j];

      // Tokenize this chunk using strategy
      const chunkTokens = encoder(chunk);
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

  const tokenTexts = await decodeTokens(allTokens, model);
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

      // Dynamic import for encodeChat using wrapper
      const tokenizer = await getTokenizer();
      const tokens =
        tokenizer.encodeChat?.(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          chatMessages as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          chatModel as any,
        ) || [];
      const tokenTexts = await decodeTokens(tokens, model);

      const tokensArray = new Uint32Array(tokens);

      self.postMessage(
        {
          tokens: tokensArray,
          count: tokensArray.length,
          model,
          tokenTexts,
          isChatMode: true,
          chatMessages,
        } as TokenizerResponse,
        { transfer: [tokensArray.buffer] },
      );
      return;
    }

    const shouldChunk = text.length > 20000;

    if (shouldChunk) {
      const { tokens, tokenTexts } = await tokenizeWithChunks(
        text,
        model,
        (progress) => {
          self.postMessage(progress as ChunkProgressResponse);
        },
      );

      // Send final result
      const tokensArray = new Uint32Array(tokens);
      self.postMessage(
        {
          tokens: tokensArray,
          count: tokensArray.length,
          model,
          tokenTexts,
          isChatMode: false,
        } as TokenizerResponse,
        { transfer: [tokensArray.buffer] }, // Transferable: zero-copy
      );
    } else {
      // Direct tokenization for small texts
      const encoder = (await getEncodingStrategy(model)).encode;
      const tokens = encoder(text);
      const tokenTexts = await decodeTokens(tokens, model);

      const tokensArray = new Uint32Array(tokens);
      self.postMessage(
        {
          tokens: tokensArray,
          count: tokensArray.length,
          model,
          tokenTexts,
          isChatMode: false,
        } as TokenizerResponse,
        { transfer: [tokensArray.buffer] }, // Transferable: zero-copy
      );
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
