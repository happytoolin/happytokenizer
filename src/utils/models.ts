// Centralized model definitions with all associated data

// Model data interfaces
export interface ModelPricing {
  input: number;    // USD per 1K input tokens
  output: number;   // USD per 1K output tokens
  cached: number;   // USD per 1K cached tokens
}

export interface ModelData {
  id: string;                    // Model identifier
  displayName: string;           // Human-readable display name
  encoding: EncodingType;        // Token encoding type
  contextWindow: number;         // Context window limit
  pricing: ModelPricing;         // API pricing information
}

export type EncodingType = "o200k_base" | "cl100k_base" | "p50k_base" | "p50k_edit" | "r50k_base" | "o200k_harmony";

// Default pricing by encoding type
const DEFAULT_PRICING: Record<EncodingType, ModelPricing> = {
  o200k_base: { input: 0.005, output: 0.015, cached: 0.0025 },
  cl100k_base: { input: 0.01, output: 0.03, cached: 0.005 },
  p50k_base: { input: 0.002, output: 0.002, cached: 0.001 },
  p50k_edit: { input: 0.002, output: 0.002, cached: 0.001 },
  r50k_base: { input: 0.002, output: 0.002, cached: 0.001 },
  o200k_harmony: { input: 0.005, output: 0.015, cached: 0.0025 },
};

// Default context limits by encoding type
const DEFAULT_CONTEXT_LIMITS: Record<EncodingType, number> = {
  o200k_base: 128000,
  cl100k_base: 8192,
  p50k_base: 2049,
  p50k_edit: 2049,
  r50k_base: 2049,
  o200k_harmony: 128000,
};

