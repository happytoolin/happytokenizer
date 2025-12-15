// Note: This file is currently disabled due to gpt-tokenizer API compatibility issues.
// The library's estimateCost function returns a different structure than expected.
// We're using our own pricing data from contextLimits.ts instead.

export const GPT_TOKENIZER_MODELS: Record<string, never> = {};

export function getGptTokenizerEstimateCost(): null {
  // Always return null since we're not using gpt-tokenizer's pricing
  return null;
}
