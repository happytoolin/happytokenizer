// Minimal tokenizer wrapper for Cloudflare Workers
// This file loads only the essential parts to avoid circular dependencies

// Cache the module to avoid repeated imports
let cachedTokenizer: any = null;
let tokenizerLoadPromise: Promise<any> | null = null;

export const getTokenizer = async () => {
  // Return cached version if available
  if (cachedTokenizer) {
    return cachedTokenizer;
  }

  // Return existing promise if already loading
  if (tokenizerLoadPromise) {
    return await tokenizerLoadPromise;
  }

  // Create new load promise
  tokenizerLoadPromise = (async () => {
    try {
      console.log("Attempting to load gpt-tokenizer...");

      // Try to import the module
      let module;
      try {
        module = await import("gpt-tokenizer");
        console.log("Successfully imported gpt-tokenizer");
      } catch (importError) {
        console.error("Failed to import gpt-tokenizer:", importError);

        // Try importing specific encoding modules as fallback
        try {
          const o200kBase = await import("gpt-tokenizer/encoding/o200k_base");
          console.log("Successfully imported o200k_base encoding directly");
          return {
            encode: o200kBase.encode,
            decode: o200kBase.decode,
            encodeChat: () => [],
          };
        } catch (fallbackError) {
          console.error("Fallback import also failed:", fallbackError);
          throw new Error(
            `Failed to load gpt-tokenizer: ${importError.message}`,
          );
        }
      }

      // Handle both default and named exports
      const tokenizer = module.default || module;

      if (!tokenizer || typeof tokenizer.encode !== "function") {
        throw new Error("gpt-tokenizer module does not have encode function");
      }

      const tokenizerInterface = {
        encode: tokenizer.encode,
        decode: tokenizer.decode || ((tokens: number[]) => tokens.join("")), // Fallback decode
        encodeChat: tokenizer.encodeChat || (() => []),
      };

      // Cache the result
      cachedTokenizer = tokenizerInterface;
      return tokenizerInterface;
    } catch (error) {
      console.error("Failed to load tokenizer:", error);
      throw error;
    }
  })();

  return await tokenizerLoadPromise;
};

// Cache for individual encodings
const encodingCache = new Map<string, any>();

// Individual encoding loaders
export const loadCl100k = async () => {
  if (encodingCache.has("cl100k_base")) {
    return encodingCache.get("cl100k_base");
  }
  const mod = await import("gpt-tokenizer/encoding/cl100k_base");
  const encoding = { encode: mod.encode, decode: mod.decode };
  encodingCache.set("cl100k_base", encoding);
  return encoding;
};

export const loadP50kBase = async () => {
  if (encodingCache.has("p50k_base")) {
    return encodingCache.get("p50k_base");
  }
  const mod = await import("gpt-tokenizer/encoding/p50k_base");
  const encoding = { encode: mod.encode, decode: mod.decode };
  encodingCache.set("p50k_base", encoding);
  return encoding;
};

export const loadP50kEdit = async () => {
  if (encodingCache.has("p50k_edit")) {
    return encodingCache.get("p50k_edit");
  }
  const mod = await import("gpt-tokenizer/encoding/p50k_edit");
  const encoding = { encode: mod.encode, decode: mod.decode };
  encodingCache.set("p50k_edit", encoding);
  return encoding;
};

export const loadR50kBase = async () => {
  if (encodingCache.has("r50k_base")) {
    return encodingCache.get("r50k_base");
  }
  const mod = await import("gpt-tokenizer/encoding/r50k_base");
  const encoding = { encode: mod.encode, decode: mod.decode };
  encodingCache.set("r50k_base", encoding);
  return encoding;
};
