import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ChunkProgressResponse,
  TokenizerMessage,
  TokenizerResponse,
} from "../workers/tokenizer.worker";

// Define EncodingType directly to avoid import issues
export type ModelType =
  | "o200k_base"
  | "cl100k_base"
  | "p50k_base"
  | "p50k_edit"
  | "r50k_base"
  | "o200k_harmony";

export interface TokenizerProgress {
  chunkIndex: number;
  totalChunks: number;
  percentage: number;
}

export interface TokenizerResult {
  tokens: number[];
  tokenTexts: string[];
  count: number;
  model: ModelType;
  isLoading: boolean;
  error: string | null;
  progress?: TokenizerProgress;
}

export function useTokenizer() {
  const [result, setResult] = useState<TokenizerResult>({
    tokens: [],
    tokenTexts: [],
    count: 0,
    model: "o200k_base",
    isLoading: false,
    error: null,
  });

  const workerRef = useRef<Worker | null>(null);
  const debounceTimeoutRef = useRef<number | null>(null);

  // Initialize worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/tokenizer.worker.ts", import.meta.url),
      { type: "module" },
    );

    workerRef.current.onmessage = (
      e: MessageEvent<TokenizerResponse | ChunkProgressResponse>,
    ) => {
      const message = e.data;

      // Check if this is a progress message
      if (
        message &&
        typeof message === "object" &&
        "type" in message &&
        message.type === "progress"
      ) {
        const progress = message as ChunkProgressResponse;
        setResult((prev) => ({
          ...prev,
          progress: {
            chunkIndex: progress.chunkIndex,
            totalChunks: progress.totalChunks,
            percentage: progress.percentage,
          },
        }));
      } else {
        // This is the final tokenization result
        const tokenizerResponse = message as TokenizerResponse;

        setResult((prev) => ({
          ...prev,
          tokens: tokenizerResponse.tokens,
          tokenTexts: tokenizerResponse.tokenTexts || [],
          count: tokenizerResponse.tokens.length,
          model: tokenizerResponse.model as ModelType,
          isLoading: false,
          error: null,
          progress: undefined, // Clear progress when done
        }));
      }
    };

    workerRef.current.onerror = (error) => {
      setResult((prev) => ({
        ...prev,
        isLoading: false,
        error: "Worker error: " + error.message,
        progress: undefined, // Clear progress on error
      }));
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const tokenize = useCallback(
    (text: string, model: ModelType = "o200k_base") => {
      if (!workerRef.current) return;

      // Clear previous debounce
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      setResult((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        progress: undefined, // Clear previous progress
      }));

      // Debounce tokenization
      debounceTimeoutRef.current = setTimeout(() => {
        const message: TokenizerMessage = { text, model };
        workerRef.current?.postMessage(message);
      }, 150);
    },
    [],
  );

  return {
    ...result,
    tokenize,
  };
}
