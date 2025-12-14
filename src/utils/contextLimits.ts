import { getEncodingForModel } from "./modelEncodings";

// Context window limits for various models
export const CONTEXT_WINDOW_LIMITS = {
  // GPT-4o and o200k_base models
  "gpt-4o": 128000,
  "gpt-4o-2024-05-13": 128000,
  "gpt-4o-2024-08-06": 128000,
  "gpt-4o-2024-11-20": 128000,
  "gpt-4o-audio-preview": 128000,
  "gpt-4o-audio-preview-2024-10-01": 128000,
  "gpt-4o-audio-preview-2024-12-17": 128000,
  "gpt-4o-audio-preview-2025-06-03": 128000,
  "gpt-4o-mini": 128000,
  "gpt-4o-mini-2024-07-18": 128000,
  "gpt-4o-mini-audio-preview": 128000,
  "gpt-4o-mini-audio-preview-2024-12-17": 128000,
  "gpt-4o-mini-realtime-preview": 128000,
  "gpt-4o-mini-realtime-preview-2024-12-17": 128000,
  "gpt-4o-mini-search-preview": 128000,
  "gpt-4o-mini-search-preview-2025-03-11": 128000,
  "gpt-4o-mini-transcribe": 128000,
  "gpt-4o-mini-tts": 128000,
  "gpt-4o-realtime-preview": 128000,
  "gpt-4o-realtime-preview-2024-10-01": 128000,
  "gpt-4o-realtime-preview-2024-12-17": 128000,
  "gpt-4o-realtime-preview-2025-06-03": 128000,
  "gpt-4o-search-preview": 128000,
  "gpt-4o-search-preview-2025-03-11": 128000,
  "gpt-4o-transcribe": 128000,
  "chatgpt-4o-latest": 128000,
  o1: 128000,
  "o1-2024-12-17": 128000,
  "o1-mini": 128000,
  "o1-mini-2024-09-12": 128000,
  "o1-preview": 128000,
  "o1-preview-2024-09-12": 128000,
  "o1-pro": 128000,
  "o1-pro-2025-03-19": 128000,
  o3: 200000,
  "o3-2025-04-16": 200000,
  "o3-deep-research": 200000,
  "o3-deep-research-2025-06-26": 200000,
  "o3-mini": 200000,
  "o3-mini-2025-01-31": 200000,
  "o3-pro": 200000,
  "o3-pro-2025-06-10": 200000,
  "o4-mini": 200000,
  "o4-mini-2025-04-16": 200000,
  "o4-mini-deep-research": 200000,
  "o4-mini-deep-research-2025-06-26": 200000,

  // GPT-5 models
  "gpt-5": 200000,
  "gpt-5-2025-08-07": 200000,
  "gpt-5-chat-latest": 200000,
  "gpt-5-codex": 200000,
  "gpt-5-mini": 200000,
  "gpt-5-mini-2025-08-07": 200000,
  "gpt-5-nano": 200000,
  "gpt-5-nano-2025-08-07": 200000,
  "gpt-5-pro": 200000,
  "gpt-5-pro-2025-10-06": 200000,

  // GPT-4 and cl100k_base models
  "gpt-4": 8192,
  "gpt-4-0314": 8192,
  "gpt-4-0613": 8192,
  "gpt-4-32k": 32768,
  "gpt-4-turbo": 128000,
  "gpt-4-turbo-2024-04-09": 128000,
  "gpt-4-turbo-preview": 128000,
  "gpt-4-1106-preview": 128000,
  "gpt-4-0125-preview": 128000,
  "gpt-4-1106-vision-preview": 128000,
  "gpt-3.5-turbo": 4096,
  "gpt-3.5-turbo-0125": 16385,
  "gpt-3.5-turbo-0613": 4096,
  "gpt-3.5-turbo-1106": 16385,
  "gpt-3.5-turbo-16k-0613": 16385,
  "gpt-3.5": 4096,
  "gpt-3.5-0301": 4096,

  // Legacy models
  davinci: 2049,
  curie: 2049,
  babbage: 2049,
  ada: 2049,
  "text-davinci-001": 2049,
  "text-davinci-002": 4097,
  "text-davinci-003": 4097,
  "code-davinci-001": 8001,
  "code-davinci-002": 8001,
  "code-cushman-001": 2048,
  "code-cushman-002": 2048,

  // Default limits for models not in the list
  default: {
    o200k_base: 128000,
    cl100k_base: 8192,
    p50k_base: 2049,
    p50k_edit: 2049,
    r50k_base: 2049,
    o200k_harmony: 128000,
  },
} as const;

