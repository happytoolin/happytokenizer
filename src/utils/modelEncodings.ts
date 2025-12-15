import { MODELS, getModelsByEncoding, type EncodingType } from "./models";

export const MODEL_ENCODINGS = {
  cl100k_base: getModelsByEncoding("cl100k_base").map((m) => m.id),
  o200k_base: getModelsByEncoding("o200k_base").map((m) => m.id),
  o200k_harmony: getModelsByEncoding("o200k_harmony").map((m) => m.id),
  p50k_base: getModelsByEncoding("p50k_base").map((m) => m.id),
  p50k_edit: getModelsByEncoding("p50k_edit").map((m) => m.id),
  r50k_base: getModelsByEncoding("r50k_base").map((m) => m.id),
} as const;

// Re-export types
export type { EncodingType };

// Function to check if a string is an encoding type
export function isEncodingType(value: string): value is EncodingType {
  return value in MODEL_ENCODINGS;
}

// Function to get encoding for a specific model
export function getEncodingForModel(modelName: string): EncodingType {
  const model = MODELS[modelName];
  return model?.encoding || "o200k_base"; // Default fallback
}
