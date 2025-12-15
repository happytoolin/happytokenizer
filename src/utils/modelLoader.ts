// Lazy loader for models data to reduce startup overhead
// This file provides async access to the large models dataset

import { type EncodingType, type ModelData } from "./models";

// Dynamic import for models data
let modelsPromise: Promise<typeof import("./models")> | null = null;

function getModels() {
  if (!modelsPromise) {
    modelsPromise = import("./models");
  }
  return modelsPromise;
}

// Async functions to access models data
export async function getModelById(id: string): Promise<ModelData | undefined> {
  const { MODELS } = await getModels();
  return MODELS[id];
}

export async function getModelsByEncoding(
  encoding: EncodingType,
): Promise<ModelData[]> {
  const { getModelsByEncoding: getModelsByEncodingSync } = await getModels();
  return getModelsByEncodingSync(encoding);
}

export async function getModelDisplayName(id: string): Promise<string> {
  const { getModelDisplayName } = await getModels();
  return getModelDisplayName(id);
}

export async function getModelPricing(
  id: string,
): Promise<{ input: number; output: number; cached: number } | undefined> {
  const { getPricing } = await getModels();
  return getPricing(id);
}

export async function getModelContextWindow(
  id: string,
): Promise<number | undefined> {
  const { getContextWindow } = await getModels();
  return getContextWindow(id);
}

// Synchronous fallback for critical paths (use sparingly)
export function getModelSync(id: string): ModelData | undefined {
  // This will throw if called before the module is loaded
  // Only use this when you know the module is already loaded
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { MODELS } = require("./models");
    return MODELS[id];
  } catch {
    return undefined;
  }
}
