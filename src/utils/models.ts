export interface ModelPricing {
  input: number;
  output: number;
  cached?: number; // omitted when the vendor publishes no cache price
}

export interface ModelData {
  id: string;
  displayName: string;
  encoding: EncodingType;
  contextWindow: number;
  pricing: ModelPricing;
}

export interface ModelInsights {
  inputModalities: string[];
  outputModalities: string[];
  features: string[];
  endpoints: string[];
}

// Family-level defaults; per-model overrides below fix the exceptions
// (audio/media models, vision-capable variants). Sources: vendor model pages.
const DEFAULT_INSIGHTS: Record<EncodingType, ModelInsights> = {
  o200k_base: {
    inputModalities: ["Text", "Image"],
    outputModalities: ["Text"],
    features: [
      "Streaming",
      "Structured Outputs",
      "Function Calling",
      "Web Search",
      "Prompt Caching",
      "Reasoning Tokens",
    ],
    endpoints: ["Responses", "Batch"],
  },
  cl100k_base: {
    inputModalities: ["Text"],
    outputModalities: ["Text"],
    features: ["Streaming", "Function Calling"],
    endpoints: ["Chat Completions"],
  },
  p50k_base: {
    inputModalities: ["Text"],
    outputModalities: ["Text"],
    features: ["Streaming"],
    endpoints: ["Completions"],
  },
  p50k_edit: {
    inputModalities: ["Text"],
    outputModalities: ["Text"],
    features: ["Streaming"],
    endpoints: ["Edits"],
  },
  r50k_base: {
    inputModalities: ["Text"],
    outputModalities: ["Text"],
    features: ["Streaming"],
    endpoints: ["Completions"],
  },
  o200k_harmony: {
    inputModalities: ["Text"],
    outputModalities: ["Text"],
    features: ["Streaming", "Function Calling", "Reasoning Tokens"],
    endpoints: ["Chat Completions", "Responses"],
  },
  anthropic: {
    inputModalities: ["Text", "Image"],
    outputModalities: ["Text"],
    features: ["Streaming", "Function Calling", "Prompt Caching"],
    endpoints: ["Messages", "Batch"],
  },
  kimi: {
    inputModalities: ["Text"],
    outputModalities: ["Text"],
    features: ["Streaming", "Function Calling", "Prompt Caching"],
    endpoints: ["Chat Completions"],
  },
  qwen: {
    inputModalities: ["Text"],
    outputModalities: ["Text"],
    features: ["Streaming", "Function Calling", "Structured Outputs"],
    endpoints: ["Chat Completions"],
  },
  glm: {
    inputModalities: ["Text"], // GLM-5.3 is text-only per docs.z.ai
    outputModalities: ["Text"],
    features: ["Streaming", "Function Calling", "Prompt Caching"],
    endpoints: ["Chat Completions", "Batch"],
  },
};

const INSIGHT_OVERRIDES: Record<string, Partial<ModelInsights>> = {
  "kimi-k2.6": { inputModalities: ["Text", "Image"] }, // multimodal repo
  "whisper-1": {
    inputModalities: ["Audio"],
    outputModalities: ["Text"],
    features: ["Timestamps"],
    endpoints: ["Transcriptions"],
  },
  "tts-1": {
    inputModalities: ["Text"],
    outputModalities: ["Audio"],
    features: ["Streaming"],
    endpoints: ["Speech"],
  },
  "tts-1-hd": {
    inputModalities: ["Text"],
    outputModalities: ["Audio"],
    features: ["Streaming"],
    endpoints: ["Speech"],
  },
  "dall-e-2": {
    inputModalities: ["Text"],
    outputModalities: ["Image"],
    features: ["Multiple Resolutions"],
    endpoints: ["Images"],
  },
  "dall-e-3": {
    inputModalities: ["Text"],
    outputModalities: ["Image"],
    features: ["Prompt Rewriting", "Quality Presets"],
    endpoints: ["Images"],
  },
  "gpt-audio": {
    inputModalities: ["Text", "Audio"],
    outputModalities: ["Text", "Audio"],
    features: ["Streaming", "Function Calling"],
    endpoints: ["Responses"],
  },
  "gpt-audio-mini": {
    inputModalities: ["Text", "Audio"],
    outputModalities: ["Text", "Audio"],
    features: ["Streaming", "Function Calling"],
    endpoints: ["Responses"],
  },
  "sora-2": {
    inputModalities: ["Text", "Image"],
    outputModalities: ["Video"],
    features: ["Streaming"],
    endpoints: ["Videos"],
  },
  "sora-2-pro": {
    inputModalities: ["Text", "Image"],
    outputModalities: ["Video"],
    features: ["Streaming"],
    endpoints: ["Videos"],
  },
  "text-moderation-007": {
    inputModalities: ["Text"],
    outputModalities: ["Classification"],
    features: [],
    endpoints: ["Moderations"],
  },
  "text-moderation-latest": {
    inputModalities: ["Text"],
    outputModalities: ["Classification"],
    features: [],
    endpoints: ["Moderations"],
  },
  "text-moderation-stable": {
    inputModalities: ["Text"],
    outputModalities: ["Classification"],
    features: [],
    endpoints: ["Moderations"],
  },
};