// Model registry with all data
export const MODELS: Record<string, ModelData> = {
  // GPT-5 series
  "gpt-5": {
    id: "gpt-5",
    displayName: "GPT-5",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-5-chat-latest": {
    id: "gpt-5-chat-latest",
    displayName: "GPT-5 Chat Latest",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-5-codex": {
    id: "gpt-5-codex",
    displayName: "GPT-5 Codex",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-5-mini": {
    id: "gpt-5-mini",
    displayName: "GPT-5 Mini",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-5-nano": {
    id: "gpt-5-nano",
    displayName: "GPT-5 Nano",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-5-pro": {
    id: "gpt-5-pro",
    displayName: "GPT-5 Pro",
    encoding: "o200k_base",
    contextWindow: 400000,
    pricing: DEFAULT_PRICING.o200k_base,
  },

  // GPT-4o series
  "gpt-4o": {
    id: "gpt-4o",
    displayName: "GPT-4o",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.005, output: 0.015, cached: 0.0025 },
  },
  "gpt-4o-2024-08-06": {
    id: "gpt-4o-2024-08-06",
    displayName: "GPT-4o (2024-08-06)",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0025, output: 0.01, cached: 0.00125 },
  },
  "gpt-4o-2024-11-20": {
    id: "gpt-4o-2024-11-20",
    displayName: "GPT-4o (2024-11-20)",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.0025, output: 0.01, cached: 0.00125 },
  },
  "gpt-4o-audio-preview": {
    id: "gpt-4o-audio-preview",
    displayName: "GPT-4o Audio Preview",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-4o-mini": {
    id: "gpt-4o-mini",
    displayName: "GPT-4o Mini",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.00015, output: 0.0006, cached: 0.000075 },
  },
  "gpt-4o-mini-2024-07-18": {
    id: "gpt-4o-mini-2024-07-18",
    displayName: "GPT-4o Mini (2024-07-18)",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.00015, output: 0.0006, cached: 0.000075 },
  },
  "gpt-4o-mini-audio-preview": {
    id: "gpt-4o-mini-audio-preview",
    displayName: "GPT-4o Mini Audio Preview",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-4o-mini-realtime-preview": {
    id: "gpt-4o-mini-realtime-preview",
    displayName: "GPT-4o Mini Realtime Preview",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-4o-mini-search-preview": {
    id: "gpt-4o-mini-search-preview",
    displayName: "GPT-4o Mini Search Preview",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-4o-mini-search-preview-2025-03-11": {
    id: "gpt-4o-mini-search-preview-2025-03-11",
    displayName: "GPT-4o Mini Search Preview (2025-03-11)",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-4o-mini-transcribe": {
    id: "gpt-4o-mini-transcribe",
    displayName: "GPT-4o Mini Transcribe",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-4o-mini-tts": {
    id: "gpt-4o-mini-tts",
    displayName: "GPT-4o Mini TTS",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-4o-realtime-preview": {
    id: "gpt-4o-realtime-preview",
    displayName: "GPT-4o Realtime Preview",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-4o-realtime-preview-2024-10-01": {
    id: "gpt-4o-realtime-preview-2024-10-01",
    displayName: "GPT-4o Realtime Preview (2024-10-01)",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-4o-realtime-preview-2024-12-17": {
    id: "gpt-4o-realtime-preview-2024-12-17",
    displayName: "GPT-4o Realtime Preview (2024-12-17)",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-4o-realtime-preview-2025-06-03": {
    id: "gpt-4o-realtime-preview-2025-06-03",
    displayName: "GPT-4o Realtime Preview (2025-06-03)",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-4o-search-preview": {
    id: "gpt-4o-search-preview",
    displayName: "GPT-4o Search Preview",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-4o-search-preview-2025-03-11": {
    id: "gpt-4o-search-preview-2025-03-11",
    displayName: "GPT-4o Search Preview (2025-03-11)",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-4o-transcribe": {
    id: "gpt-4o-transcribe",
    displayName: "GPT-4o Transcribe",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },

  // O1 series
  o1: {
    id: "o1",
    displayName: "O1",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.015, output: 0.06, cached: 0.0075 },
  },
  "o1-2024-12-17": {
    id: "o1-2024-12-17",
    displayName: "O1 (2024-12-17)",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.015, output: 0.06, cached: 0.0075 },
  },
  "o1-mini": {
    id: "o1-mini",
    displayName: "O1 Mini",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.003, output: 0.012, cached: 0.0015 },
  },
  "o1-mini-2024-09-12": {
    id: "o1-mini-2024-09-12",
    displayName: "O1 Mini (2024-09-12)",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.003, output: 0.012, cached: 0.0015 },
  },
  "o1-preview": {
    id: "o1-preview",
    displayName: "O1 Preview",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.015, output: 0.06, cached: 0.0075 },
  },
  "o1-preview-2024-09-12": {
    id: "o1-preview-2024-09-12",
    displayName: "O1 Preview (2024-09-12)",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.015, output: 0.06, cached: 0.0075 },
  },
  "o1-pro": {
    id: "o1-pro",
    displayName: "O1 Pro",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.015, output: 0.06, cached: 0.0075 },
  },
  "o1-pro-2025-03-19": {
    id: "o1-pro-2025-03-19",
    displayName: "O1 Pro (2025-03-19)",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: { input: 0.015, output: 0.06, cached: 0.0075 },
  },

  // O3 series
  o3: {
    id: "o3",
    displayName: "O3",
    encoding: "o200k_base",
    contextWindow: 200000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "o3-2024-04-16": {
    id: "o3-2024-04-16",
    displayName: "O3 (2024-04-16)",
    encoding: "o200k_base",
    contextWindow: 200000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "o3-deep-research": {
    id: "o3-deep-research",
    displayName: "O3 Deep Research",
    encoding: "o200k_base",
    contextWindow: 200000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "o3-deep-research-2025-06-26": {
    id: "o3-deep-research-2025-06-26",
    displayName: "O3 Deep Research (2025-06-26)",
    encoding: "o200k_base",
    contextWindow: 200000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "o3-mini": {
    id: "o3-mini",
    displayName: "O3 Mini",
    encoding: "o200k_base",
    contextWindow: 200000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "o3-mini-2025-01-31": {
    id: "o3-mini-2025-01-31",
    displayName: "O3 Mini (2025-01-31)",
    encoding: "o200k_base",
    contextWindow: 200000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "o3-pro": {
    id: "o3-pro",
    displayName: "O3 Pro",
    encoding: "o200k_base",
    contextWindow: 200000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "o3-pro-2025-06-10": {
    id: "o3-pro-2025-06-10",
    displayName: "O3 Pro (2025-06-10)",
    encoding: "o200k_base",
    contextWindow: 200000,
    pricing: DEFAULT_PRICING.o200k_base,
  },

  // O4 series
  "o4-mini": {
    id: "o4-mini",
    displayName: "O4 Mini",
    encoding: "o200k_base",
    contextWindow: 200000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "o4-mini-2025-04-16": {
    id: "o4-mini-2025-04-16",
    displayName: "O4 Mini (2025-04-16)",
    encoding: "o200k_base",
    contextWindow: 200000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "o4-mini-deep-research": {
    id: "o4-mini-deep-research",
    displayName: "O4 Mini Deep Research",
    encoding: "o200k_base",
    contextWindow: 200000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "o4-mini-deep-research-2025-06-26": {
    id: "o4-mini-deep-research-2025-06-26",
    displayName: "O4 Mini Deep Research (2025-06-26)",
    encoding: "o200k_base",
    contextWindow: 200000,
    pricing: DEFAULT_PRICING.o200k_base,
  },

  // Legacy GPT-4 series
  "gpt-4": {
    id: "gpt-4",
    displayName: "GPT-4",
    encoding: "cl100k_base",
    contextWindow: 8192,
    pricing: { input: 0.03, output: 0.06, cached: 0.015 },
  },
  "gpt-4-0314": {
    id: "gpt-4-0314",
    displayName: "GPT-4 (0314)",
    encoding: "cl100k_base",
    contextWindow: 8192,
    pricing: { input: 0.03, output: 0.06, cached: 0.015 },
  },
  "gpt-4-0613": {
    id: "gpt-4-0613",
    displayName: "GPT-4 (0613)",
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
  "gpt-4-turbo-2024-04-09": {
    id: "gpt-4-turbo-2024-04-09",
    displayName: "GPT-4 Turbo (2024-04-09)",
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
  "gpt-4-1106-preview": {
    id: "gpt-4-1106-preview",
    displayName: "GPT-4 1106 Preview",
    encoding: "cl100k_base",
    contextWindow: 128000,
    pricing: { input: 0.01, output: 0.03, cached: 0.005 },
  },
  "gpt-4-0125-preview": {
    id: "gpt-4-0125-preview",
    displayName: "GPT-4 0125 Preview",
    encoding: "cl100k_base",
    contextWindow: 128000,
    pricing: { input: 0.01, output: 0.03, cached: 0.005 },
  },

  // GPT-3.5 series
  "gpt-3.5": {
    id: "gpt-3.5",
    displayName: "GPT-3.5",
    encoding: "cl100k_base",
    contextWindow: 4096,
    pricing: { input: 0.0015, output: 0.002, cached: 0.00075 },
  },
  "gpt-3.5-turbo": {
    id: "gpt-3.5-turbo",
    displayName: "GPT-3.5 Turbo",
    encoding: "cl100k_base",
    contextWindow: 4096,
    pricing: { input: 0.0015, output: 0.002, cached: 0.00075 },
  },
  "gpt-3.5-turbo-instruct": {
    id: "gpt-3.5-turbo-instruct",
    displayName: "GPT-3.5 Turbo Instruct",
    encoding: "cl100k_base",
    contextWindow: 4096,
    pricing: { input: 0.0015, output: 0.002, cached: 0.00075 },
  },
  "gpt-3.5-turbo-0125": {
    id: "gpt-3.5-turbo-0125",
    displayName: "GPT-3.5 Turbo (0125)",
    encoding: "cl100k_base",
    contextWindow: 16385,
    pricing: { input: 0.0005, output: 0.0015, cached: 0.00025 },
  },
  "gpt-3.5-turbo-0613": {
    id: "gpt-3.5-turbo-0613",
    displayName: "GPT-3.5 Turbo (0613)",
    encoding: "cl100k_base",
    contextWindow: 4096,
    pricing: { input: 0.0015, output: 0.002, cached: 0.00075 },
  },
  "gpt-3.5-turbo-1106": {
    id: "gpt-3.5-turbo-1106",
    displayName: "GPT-3.5 Turbo (1106)",
    encoding: "cl100k_base",
    contextWindow: 16385,
    pricing: { input: 0.001, output: 0.002, cached: 0.0005 },
  },
  "gpt-3.5-turbo-16k-0613": {
    id: "gpt-3.5-turbo-16k-0613",
    displayName: "GPT-3.5 Turbo 16K (0613)",
    encoding: "cl100k_base",
    contextWindow: 16385,
    pricing: { input: 0.003, output: 0.004, cached: 0.0015 },
  },

  // Specialized models
  "chatgpt-4o-latest": {
    id: "chatgpt-4o-latest",
    displayName: "ChatGPT-4o Latest",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "codex-mini-latest": {
    id: "codex-mini-latest",
    displayName: "Codex Mini Latest",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "computer-use-preview": {
    id: "computer-use-preview",
    displayName: "Computer Use Preview",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "dall-e-2": {
    id: "dall-e-2",
    displayName: "DALL-E 2",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "dall-e-3": {
    id: "dall-e-3",
    displayName: "DALL-E 3",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-audio": {
    id: "gpt-audio",
    displayName: "GPT Audio",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-audio-mini": {
    id: "gpt-audio-mini",
    displayName: "GPT Audio Mini",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-image-1": {
    id: "gpt-image-1",
    displayName: "GPT Image 1",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-image-1-mini": {
    id: "gpt-image-1-mini",
    displayName: "GPT Image 1 Mini",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-realtime": {
    id: "gpt-realtime",
    displayName: "GPT Realtime",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "gpt-realtime-mini": {
    id: "gpt-realtime-mini",
    displayName: "GPT Realtime Mini",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "omni-moderation-latest": {
    id: "omni-moderation-latest",
    displayName: "Omni Moderation Latest",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "sora-2": {
    id: "sora-2",
    displayName: "Sora 2",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "sora-2-pro": {
    id: "sora-2-pro",
    displayName: "Sora 2 Pro",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "tts-1": {
    id: "tts-1",
    displayName: "TTS-1",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "tts-1-hd": {
    id: "tts-1-hd",
    displayName: "TTS-1 HD",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "whisper-1": {
    id: "whisper-1",
    displayName: "Whisper 1",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },

  // Embedding models
  "text-embedding-3-large": {
    id: "text-embedding-3-large",
    displayName: "Text Embedding 3 Large",
    encoding: "cl100k_base",
    contextWindow: 8192,
    pricing: DEFAULT_PRICING.cl100k_base,
  },
  "text-embedding-3-small": {
    id: "text-embedding-3-small",
    displayName: "Text Embedding 3 Small",
    encoding: "cl100k_base",
    contextWindow: 8192,
    pricing: DEFAULT_PRICING.cl100k_base,
  },
  "text-embedding-ada-002": {
    id: "text-embedding-ada-002",
    displayName: "Text Embedding Ada 002",
    encoding: "cl100k_base",
    contextWindow: 8192,
    pricing: DEFAULT_PRICING.cl100k_base,
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
    pricing: DEFAULT_PRICING.cl100k_base,
  },
  "davinci-002": {
    id: "davinci-002",
    displayName: "Davinci 002",
    encoding: "cl100k_base",
    contextWindow: 8192,
    pricing: DEFAULT_PRICING.cl100k_base,
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
    pricing: DEFAULT_PRICING.cl100k_base,
  },
  "text-moderation-latest": {
    id: "text-moderation-latest",
    displayName: "Text Moderation Latest",
    encoding: "o200k_base",
    contextWindow: 128000,
    pricing: DEFAULT_PRICING.o200k_base,
  },
  "text-moderation-stable": {
    id: "text-moderation-stable",
    displayName: "Text Moderation Stable",
    encoding: "cl100k_base",
    contextWindow: 8192,
    pricing: DEFAULT_PRICING.cl100k_base,
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
  return Object.values(MODELS).filter(model => model.encoding === encoding);
}

// Type exports
export type ModelId = keyof typeof MODELS;