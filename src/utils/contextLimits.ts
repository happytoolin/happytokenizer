import {
  MODELS,
  getPricing as getModelPricing,
  type ModelPricing,
} from "./models";
import { NON_GPT_MODELS } from "./nonGptModels";

export type { ModelPricing as PricingInfo };

export function getContextWindowLimit(modelName: string): number {
  // Check GPT models first
  const gptModel = MODELS[modelName];
  if (gptModel) {
    return gptModel.contextWindow;
  }

  // Check non-GPT models
  const nonGptModel = NON_GPT_MODELS[modelName];
  if (nonGptModel) {
    return nonGptModel.contextWindow;
  }

  // Default fallback
  return 128000;
}

export function getDefaultContextLimit(encodingType: string): number {
  const model = Object.values(MODELS).find((m) => m.encoding === encodingType);
  return model?.contextWindow || 128000;
}

export function getPricing(modelName: string): ModelPricing {
  // Check GPT models first
  const gptPricing = getModelPricing(modelName);
  if (gptPricing) {
    return gptPricing;
  }

  // Check non-GPT models
  const nonGptModel = NON_GPT_MODELS[modelName];
  if (nonGptModel) {
    return nonGptModel.pricing;
  }

  // Default fallback
  return { input: 0.0025, output: 0.01, cached: 0.00125 };
}