export function getModelInsights(modelId: string): ModelInsights {
  const model = MODELS[modelId];
  const base = DEFAULT_INSIGHTS[model?.encoding || "o200k_base"];
  return { ...base, ...(INSIGHT_OVERRIDES[modelId] || {}) };
}

export type EncodingType =
  | "o200k_base"
  | "anthropic"
  | "kimi"
  | "qwen"
  | "glm"
  | "cl100k_base"
  | "p50k_base"
  | "p50k_edit"
  | "r50k_base"
  | "o200k_harmony";

const DEFAULT_PRICING: Record<EncodingType, ModelPricing> = {
  o200k_base: { input: 0.0025, output: 0.01, cached: 0.00125 },
  cl100k_base: { input: 0.01, output: 0.03, cached: 0.005 },
  p50k_base: { input: 0.002, output: 0.002, cached: 0.001 },
  p50k_edit: { input: 0.002, output: 0.002, cached: 0.001 },
  r50k_base: { input: 0.002, output: 0.002, cached: 0.001 },
  o200k_harmony: { input: 0.0025, output: 0.01, cached: 0.00125 },
  anthropic: { input: 0.002, output: 0.01, cached: 0.0002 },
  kimi: { input: 0.00095, output: 0.004 },
  qwen: { input: 0.002, output: 0.006 },
  glm: { input: 0.0014, output: 0.0044, cached: 0.00026 },
};

const DEFAULT_CONTEXT_LIMITS: Record<EncodingType, number> = {
  o200k_base: 128000,
  cl100k_base: 8192,
  p50k_base: 2049,
  p50k_edit: 2049,
  r50k_base: 2049,
  o200k_harmony: 128000,
  anthropic: 1000000,
  kimi: 262144,
  qwen: 1000000,
  glm: 1048576,
};

