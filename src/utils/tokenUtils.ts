import { getContextWindowLimit, getPricing } from "./contextLimits";
import { getGptTokenizerEstimateCost } from "./gptTokenizerModels";

// Types
export interface PricingInfo {
  input: number;
  output: number;
  cached: number;
}

// Check if text is within token limit
export function isWithinTokenLimit(tokenCount: number, limit: number): boolean {
  return tokenCount <= limit;
}

// Get percentage of context window used
export function getContextUsagePercentage(
  tokenCount: number,
  limit: number,
): number {
  return Math.min((tokenCount / limit) * 100, 100);
}

// Get status for current model limit
export function getModelLimitStatus(tokenCount: number, modelName: string) {
  const limit = getContextWindowLimit(modelName);
  return {
    limit,
    within: isWithinTokenLimit(tokenCount, limit),
    percentage: getContextUsagePercentage(tokenCount, limit),
    remaining: Math.max(limit - tokenCount, 0),
  };
}

// Estimate costs based on token count and model
export interface CostEstimate {
  input: number;
  output: number;
  cached: number;
  totalInput: number;
  totalOutput: number;
  totalCached: number;
}

export function estimateCost(
  tokenCount: number,
  modelName: string,
  options: {
    outputTokenCount?: number;
    cacheHitRate?: number; // 0-1, percentage of tokens that might be cached
  } = {},
): CostEstimate {
  const { outputTokenCount = tokenCount, cacheHitRate = 0 } = options;

  // Try to use gpt-tokenizer's estimateCost if the model is supported
  const gptTokenizerEstimateCost = getGptTokenizerEstimateCost(modelName);

  if (gptTokenizerEstimateCost) {
    try {
      const priceData = gptTokenizerEstimateCost(tokenCount);

      // gpt-tokenizer returns pricing per million tokens
      if (priceData?.main) {
        const pricingPerMillion = priceData.main;
        // Convert to per 1K tokens for our internal use
        const inputPricing = (pricingPerMillion.input || 0) / 1000;
        const outputPricing = (pricingPerMillion.output || 0) / 1000;
        const cachedInputPricing = (pricingPerMillion.cached_input || 0) / 1000;
        const cachedOutputPricing =
          (pricingPerMillion.cached_output || 0) / 1000;

        const inputCost = (tokenCount / 1000) * inputPricing;
        const outputCost = (outputTokenCount / 1000) * outputPricing;
        const cachedCost =
          ((tokenCount * cacheHitRate) / 1000) * cachedInputPricing;

        return {
          input: inputPricing,
          output: outputPricing,
          cached: cachedInputPricing, // Use cached_input for cached tokens
          totalInput: inputCost,
          totalOutput: outputCost,
          totalCached: cachedCost,
        };
      }
    } catch (error) {
      // If gpt-tokenizer fails, fall back to hardcoded pricing
    }
  }

  // Fallback to our hardcoded pricing
  const pricing = getPricing(modelName);
  const inputCost = (tokenCount / 1000) * pricing.input;
  const outputCost = (outputTokenCount / 1000) * pricing.output;
  const cachedCost = ((tokenCount * cacheHitRate) / 1000) * pricing.cached;

  return {
    input: pricing.input,
    output: pricing.output,
    cached: pricing.cached,
    totalInput: inputCost,
    totalOutput: outputCost,
    totalCached: cachedCost,
  };
}

// Format percentage with appropriate color coding
export function getUsageStatusColor(percentage: number): string {
  if (percentage >= 95) return "#dc2626"; // red-600
  if (percentage >= 80) return "#ea580c"; // orange-600
  if (percentage >= 60) return "#f59e0b"; // amber-500
  return "#16a34a"; // green-600
}

// Get warning level based on usage
export function getWarningLevel(
  percentage: number,
): "none" | "warning" | "critical" {
  if (percentage >= 95) return "critical";
  if (percentage >= 80) return "warning";
  return "none";
}
