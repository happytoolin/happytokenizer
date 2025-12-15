import {
  MODELS,
  getContextWindow as getModelContextWindow,
  getPricing as getModelPricing,
  type ModelPricing,
} from "./models";

export type { ModelPricing as PricingInfo };

export function getContextWindowLimit(modelName: string): number {
  return getModelContextWindow(modelName);
}

export function getDefaultContextLimit(encodingType: string): number {
  const model = Object.values(MODELS).find((m) => m.encoding === encodingType);
  return model?.contextWindow || 128000;
}

export function getPricing(modelName: string) {
  return getModelPricing(modelName);
}
