// Context window and pricing data derived from centralized models
import {
  MODELS,
  getContextWindow as getModelContextWindow,
  getPricing as getModelPricing,
  type ModelPricing,
} from "./models";

// Re-export pricing type for backward compatibility
export type { ModelPricing as PricingInfo };

// Helper functions - now using centralized model data
export function getContextWindowLimit(modelName: string): number {
  return getModelContextWindow(modelName);
}

export function getDefaultContextLimit(encodingType: string): number {
  // Find a model with this encoding type to get its context limit
  const model = Object.values(MODELS).find((m) => m.encoding === encodingType);
  return model?.contextWindow || 128000; // Default fallback
}

export function getPricing(modelName: string) {
  return getModelPricing(modelName);
}
