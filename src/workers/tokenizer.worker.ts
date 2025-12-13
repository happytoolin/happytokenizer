import { encode } from "gpt-tokenizer";
import { encode as encodeCl100k } from "gpt-tokenizer/encoding/cl100k_base";

export interface TokenizerMessage {
  text: string;
  model?: "o200k_base" | "cl100k_base";
  chunkSize?: number;
}

export interface TokenizerResponse {
  tokens: number[];
  count: number;
  model: string;
  chunkProgress?: {
    current: number;
    total: number;
    percentage: number;
  };
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

// Tokenize text with chunking for better performance on large documents
async function tokenizeWithChunks(
  text: string,
  model: "o200k_base" | "cl100k_base",
  onProgress?: (progress: ChunkProgressResponse) => void,
): Promise<number[]> {
  // For small texts, use direct tokenization
  if (text.length <= 5000) {
    return model === "cl100k_base" ? encodeCl100k(text) : encode(text);
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
      const chunkTokens =
        model === "cl100k_base" ? encodeCl100k(chunk) : encode(chunk);

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

  return allTokens;
}

self.onmessage = async (e: MessageEvent<TokenizerMessage>) => {
  const { text, model = "o200k_base", chunkSize } = e.data;

  try {
    // Check if we should use chunked processing
    const shouldChunk = text.length > 20000; // Increased threshold to match chunk size

    if (shouldChunk) {
      // Process with chunks and report progress
      const tokens = await tokenizeWithChunks(text, model, (progress) => {
        self.postMessage({
          type: "progress",
          ...progress,
        } as ChunkProgressResponse);
      });

      // Send final result
      self.postMessage({
        tokens,
        count: tokens.length,
        model,
      } as TokenizerResponse);
    } else {
      // Direct tokenization for small texts
      let tokens: number[];

      if (model === "cl100k_base") {
        tokens = encodeCl100k(text);
      } else {
        tokens = encode(text);
      }

      self.postMessage({
        tokens,
        count: tokens.length,
        model,
      } as TokenizerResponse);
    }
  } catch (error) {
    console.error("Tokenizer error:", error);
    self.postMessage({
      tokens: [],
      count: 0,
      model,
    } as TokenizerResponse);
  }
};
