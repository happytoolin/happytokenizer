export interface TokenizerModule {
  fromPreTrained?: () => any;
  encode?: (text: string) => number[];
  decode: (tokens: number[]) => string;
  apply_chat_template?: (messages: any[]) => number[];
}

export interface TokenizerConfig {
  packageName?: string;
  exportName?: string;
  encoding?: string;
  isGPT?: boolean;
}

// Mapping of model families to their tokenizer packages
export const tokenizerPackages: Record<string, TokenizerConfig> = {
  // GPT models (using existing gpt-tokenizer)
  "gpt-4o": { isGPT: true, encoding: "o200k_base" },
  "gpt-4o-mini": { isGPT: true, encoding: "o200k_base" },
  "gpt-4o-2024-11-20": { isGPT: true, encoding: "o200k_base" },
  "gpt-4o-2024-05-13": { isGPT: true, encoding: "o200k_base" },
  "gpt-4": { isGPT: true, encoding: "cl100k_base" },
  "gpt-4-turbo": { isGPT: true, encoding: "cl100k_base" },
  "gpt-4-turbo-2024-04-09": { isGPT: true, encoding: "cl100k_base" },
  "gpt-4-turbo-preview": { isGPT: true, encoding: "cl100k_base" },
  "gpt-4-1106-preview": { isGPT: true, encoding: "cl100k_base" },
  "gpt-4-32k": { isGPT: true, encoding: "cl100k_base" },
  "gpt-3.5-turbo": { isGPT: true, encoding: "cl100k_base" },
  "gpt-3.5-turbo-0125": { isGPT: true, encoding: "cl100k_base" },
  "gpt-3.5-turbo-1106": { isGPT: true, encoding: "cl100k_base" },
  "gpt-3.5-turbo-16k": { isGPT: true, encoding: "cl100k_base" },
  "gpt-3": { isGPT: true, encoding: "p50k_base" },
  "gpt-3.5": { isGPT: true, encoding: "p50k_base" },
  "text-davinci-003": { isGPT: true, encoding: "p50k_base" },
  "text-davinci-002": { isGPT: true, encoding: "p50k_base" },
  "text-davinci-001": { isGPT: true, encoding: "r50k_base" },
  "text-curie-001": { isGPT: true, encoding: "r50k_base" },
  "text-babbage-001": { isGPT: true, encoding: "r50k_base" },
  "text-ada-001": { isGPT: true, encoding: "r50k_base" },
  "text-embedding-ada-002": { isGPT: true, encoding: "cl100k_base" },
  "text-embedding-3-small": { isGPT: true, encoding: "cl100k_base" },
  "text-embedding-3-large": { isGPT: true, encoding: "cl100k_base" },
  "text-moderation-latest": { isGPT: true, encoding: "cl100k_base" },
  "text-moderation-stable": { isGPT: true, encoding: "cl100k_base" },

  // GPT models with dedicated tokenizer packages
  "gpt-4o-specialized": {
    packageName: "@lenml/tokenizer-gpt4o",
    exportName: "fromPreTrained",
  },
  "gpt-4-specialized": {
    packageName: "@lenml/tokenizer-gpt4",
    exportName: "fromPreTrained",
  },
  "gpt-3.5-turbo-specialized": {
    packageName: "@lenml/tokenizer-gpt35turbo",
    exportName: "fromPreTrained",
  },
  "gpt-3.5-turbo-16k-specialized": {
    packageName: "@lenml/tokenizer-gpt35turbo16k",
    exportName: "fromPreTrained",
  },
  "gpt-3-specialized": {
    packageName: "@lenml/tokenizer-gpt3",
    exportName: "fromPreTrained",
  },
  "gpt2": {
    packageName: "@lenml/tokenizer-gpt2",
    exportName: "fromPreTrained",
  },
  "text-davinci-002-specialized": {
    packageName: "@lenml/tokenizer-text_davinci002",
    exportName: "fromPreTrained",
  },
  "text-davinci-003-specialized": {
    packageName: "@lenml/tokenizer-text_davinci003",
    exportName: "fromPreTrained",
  },
  "text-embedding-ada-002-specialized": {
    packageName: "@lenml/tokenizer-text_embedding_ada002",
    exportName: "fromPreTrained",
  },

  // Claude models
  "claude-3.5-sonnet": {
    packageName: "@lenml/tokenizer-claude",
    exportName: "fromPreTrained",
  },
  "claude-3.5-haiku": {
    packageName: "@lenml/tokenizer-claude",
    exportName: "fromPreTrained",
  },
  "claude-3.5-opus": {
    packageName: "@lenml/tokenizer-claude",
    exportName: "fromPreTrained",
  },
  "claude-3-opus": {
    packageName: "@lenml/tokenizer-claude",
    exportName: "fromPreTrained",
  },
  "claude-3-sonnet": {
    packageName: "@lenml/tokenizer-claude",
    exportName: "fromPreTrained",
  },
  "claude-3-haiku": {
    packageName: "@lenml/tokenizer-claude",
    exportName: "fromPreTrained",
  },
  "claude-2.1": {
    packageName: "@lenml/tokenizer-claude",
    exportName: "fromPreTrained",
  },
  "claude-2": {
    packageName: "@lenml/tokenizer-claude",
    exportName: "fromPreTrained",
  },
  "claude-2.5": {
    packageName: "@lenml/tokenizer-claude",
    exportName: "fromPreTrained",
  },
  "claude-1": {
    packageName: "@lenml/tokenizer-claude1",
    exportName: "fromPreTrained",
  },
  "claude-instant-1": {
    packageName: "@lenml/tokenizer-claude1",
    exportName: "fromPreTrained",
  },

  // Llama models
  "llama-3.2": {
    packageName: "@lenml/tokenizer-llama3_2",
    exportName: "fromPreTrained",
  },
  "llama-3.2-1b": {
    packageName: "@lenml/tokenizer-llama3_2",
    exportName: "fromPreTrained",
  },
  "llama-3.2-3b": {
    packageName: "@lenml/tokenizer-llama3_2",
    exportName: "fromPreTrained",
  },
  "llama-3.2-11b": {
    packageName: "@lenml/tokenizer-llama3_2",
    exportName: "fromPreTrained",
  },
  "llama-3.2-90b": {
    packageName: "@lenml/tokenizer-llama3_2",
    exportName: "fromPreTrained",
  },
  "llama-3.1": {
    packageName: "@lenml/tokenizer-llama3_1",
    exportName: "fromPreTrained",
  },
  "llama-3.1-8b": {
    packageName: "@lenml/tokenizer-llama3_1",
    exportName: "fromPreTrained",
  },
  "llama-3.1-70b": {
    packageName: "@lenml/tokenizer-llama3_1",
    exportName: "fromPreTrained",
  },
  "llama-3.1-405b": {
    packageName: "@lenml/tokenizer-llama3_1",
    exportName: "fromPreTrained",
  },
  "llama-3": {
    packageName: "@lenml/tokenizer-llama3",
    exportName: "fromPreTrained",
  },
  "llama-3-8b": {
    packageName: "@lenml/tokenizer-llama3",
    exportName: "fromPreTrained",
  },
  "llama-3-70b": {
    packageName: "@lenml/tokenizer-llama3",
    exportName: "fromPreTrained",
  },
  "llama-2": {
    packageName: "@lenml/tokenizer-llama2",
    exportName: "fromPreTrained",
  },
  "llama-2-7b": {
    packageName: "@lenml/tokenizer-llama2",
    exportName: "fromPreTrained",
  },
  "llama-2-13b": {
    packageName: "@lenml/tokenizer-llama2",
    exportName: "fromPreTrained",
  },
  "llama-2-70b": {
    packageName: "@lenml/tokenizer-llama2",
    exportName: "fromPreTrained",
  },
  // Llama 2 based models
  "mistral-7b": {
    packageName: "@lenml/tokenizer-llama2",
    exportName: "fromPreTrained",
  },
  "mistral-7b-instruct": {
    packageName: "@lenml/tokenizer-llama2",
    exportName: "fromPreTrained",
  },
  "zephyr-7b": {
    packageName: "@lenml/tokenizer-llama2",
    exportName: "fromPreTrained",
  },
  "zephyr-7b-alpha": {
    packageName: "@lenml/tokenizer-llama2",
    exportName: "fromPreTrained",
  },
  "zephyr-7b-beta": {
    packageName: "@lenml/tokenizer-llama2",
    exportName: "fromPreTrained",
  },
  "vicuna-7b": {
    packageName: "@lenml/tokenizer-llama2",
    exportName: "fromPreTrained",
  },
  "vicuna-13b": {
    packageName: "@lenml/tokenizer-llama2",
    exportName: "fromPreTrained",
  },
  "vicuna-33b": {
    packageName: "@lenml/tokenizer-llama2",
    exportName: "fromPreTrained",
  },

  // DeepSeek models
  "deepseek-v3": {
    packageName: "@lenml/tokenizer-deepseek_v3",
    exportName: "fromPreTrained",
  },
  "deepseek-r1": {
    packageName: "@lenml/tokenizer-deepseek_v3",
    exportName: "fromPreTrained",
  },

  // Qwen models
  "qwen2.5": {
    packageName: "@lenml/tokenizer-qwen2_5",
    exportName: "fromPreTrained",
  },
  "qwen2.5-0.5b": {
    packageName: "@lenml/tokenizer-qwen2_5",
    exportName: "fromPreTrained",
  },
  "qwen2.5-1.5b": {
    packageName: "@lenml/tokenizer-qwen2_5",
    exportName: "fromPreTrained",
  },
  "qwen2.5-3b": {
    packageName: "@lenml/tokenizer-qwen2_5",
    exportName: "fromPreTrained",
  },
  "qwen2.5-7b": {
    packageName: "@lenml/tokenizer-qwen2_5",
    exportName: "fromPreTrained",
  },
  "qwen2.5-14b": {
    packageName: "@lenml/tokenizer-qwen2_5",
    exportName: "fromPreTrained",
  },
  "qwen2.5-32b": {
    packageName: "@lenml/tokenizer-qwen2_5",
    exportName: "fromPreTrained",
  },
  "qwen2.5-72b": {
    packageName: "@lenml/tokenizer-qwen2_5",
    exportName: "fromPreTrained",
  },
  "qwen2.5-coder": {
    packageName: "@lenml/tokenizer-qwen2_5",
    exportName: "fromPreTrained",
  },
  "qwen1.5": {
    packageName: "@lenml/tokenizer-qwen1_5",
    exportName: "fromPreTrained",
  },
  "qwen1.5-0.5b": {
    packageName: "@lenml/tokenizer-qwen1_5",
    exportName: "fromPreTrained",
  },
  "qwen1.5-1.8b": {
    packageName: "@lenml/tokenizer-qwen1_5",
    exportName: "fromPreTrained",
  },
  "qwen1.5-4b": {
    packageName: "@lenml/tokenizer-qwen1_5",
    exportName: "fromPreTrained",
  },
  "qwen1.5-7b": {
    packageName: "@lenml/tokenizer-qwen1_5",
    exportName: "fromPreTrained",
  },
  "qwen1.5-14b": {
    packageName: "@lenml/tokenizer-qwen1_5",
    exportName: "fromPreTrained",
  },
  "qwen1.5-32b": {
    packageName: "@lenml/tokenizer-qwen1_5",
    exportName: "fromPreTrained",
  },
  "qwen1.5-72b": {
    packageName: "@lenml/tokenizer-qwen1_5",
    exportName: "fromPreTrained",
  },
  "qwen1.5-110b": {
    packageName: "@lenml/tokenizer-qwen1_5",
    exportName: "fromPreTrained",
  },
  qwen3: {
    packageName: "@lenml/tokenizer-qwen3",
    exportName: "fromPreTrained",
  },
  "qwen3-0.5b": {
    packageName: "@lenml/tokenizer-qwen3",
    exportName: "fromPreTrained",
  },
  "qwen3-1.5b": {
    packageName: "@lenml/tokenizer-qwen3",
    exportName: "fromPreTrained",
  },
  "qwen3-4b": {
    packageName: "@lenml/tokenizer-qwen3",
    exportName: "fromPreTrained",
  },
  "qwen3-7b": {
    packageName: "@lenml/tokenizer-qwen3",
    exportName: "fromPreTrained",
  },
  "qwen3-14b": {
    packageName: "@lenml/tokenizer-qwen3",
    exportName: "fromPreTrained",
  },
  "qwen3-32b": {
    packageName: "@lenml/tokenizer-qwen3",
    exportName: "fromPreTrained",
  },
  "qwen3-70b": {
    packageName: "@lenml/tokenizer-qwen3",
    exportName: "fromPreTrained",
  },

  // Gemma models
  gemma3: {
    packageName: "@lenml/tokenizer-gemma3",
    exportName: "fromPreTrained",
  },
  gemma2: {
    packageName: "@lenml/tokenizer-gemma2",
    exportName: "fromPreTrained",
  },
  gemma: {
    packageName: "@lenml/tokenizer-gemma",
    exportName: "fromPreTrained",
  },

  // Gemini models (using gemini tokenizer package)
  "gemini-1.5-pro": {
    packageName: "@lenml/tokenizer-gemini",
    exportName: "fromPreTrained",
  },
  "gemini-1.5-flash": {
    packageName: "@lenml/tokenizer-gemini",
    exportName: "fromPreTrained",
  },
  "gemini-1.5-flash-8b": {
    packageName: "@lenml/tokenizer-gemini",
    exportName: "fromPreTrained",
  },
  "gemini-1.0-pro": {
    packageName: "@lenml/tokenizer-gemini",
    exportName: "fromPreTrained",
  },
  "gemini-pro": {
    packageName: "@lenml/tokenizer-gemini",
    exportName: "fromPreTrained",
  },
  "gemini-pro-vision": {
    packageName: "@lenml/tokenizer-gemini",
    exportName: "fromPreTrained",
  },
  "gemini-nano": {
    packageName: "@lenml/tokenizer-gemini",
    exportName: "fromPreTrained",
  },

  // Other models
  "mistral-nemo": {
    packageName: "@lenml/tokenizer-mistral_nemo",
    exportName: "fromPreTrained",
  },
  "minicpm-v4.5": {
    packageName: "@lenml/tokenizer-minicpm_v4_5",
    exportName: "fromPreTrained",
  },
  "aya-expanse": {
    packageName: "@lenml/tokenizer-aya_expanse",
    exportName: "fromPreTrained",
  },
  baichuan2: {
    packageName: "@lenml/tokenizer-baichuan2",
    exportName: "fromPreTrained",
  },
  chatglm3: {
    packageName: "@lenml/tokenizer-chatglm3",
    exportName: "fromPreTrained",
  },
  "command-r-plus": {
    packageName: "@lenml/tokenizer-command_r_plus",
    exportName: "fromPreTrained",
  },
  internlm2: {
    packageName: "@lenml/tokenizer-internlm2",
    exportName: "fromPreTrained",
  },
  yi: { packageName: "@lenml/tokenizer-yi", exportName: "fromPreTrained" },
  "gpt-oss-20b": {
    packageName: "@lenml/tokenizer-gptoss",
    exportName: "fromPreTrained",
  },
  "gpt-oss-120b": {
    packageName: "@lenml/tokenizer-gptoss",
    exportName: "fromPreTrained",
  },
};