export const MODELS: Record<string, ModelData> = {
  "gpt-6-astra": {
    id: "gpt-6-astra",
    displayName: "GPT-6 Astra",
    encoding: "o200k_base",
    contextWindow: 1050000,
    pricing: { input: 0.005, output: 0.025, cached: 0.0005 }, // $5.00/$25.00/$0.50 per M → per 1K
  },
  "gpt-5.6": {
    id: "gpt-5.6",
    displayName: "GPT-5.6",
    encoding: "o200k_base",
    contextWindow: 1050000,
    pricing: { input: 0.002, output: 0.01, cached: 0.0002 }, // alias for GPT-5.6 Sol → per 1K
  },
  "gpt-5.6-sol": {
    id: "gpt-5.6-sol",
    displayName: "GPT-5.6 Sol",
    encoding: "o200k_base",
    contextWindow: 1050000,
    pricing: { input: 0.002, output: 0.01, cached: 0.0002 }, // $2.00/$10.00/$0.20 per M (promo) → per 1K
  },
  "gpt-5.6-terra": {
    id: "gpt-5.6-terra",
    displayName: "GPT-5.6 Terra",
    encoding: "o200k_base",
    contextWindow: 1050000,
    pricing: { input: 0.001, output: 0.006, cached: 0.0001 }, // $1.00/$6.00/$0.10 per M → per 1K
  },
  "gpt-5.6-luna": {
    id: "gpt-5.6-luna",
    displayName: "GPT-5.6 Luna",
    encoding: "o200k_base",
    contextWindow: 1050000,
    pricing: { input: 0.0001, output: 0.0006, cached: 0.00001 }, // $0.10/$0.60/$0.01 per M → per 1K
  },
  "gpt-5.6-cyber": {
    id: "gpt-5.6-cyber",
    displayName: "GPT-5.6 Cyber",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.0125, output: 0.075, cached: 0.00125 }, // $12.50/$75.00/$1.25 per M → per 1K
  },
  "gpt-5.5": {
    id: "gpt-5.5",
    displayName: "GPT-5.5",
    encoding: "o200k_base",
    contextWindow: 1050000,
    pricing: { input: 0.005, output: 0.03, cached: 0.0005 }, // $5.00/$30.00/$0.50 per M → per 1K
  },
  "gpt-5.5-pro": {
    id: "gpt-5.5-pro",
    displayName: "GPT-5.5 Pro",
    encoding: "o200k_base",
    contextWindow: 1050000,
    pricing: { input: 0.03, output: 0.18, cached: 0 }, // $30.00/$180.00 per M → per 1K (no cached)
  },
  "gpt-5.4": {
    id: "gpt-5.4",
    displayName: "GPT-5.4",
    encoding: "o200k_base",
    contextWindow: 1050000,
    pricing: { input: 0.0025, output: 0.015, cached: 0.00025 }, // $2.50/$15.00/$0.25 per M → per 1K
  },
  "gpt-5.4-pro": {
    id: "gpt-5.4-pro",
    displayName: "GPT-5.4 Pro",
    encoding: "o200k_base",
    contextWindow: 1050000,
    pricing: { input: 0.03, output: 0.18, cached: 0 }, // $30.00/$180.00 per M → per 1K (no cached)
  },
  "gpt-5.4-mini": {
    id: "gpt-5.4-mini",
    displayName: "GPT-5.4 Mini",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.00075, output: 0.0045, cached: 0.000075 }, // $0.75/$4.50/$0.075 per M → per 1K
  },
  "gpt-5.4-nano": {
    id: "gpt-5.4-nano",
    displayName: "GPT-5.4 Nano",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.0002, output: 0.00125, cached: 0.00002 }, // $0.20/$1.25/$0.02 per M → per 1K
  },
  "gpt-5.3-codex": {
    id: "gpt-5.3-codex",
    displayName: "GPT-5.3 Codex",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.00175, output: 0.014, cached: 0.000175 }, // $1.75/$14.00/$0.175 per M → per 1K
  },
  "gpt-5.3-chat-latest": {
    id: "gpt-5.3-chat-latest",
    displayName: "GPT-5.3 Chat Latest",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.00175, output: 0.014, cached: 0.000175 }, // deprecated → per 1K
  },

  // Anthropic — pricing from docs.claude.com (per 1K = per-M ÷ 1000)
  "claude-fable-5.1": {
    id: "claude-fable-5.1",
    displayName: "Claude Fable 5.1",
    encoding: "anthropic",
    contextWindow: 1000000,
    pricing: { input: 0.01, output: 0.05, cached: 0.00025 }, // $10/$50/$0.25 per M
  },
  "claude-opus-5": {
    id: "claude-opus-5",
    displayName: "Claude Opus 5",
    encoding: "anthropic",
    contextWindow: 1000000,
    pricing: { input: 0.005, output: 0.025, cached: 0.0005 }, // $5/$25/$0.50 per M
  },
  "claude-sonnet-5": {
    id: "claude-sonnet-5",
    displayName: "Claude Sonnet 5",
    encoding: "anthropic",
    contextWindow: 1000000,
    pricing: { input: 0.002, output: 0.01, cached: 0.0002 }, // $2/$10/$0.20 per M
  },
  "claude-haiku-4.5": {
    id: "claude-haiku-4.5",
    displayName: "Claude Haiku 4.5",
    encoding: "anthropic",
    contextWindow: 200000,
    pricing: { input: 0.001, output: 0.005, cached: 0.0001 }, // $1/$5/$0.10 per M
  },

  // Moonshot Kimi — pricing via OpenRouter (per 1K); same tokenizer for K2.6/K2.7-Code/K3
  "kimi-k3": {
    id: "kimi-k3",
    displayName: "Kimi K3",
    encoding: "kimi",
    contextWindow: 1048576,
    pricing: { input: 0.003, output: 0.015 }, // $3/$15 per M
  },
  "kimi-k2.7-code": {
    id: "kimi-k2.7-code",
    displayName: "Kimi K2.7 Code",
    encoding: "kimi",
    contextWindow: 262144,
    pricing: { input: 0.00066, output: 0.0034 }, // $0.66/$3.40 per M
  },
  "kimi-k2.6": {
    id: "kimi-k2.6",
    displayName: "Kimi K2.6",
    encoding: "kimi",
    contextWindow: 262144,
    pricing: { input: 0.00095, output: 0.004 }, // $0.95/$4 per M
  },

  // Alibaba Qwen — pricing via OpenRouter/Model Studio (per 1K)
  "qwen3.8-max": {
    id: "qwen3.8-max",
    displayName: "Qwen3.8 Max",
    encoding: "qwen",
    contextWindow: 1000000,
    pricing: { input: 0.002, output: 0.006 }, // $2/$6 per M
  },
  "qwen3.8-2.4t-a95b": {
    id: "qwen3.8-2.4t-a95b",
    displayName: "Qwen3.8 2.4T A95B (Open)",
    encoding: "qwen",
    contextWindow: 1048576,
    pricing: { input: 0.002, output: 0.006 }, // $2/$6 per M
  },
  "qwen3.8-flash": {
    id: "qwen3.8-flash",
    displayName: "Qwen3.8 Flash",
    encoding: "qwen",
    contextWindow: 1000000,
    pricing: { input: 0.00015, output: 0.00047 }, // $0.15/$0.47 per M
  },

  // Z.ai GLM — pricing from docs.z.ai (per 1K)
  "glm-5.3": {
    id: "glm-5.3",
    displayName: "GLM-5.3",
    encoding: "glm",
    contextWindow: 1048576, // 1M context, 128K max output (docs.z.ai)
    pricing: { input: 0.0014, output: 0.0044, cached: 0.00026 }, // $1.4/$4.4/$0.26 per M
  },
  "glm-5.3-flash": {
    id: "glm-5.3-flash",
    displayName: "GLM-5.3 Flash",
    encoding: "glm",
    contextWindow: 1048576,
    pricing: { input: 0.000075, output: 0.00025, cached: 0.000015 }, // $0.075/$0.25/$0.015 per M (promo)
  },
  "glm-4.7": {
    id: "glm-4.7",
    displayName: "GLM-4.7",
    encoding: "glm",
    contextWindow: 204800,
    pricing: { input: 0.0006, output: 0.0022, cached: 0.00011 }, // $0.6/$2.2/$0.11 per M
  },

  "gpt-5": {
    id: "gpt-5",
    displayName: "GPT-5",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.00125, output: 0.01, cached: 0.000125 }, // $1.25/$10.00/$0.125 per M → per 1K
  },
  "gpt-5-chat-latest": {
    id: "gpt-5-chat-latest",
    displayName: "GPT-5 Chat Latest",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.00125, output: 0.01, cached: 0.000125 }, // $1.25/$10.00/$0.125 per M → per 1K
  },
  "gpt-5-codex": {
    id: "gpt-5-codex",
    displayName: "GPT-5 Codex",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.00125, output: 0.01, cached: 0.000125 }, // $1.25/$10.00/$0.125 per M → per 1K
  },
  "gpt-5-mini": {
    id: "gpt-5-mini",
    displayName: "GPT-5 Mini",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.00025, output: 0.002, cached: 0.000025 }, // $0.25/$2.00/$0.025 per M → per 1K
  },
  "gpt-5-nano": {
    id: "gpt-5-nano",
    displayName: "GPT-5 Nano",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.00005, output: 0.0004, cached: 0.000005 }, // $0.05/$0.40/$0.005 per M → per 1K
  },
  "gpt-5-pro": {
    id: "gpt-5-pro",
    displayName: "GPT-5 Pro",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.015, output: 0.12, cached: 0 }, // $15.00/$120.00 per M → per 1K (no cached)
  },
  "gpt-5.1": {
    id: "gpt-5.1",
    displayName: "GPT-5.1",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.00125, output: 0.01, cached: 0.000125 }, // $1.25/$10.00/$0.125 per M → per 1K
  },
  "gpt-5.1-chat-latest": {
    id: "gpt-5.1-chat-latest",
    displayName: "GPT-5.1 Chat Latest",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.00125, output: 0.01, cached: 0.000125 }, // $1.25/$10.00/$0.125 per M → per 1K
  },
  "gpt-5.1-codex": {
    id: "gpt-5.1-codex",
    displayName: "GPT-5.1 Codex",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.00125, output: 0.01, cached: 0.000125 }, // $1.25/$10.00/$0.125 per M → per 1K
  },
  "gpt-5.1-codex-max": {
    id: "gpt-5.1-codex-max",
    displayName: "GPT-5.1 Codex Max",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.00125, output: 0.01, cached: 0.000125 }, // $1.25/$10.00/$0.125 per M → per 1K
  },
  "gpt-5.1-codex-mini": {
    id: "gpt-5.1-codex-mini",
    displayName: "GPT-5.1 Codex Mini",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.00025, output: 0.002, cached: 0.000025 }, // $0.25/$2.00/$0.025 per M → per 1K
  },
  "gpt-5.2": {
    id: "gpt-5.2",
    displayName: "GPT-5.2",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.00175, output: 0.014, cached: 0.000175 }, // $1.75/$14.00/$0.175 per M → per 1K
  },
  "gpt-5.2-chat-latest": {
    id: "gpt-5.2-chat-latest",
    displayName: "GPT-5.2 Chat Latest",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.00175, output: 0.014, cached: 0.000175 }, // $1.75/$14.00/$0.175 per M → per 1K
  },
  "gpt-5.2-pro": {
    id: "gpt-5.2-pro",
    displayName: "GPT-5.2 Pro",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.021, output: 0.168, cached: 0 }, // $21.00/$168.00 per M → per 1K (no cached)
  },
  "gpt-5-search-api": {
    id: "gpt-5-search-api",
    displayName: "GPT-5 Search API",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: { input: 0.00125, output: 0.01, cached: 0.000125 }, // $1.25/$10.00/$0.125 per M → per 1K
  },

  // GPT-4o series
  "gpt-4o": {
    id: "gpt-4o",
    displayName: "GPT-4o",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0025, output: 0.01, cached: 0.00125 }, // $2.50/$10.00/$1.25 per M → per 1K
  },
  "gpt-4o-audio-preview": {
    id: "gpt-4o-audio-preview",
    displayName: "GPT-4o Audio Preview",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0025, output: 0.01, cached: 0 }, // $2.50/$10.00 per M → per 1K (no cached)
  },
  "gpt-4o-mini": {
    id: "gpt-4o-mini",
    displayName: "GPT-4o Mini",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.00015, output: 0.0006, cached: 0.000075 }, // $0.15/$0.60/$0.075 per M → per 1K
  },
  "gpt-4o-mini-audio-preview": {
    id: "gpt-4o-mini-audio-preview",
    displayName: "GPT-4o Mini Audio Preview",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.00015, output: 0.0006, cached: 0 }, // $0.15/$0.60 per M → per 1K (no cached)
  },
  "gpt-4o-mini-realtime-preview": {
    id: "gpt-4o-mini-realtime-preview",
    displayName: "GPT-4o Mini Realtime Preview",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0006, output: 0.0024, cached: 0.0003 }, // $0.60/$2.40/$0.30 per M → per 1K
  },
  "gpt-4o-mini-search-preview": {
    id: "gpt-4o-mini-search-preview",
    displayName: "GPT-4o Mini Search Preview",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.00015, output: 0.0006, cached: 0 }, // $0.15/$0.60 per M → per 1K (no cached)
  },
  "gpt-4o-mini-transcribe": {
    id: "gpt-4o-mini-transcribe",
    displayName: "GPT-4o Mini Transcribe",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.00125, output: 0.005, cached: 0 }, // $1.25/$5.00 per M → per 1K (no cached)
  },
  "gpt-4o-mini-tts": {
    id: "gpt-4o-mini-tts",
    displayName: "GPT-4o Mini TTS",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0006, output: 0.012, cached: 0 }, // $0.60/$12.00 per M → per 1K (no cached)
  },
  "gpt-4o-realtime-preview": {
    id: "gpt-4o-realtime-preview",
    displayName: "GPT-4o Realtime Preview",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.005, output: 0.02, cached: 0.0025 }, // $5.00/$20.00/$2.50 per M → per 1K
  },
  "gpt-4o-search-preview": {
    id: "gpt-4o-search-preview",
    displayName: "GPT-4o Search Preview",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0025, output: 0.01, cached: 0 }, // $2.50/$10.00 per M → per 1K (no cached)
  },
  "gpt-4o-transcribe": {
    id: "gpt-4o-transcribe",
    displayName: "GPT-4o Transcribe",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0025, output: 0.01, cached: 0 }, // $2.50/$10.00 per M → per 1K (no cached)
  },

  // O1 series
  o1: {
    id: "o1",
    displayName: "O1",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.015, output: 0.06, cached: 0.0075 }, // $15.00/$60.00/$7.50 per M → per 1K
  },
  "o1-mini": {
    id: "o1-mini",
    displayName: "O1 Mini",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0011, output: 0.0044, cached: 0.00055 }, // $1.10/$4.40/$0.55 per M → per 1K
  },
  "o1-preview": {
    id: "o1-preview",
    displayName: "O1 Preview",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.015, output: 0.06, cached: 0.0075 }, // $15.00/$60.00/$7.50 per M → per 1K
  },
  "o1-pro": {
    id: "o1-pro",
    displayName: "O1 Pro",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.15, output: 0.6, cached: 0 }, // $150.00/$600.00 per M → per 1K (no cached)
  },

  // O3 series
  o3: {
    id: "o3",
    displayName: "O3",
    encoding: "o200k_base",
    contextWindow: 200000,
    pricing: { input: 0.002, output: 0.008, cached: 0.0005 }, // $2.00/$8.00/$0.50 per M → per 1K
  },
  "o3-deep-research": {
    id: "o3-deep-research",
    displayName: "O3 Deep Research",
    encoding: "o200k_base",
    contextWindow: 200000,
    pricing: { input: 0.01, output: 0.04, cached: 0.0025 }, // $10.00/$40.00/$2.50 per M → per 1K
  },
  "o3-mini": {
    id: "o3-mini",
    displayName: "O3 Mini",
    encoding: "o200k_base",
    contextWindow: 200000,
    pricing: { input: 0.0011, output: 0.0044, cached: 0.00055 }, // $1.10/$4.40/$0.55 per M → per 1K
  },
  "o3-pro": {
    id: "o3-pro",
    displayName: "O3 Pro",
    encoding: "o200k_base",
    contextWindow: 200000,
    pricing: { input: 0.02, output: 0.08, cached: 0 }, // $20.00/$80.00 per M → per 1K (no cached)
  },

  // O4 series
  "o4-mini": {
    id: "o4-mini",
    displayName: "O4 Mini",
    encoding: "o200k_base",
    contextWindow: 200000,
    pricing: { input: 0.0011, output: 0.0044, cached: 0.000275 }, // $1.10/$4.40/$0.275 per M → per 1K
  },
  "o4-mini-deep-research": {
    id: "o4-mini-deep-research",
    displayName: "O4 Mini Deep Research",
    encoding: "o200k_base",
    contextWindow: 200000,
    pricing: { input: 0.002, output: 0.008, cached: 0.0005 }, // $2.00/$8.00/$0.50 per M → per 1K
  },

  // Legacy GPT-4 series
  "gpt-4": {
    id: "gpt-4",
    displayName: "GPT-4",
    encoding: "cl100k_base",
    contextWindow: 8192,
    pricing: { input: 0.03, output: 0.06, cached: 0.015 },
  },
  "gpt-4-32k": {
    id: "gpt-4-32k",
    displayName: "GPT-4 32K",
    encoding: "cl100k_base",
    contextWindow: 32768,
    pricing: { input: 0.06, output: 0.12, cached: 0.03 },
  },
  "gpt-4-turbo": {
    id: "gpt-4-turbo",
    displayName: "GPT-4 Turbo",
    encoding: "cl100k_base",
    contextWindow: 128000,
    pricing: { input: 0.01, output: 0.03, cached: 0.005 },
  },
  "gpt-4-turbo-preview": {
    id: "gpt-4-turbo-preview",
    displayName: "GPT-4 Turbo Preview",
    encoding: "cl100k_base",
    contextWindow: 128000,
    pricing: { input: 0.01, output: 0.03, cached: 0.005 },
  },
  "gpt-4.1": {
    id: "gpt-4.1",
    displayName: "GPT-4.1",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.002, output: 0.008, cached: 0.0005 }, // $2.00/$8.00/$0.50 per M → per 1K
  },
  "gpt-4.1-mini": {
    id: "gpt-4.1-mini",
    displayName: "GPT-4.1 Mini",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0004, output: 0.0016, cached: 0.0001 }, // $0.40/$1.60/$0.10 per M → per 1K
  },
  "gpt-4.1-nano": {
    id: "gpt-4.1-nano",
    displayName: "GPT-4.1 Nano",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0001, output: 0.0004, cached: 0.000025 }, // $0.10/$0.40/$0.025 per M → per 1K
  },

  // GPT-3.5 series
  "gpt-3.5": {
    id: "gpt-3.5",
    displayName: "GPT-3.5",
    encoding: "cl100k_base",
    contextWindow: 4096,
    pricing: { input: 0.0015, output: 0.002, cached: 0 }, // No cached input
  },
  "gpt-3.5-turbo": {
    id: "gpt-3.5-turbo",
    displayName: "GPT-3.5 Turbo",
    encoding: "cl100k_base",
    contextWindow: 4096,
    pricing: { input: 0.0005, output: 0.0015, cached: 0 },
  },
  "gpt-3.5-turbo-instruct": {
    id: "gpt-3.5-turbo-instruct",
    displayName: "GPT-3.5 Turbo Instruct",
    encoding: "cl100k_base",
    contextWindow: 4096,
    pricing: { input: 0.0015, output: 0.002, cached: 0 },
  },

  // Specialized models
  "chatgpt-4o-latest": {
    id: "chatgpt-4o-latest",
    displayName: "ChatGPT-4o Latest",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.005, output: 0.015, cached: 0 }, // Legacy pricing
  },
  "codex-mini-latest": {
    id: "codex-mini-latest",
    displayName: "Codex Mini Latest",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0015, output: 0.006, cached: 0.000375 }, // $1.50/$6.00/$0.375 per M → per 1K
  },
  "computer-use-preview": {
    id: "computer-use-preview",
    displayName: "Computer Use Preview",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.003, output: 0.012, cached: 0 }, // No cached input
  },
  "gpt-audio": {
    id: "gpt-audio",
    displayName: "GPT Audio",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0025, output: 0.01, cached: 0 }, // No cached input
  },
  "gpt-audio-mini": {
    id: "gpt-audio-mini",
    displayName: "GPT Audio Mini",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0006, output: 0.0024, cached: 0 }, // No cached input
  },
  "gpt-image-1": {
    id: "gpt-image-1",
    displayName: "GPT Image 1",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.005, output: 0.04, cached: 0.00125 }, // $5.00/$40.00/$1.25 per M → per 1K
  },
  "gpt-image-1-mini": {
    id: "gpt-image-1-mini",
    displayName: "GPT Image 1 Mini",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.002, output: 0.008, cached: 0.0002 }, // $2.00/$8.00/$0.20 per M → per 1K
  },
  "gpt-realtime": {
    id: "gpt-realtime",
    displayName: "GPT Realtime",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.004, output: 0.016, cached: 0.0004 }, // $4.00/$16.00/$0.40 per M → per 1K
  },
  "gpt-realtime-mini": {
    id: "gpt-realtime-mini",
    displayName: "GPT Realtime Mini",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0006, output: 0.0024, cached: 0.00006 }, // $0.60/$2.40/$0.06 per M → per 1K
  },
  "omni-moderation-latest": {
    id: "omni-moderation-latest",
    displayName: "Omni Moderation Latest",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0, output: 0.0, cached: 0 }, // Free
  },
  "whisper-1": {
    id: "whisper-1",
    displayName: "Whisper 1",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0, output: 0.0, cached: 0 }, // $0.006 per minute, not per token
  },
  // Note: DALL-E models are priced per image, not per token
  "tts-1": {
    id: "tts-1",
    displayName: "TTS-1",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0, output: 0.015, cached: 0 }, // $15 per 1M characters
  },
  "tts-1-hd": {
    id: "tts-1-hd",
    displayName: "TTS-1 HD",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0, output: 0.03, cached: 0 }, // $30 per 1M characters
  },
  // Sora models are priced per second, not per token
  "sora-2": {
    id: "sora-2",
    displayName: "Sora 2",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0, output: 0.0, cached: 0 }, // $0.10 per second
  },
  "sora-2-pro": {
    id: "sora-2-pro",
    displayName: "Sora 2 Pro",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0, output: 0.0, cached: 0 }, // $0.30-$0.50 per second
  },

  // Embedding models
  "text-embedding-3-large": {
    id: "text-embedding-3-large",
    displayName: "Text Embedding 3 Large",
    encoding: "cl100k_base",
    contextWindow: 8192,
    pricing: { input: 0.00013, output: 0.0, cached: 0.00007 }, // Batch pricing: $0.065
  },
  "text-embedding-3-small": {
    id: "text-embedding-3-small",
    displayName: "Text Embedding 3 Small",
    encoding: "cl100k_base",
    contextWindow: 8192,
    pricing: { input: 0.00002, output: 0.0, cached: 0.00001 }, // Batch pricing: $0.01
  },
  "text-embedding-ada-002": {
    id: "text-embedding-ada-002",
    displayName: "Text Embedding Ada 002",
    encoding: "cl100k_base",
    contextWindow: 8192,
    pricing: { input: 0.0001, output: 0.0, cached: 0.00005 }, // Batch pricing: $0.05
  },

  // Open Source models
  "gpt-oss-120b": {
    id: "gpt-oss-120b",
    displayName: "GPT-OSS 120B",
    encoding: "o200k_harmony",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_harmony,
  },
  "gpt-oss-20b": {
    id: "gpt-oss-20b",
    displayName: "GPT-OSS 20B",
    encoding: "o200k_harmony",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_harmony,
  },

  // Code models
  "code-cushman-001": {
    id: "code-cushman-001",
    displayName: "Code Cushman 001",
    encoding: "p50k_base",
    contextWindow: 2048,
    pricing: DEFAULT_PRICING.p50k_base,
  },
  "code-cushman-002": {
    id: "code-cushman-002",
    displayName: "Code Cushman 002",
    encoding: "p50k_base",
    contextWindow: 2048,
    pricing: DEFAULT_PRICING.p50k_base,
  },
  "code-davinci-001": {
    id: "code-davinci-001",
    displayName: "Code Davinci 001",
    encoding: "p50k_base",
    contextWindow: 8001,
    pricing: DEFAULT_PRICING.p50k_base,
  },
  "code-davinci-002": {
    id: "code-davinci-002",
    displayName: "Code Davinci 002",
    encoding: "p50k_base",
    contextWindow: 8001,
    pricing: DEFAULT_PRICING.p50k_base,
  },
  "code-davinci-edit-001": {
    id: "code-davinci-edit-001",
    displayName: "Code Davinci Edit 001",
    encoding: "p50k_edit",
    contextWindow: 2048,
    pricing: DEFAULT_PRICING.p50k_edit,
  },
  "cushman-codex": {
    id: "cushman-codex",
    displayName: "Cushman Codex",
    encoding: "p50k_base",
    contextWindow: 2048,
    pricing: DEFAULT_PRICING.p50k_base,
  },
  "davinci-codex": {
    id: "davinci-codex",
    displayName: "Davinci Codex",
    encoding: "p50k_base",
    contextWindow: 4097,
    pricing: DEFAULT_PRICING.p50k_base,
  },
  "text-davinci-edit-001": {
    id: "text-davinci-edit-001",
    displayName: "Text Davinci Edit 001",
    encoding: "p50k_edit",
    contextWindow: 2048,
    pricing: DEFAULT_PRICING.p50k_edit,
  },

  // Legacy models
  "babbage-002": {
    id: "babbage-002",
    displayName: "Babbage 002",
    encoding: "cl100k_base",
    contextWindow: 8192,
    pricing: { input: 0.0004, output: 0.0004, cached: 0 }, // Fine-tuned version
  },
  "davinci-002": {
    id: "davinci-002",
    displayName: "Davinci 002",
    encoding: "cl100k_base",
    contextWindow: 8192,
    pricing: { input: 0.002, output: 0.002, cached: 0 }, // Fine-tuned version
  },
  ada: {
    id: "ada",
    displayName: "Ada",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  babbage: {
    id: "babbage",
    displayName: "Babbage",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  curie: {
    id: "curie",
    displayName: "Curie",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  davinci: {
    id: "davinci",
    displayName: "Davinci",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "text-davinci-001": {
    id: "text-davinci-001",
    displayName: "Text Davinci 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "text-davinci-002": {
    id: "text-davinci-002",
    displayName: "Text Davinci 002",
    encoding: "r50k_base",
    contextWindow: 4097,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "text-davinci-003": {
    id: "text-davinci-003",
    displayName: "Text Davinci 003",
    encoding: "r50k_base",
    contextWindow: 4097,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "text-ada-001": {
    id: "text-ada-001",
    displayName: "Text Ada 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "text-babbage-001": {
    id: "text-babbage-001",
    displayName: "Text Babbage 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "text-curie-001": {
    id: "text-curie-001",
    displayName: "Text Curie 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },

  // Search models
  "code-search-ada-code-001": {
    id: "code-search-ada-code-001",
    displayName: "Code Search Ada Code 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "code-search-ada-text-001": {
    id: "code-search-ada-text-001",
    displayName: "Code Search Ada Text 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "code-search-babbage-code-001": {
    id: "code-search-babbage-code-001",
    displayName: "Code Search Babbage Code 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "code-search-babbage-text-001": {
    id: "code-search-babbage-text-001",
    displayName: "Code Search Babbage Text 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "text-search-ada-doc-001": {
    id: "text-search-ada-doc-001",
    displayName: "Text Search Ada Doc 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "text-search-ada-query-001": {
    id: "text-search-ada-query-001",
    displayName: "Text Search Ada Query 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "text-search-babbage-doc-001": {
    id: "text-search-babbage-doc-001",
    displayName: "Text Search Babbage Doc 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "text-search-babbage-query-001": {
    id: "text-search-babbage-query-001",
    displayName: "Text Search Babbage Query 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "text-search-curie-doc-001": {
    id: "text-search-curie-doc-001",
    displayName: "Text Search Curie Doc 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "text-search-curie-query-001": {
    id: "text-search-curie-query-001",
    displayName: "Text Search Curie Query 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "text-search-davinci-doc-001": {
    id: "text-search-davinci-doc-001",
    displayName: "Text Search Davinci Doc 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "text-search-davinci-query-001": {
    id: "text-search-davinci-query-001",
    displayName: "Text Search Davinci Query 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },

  // Similarity models
  "text-similarity-ada-001": {
    id: "text-similarity-ada-001",
    displayName: "Text Similarity Ada 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "text-similarity-babbage-001": {
    id: "text-similarity-babbage-001",
    displayName: "Text Similarity Babbage 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "text-similarity-curie-001": {
    id: "text-similarity-curie-001",
    displayName: "Text Similarity Curie 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },
  "text-similarity-davinci-001": {
    id: "text-similarity-davinci-001",
    displayName: "Text Similarity Davinci 001",
    encoding: "r50k_base",
    contextWindow: 2049,
    pricing: DEFAULT_PRICING.r50k_base,
  },

  // Additional moderation models
  "text-moderation-007": {
    id: "text-moderation-007",
    displayName: "Text Moderation 007",
    encoding: "cl100k_base",
    contextWindow: 8192,
    pricing: { input: 0.0, output: 0.0, cached: 0 }, // Free
  },
  "text-moderation-latest": {
    id: "text-moderation-latest",
    displayName: "Text Moderation Latest",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0, output: 0.0, cached: 0 }, // Free
  },
  "text-moderation-stable": {
    id: "text-moderation-stable",
    displayName: "Text Moderation Stable",
    encoding: "cl100k_base",
    contextWindow: 8192,
    pricing: { input: 0.0, output: 0.0, cached: 0 }, // Free
  },

  // DALL-E models (priced per image, not per token)
  "dall-e-2": {
    id: "dall-e-2",
    displayName: "DALL-E 2",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0, output: 0.0, cached: 0 }, // Priced per image: $0.016-$0.020
  },
  "dall-e-3": {
    id: "dall-e-3",
    displayName: "DALL-E 3",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0, output: 0.0, cached: 0 }, // Priced per image: $0.04-$0.12
  },
};

// Helper functions
export function getModel(modelId: string): ModelData | undefined {
  return MODELS[modelId];
}

export function isValidModel(modelId: string): modelId is keyof typeof MODELS {
  return modelId in MODELS;
}

export function getModelDisplayName(modelId: string): string {
  const model = MODELS[modelId];
  return model?.displayName || modelId;
}

export function getModelEncoding(modelId: string): EncodingType {
  const model = MODELS[modelId];
  return model?.encoding || "o200k_base";
}

export function getContextWindow(modelId: string): number {
  const model = MODELS[modelId];
  return model?.contextWindow || DEFAULT_CONTEXT_LIMITS.o200k_base;
}

export function getPricing(modelId: string): ModelPricing {
  const model = MODELS[modelId];
  return model?.pricing || DEFAULT_PRICING.o200k_base;
}

// Get all model IDs
export function getAllModelIds(): string[] {
  return Object.keys(MODELS);
}

// Get models by encoding type
export function getModelsByEncoding(encoding: EncodingType): ModelData[] {
  return Object.values(MODELS).filter((model) => model.encoding === encoding);
}

// Type exports
export type ModelId = keyof typeof MODELS;
