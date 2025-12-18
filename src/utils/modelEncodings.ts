import { MODELS, getModelsByEncoding, type EncodingType } from "./models";

export const MODEL_ENCODINGS = {
  cl100k_base: getModelsByEncoding("cl100k_base").map((m) => m.id),
  o200k_base: getModelsByEncoding("o200k_base").map((m) => m.id),
  o200k_harmony: getModelsByEncoding("o200k_harmony").map((m) => m.id),
  p50k_base: getModelsByEncoding("p50k_base").map((m) => m.id),
  p50k_edit: getModelsByEncoding("p50k_edit").map((m) => m.id),
  r50k_base: getModelsByEncoding("r50k_base").map((m) => m.id),
  // Non-GPT model encodings
  llama3: getModelsByEncoding("llama3").map((m) => m.id),
  llama2: getModelsByEncoding("llama2").map((m) => m.id),
  deepseek: getModelsByEncoding("deepseek").map((m) => m.id),
  qwen: getModelsByEncoding("qwen").map((m) => m.id),
  gemma: getModelsByEncoding("gemma").map((m) => m.id),
  gemini: getModelsByEncoding("gemini").map((m) => m.id),
  gpt2: getModelsByEncoding("gpt2").map((m) => m.id),
  mistral: getModelsByEncoding("mistral").map((m) => m.id),
  minicpm: getModelsByEncoding("minicpm").map((m) => m.id),
  aya: getModelsByEncoding("aya").map((m) => m.id),
  baichuan: getModelsByEncoding("baichuan").map((m) => m.id),
  chatglm: getModelsByEncoding("chatglm").map((m) => m.id),
  commandr: getModelsByEncoding("commandr").map((m) => m.id),
  internlm: getModelsByEncoding("internlm").map((m) => m.id),
  yi: getModelsByEncoding("yi").map((m) => m.id),
  gptoss: getModelsByEncoding("gptoss").map((m) => m.id),
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

// Function to get a human-readable encoding name
export function getEncodingDisplayName(encoding: EncodingType): string {
  const displayNames: Record<EncodingType, string> = {
    cl100k_base: "CL100K Base (GPT-4)",
    o200k_base: "O200K Base (GPT-4o)",
    o200k_harmony: "O200K Harmony",
    p50k_base: "P50K Base",
    p50k_edit: "P50K Edit",
    r50k_base: "R50K Base (GPT-2)",
    // Non-GPT model encodings
    llama3: "Llama 3",
    llama2: "Llama 2",
    deepseek: "DeepSeek",
    qwen: "Qwen",
    gemma: "Gemma",
    gemini: "Gemini",
    gpt2: "GPT-2",
    mistral: "Mistral",
    minicpm: "MiniCPM",
    aya: "Aya",
    baichuan: "Baichuan",
    chatglm: "ChatGLM",
    commandr: "Command-R",
    internlm: "InternLM",
    yi: "Yi",
    gptoss: "GPT-OSS",
  };

  return displayNames[encoding] || encoding;
}