// Cache for dynamically loaded tokenizers
const tokenizerCache = new Map<string, TokenizerModule>();

export async function loadDynamicTokenizer(
  modelId: string
): Promise<TokenizerModule | null> {
  const config = tokenizerPackages[modelId];
  if (!config) {
    return null;
  }

  // Return from cache if already loaded
  if (tokenizerCache.has(modelId)) {
    return tokenizerCache.get(modelId)!;
  }

  try {
    if (config.isGPT) {
      // For GPT models, we'll handle them in the main tokenizer logic
      return null;
    }

    // Dynamically import the tokenizer package
    if (!config.packageName) {
      console.error(`No package name configured for ${modelId}`);
      return null;
    }
    const module = await import(config.packageName);

    // Get the tokenizer function
    const tokenizerFunc = module[config.exportName || "fromPreTrained"];
    if (typeof tokenizerFunc !== "function") {
      console.error(`Tokenizer function not found in ${config.packageName}`);
      return null;
    }

    // Create and cache the tokenizer
    const tokenizer = tokenizerFunc();
    tokenizerCache.set(modelId, tokenizer);

    return tokenizer;
  } catch (error) {
    console.error(`Failed to load tokenizer for ${modelId}:`, error);
    return null;
  }
}

// Helper function to determine if a model uses a specific tokenizer package
export function getTokenizerConfig(modelId: string): TokenizerConfig | null {
  return tokenizerPackages[modelId] || null;
}

// Clear the tokenizer cache (useful for testing or memory management)
export function clearTokenizerCache(): void {
  tokenizerCache.clear();
}