// Pricing information (USD per 1K tokens)
export const PRICING = {
  // GPT-4o pricing
  "gpt-4o": { input: 0.005, output: 0.015, cached: 0.0025 },
  "gpt-4o-2024-05-13": { input: 0.005, output: 0.015, cached: 0.0025 },
  "gpt-4o-2024-08-06": { input: 0.0025, output: 0.01, cached: 0.00125 },
  "gpt-4o-2024-11-20": { input: 0.0025, output: 0.01, cached: 0.00125 },

  // GPT-4o Mini pricing
  "gpt-4o-mini": { input: 0.00015, output: 0.0006, cached: 0.000075 },
  "gpt-4o-mini-2024-07-18": {
    input: 0.00015,
    output: 0.0006,
    cached: 0.000075,
  },

  // GPT-4 pricing
  "gpt-4": { input: 0.03, output: 0.06, cached: 0.015 },
  "gpt-4-32k": { input: 0.06, output: 0.12, cached: 0.03 },
  "gpt-4-turbo": { input: 0.01, output: 0.03, cached: 0.005 },
  "gpt-4-turbo-preview": { input: 0.01, output: 0.03, cached: 0.005 },
  "gpt-4-1106-preview": { input: 0.01, output: 0.03, cached: 0.005 },
  "gpt-4-0125-preview": { input: 0.01, output: 0.03, cached: 0.005 },

  // GPT-3.5 Turbo pricing
  "gpt-3.5-turbo": { input: 0.0015, output: 0.002, cached: 0.00075 },
  "gpt-3.5-turbo-0125": { input: 0.0005, output: 0.0015, cached: 0.00025 },
  "gpt-3.5-turbo-1106": { input: 0.001, output: 0.002, cached: 0.0005 },
  "gpt-3.5-turbo-16k-0613": { input: 0.003, output: 0.004, cached: 0.0015 },

  // O1 pricing
  o1: { input: 0.015, output: 0.06, cached: 0.0075 },
  "o1-preview": { input: 0.015, output: 0.06, cached: 0.0075 },
  "o1-mini": { input: 0.003, output: 0.012, cached: 0.0015 },

  // Default pricing by encoding type
  default: {
    o200k_base: { input: 0.005, output: 0.015, cached: 0.0025 },
    cl100k_base: { input: 0.01, output: 0.03, cached: 0.005 },
    p50k_base: { input: 0.002, output: 0.002, cached: 0.001 },
    p50k_edit: { input: 0.002, output: 0.002, cached: 0.001 },
    r50k_base: { input: 0.002, output: 0.002, cached: 0.001 },
    o200k_harmony: { input: 0.005, output: 0.015, cached: 0.0025 },
  },
} as const;

// Type definitions
export interface PricingInfo {
  input: number;
  output: number;
  cached: number;
}

// Helper functions
export function getContextWindowLimit(modelName: string): number {
  const limit =
    CONTEXT_WINDOW_LIMITS[modelName as keyof typeof CONTEXT_WINDOW_LIMITS];

  // Handle the case where limit might be an object (for default)
  if (typeof limit === "number") {
    return limit;
  }

  return getDefaultContextLimit(getEncodingForModel(modelName));
}

export function getDefaultContextLimit(encodingType: string): number {
  return (
    CONTEXT_WINDOW_LIMITS.default[
      encodingType as keyof typeof CONTEXT_WINDOW_LIMITS.default
    ] || 4096
  );
}

export function getPricing(modelName: string): PricingInfo {
  const directPricing = PRICING[modelName as keyof typeof PRICING];

  // Check if direct pricing exists and is a PricingInfo object
  if (
    directPricing &&
    typeof directPricing === "object" &&
    "input" in directPricing
  ) {
    return directPricing as PricingInfo;
  }

  // Fall back to default pricing by encoding type
  const encodingType = getEncodingForModel(modelName);
  const defaultPricing =
    PRICING.default[encodingType as keyof typeof PRICING.default];

  if (defaultPricing) {
    return defaultPricing as PricingInfo;
  }

  // Final fallback
  return PRICING.default.o200k_base as PricingInfo;
}
