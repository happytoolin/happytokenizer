let cachedTokenizer: any = null;
let tokenizerLoadPromise: Promise<any> | null = null;

export const getTokenizer = async () => {
  if (cachedTokenizer) {
    return cachedTokenizer;
  }

  if (tokenizerLoadPromise) {
    return await tokenizerLoadPromise;
  }

  tokenizerLoadPromise = (async () => {
    try {
      let module;
      try {
        module = await import("gpt-tokenizer");
      } catch (error) {
        try {
          const o200kBase = await import("gpt-tokenizer/encoding/o200k_base");
          const fallbackTokenizer = {
            encode: o200kBase.encode,
            decode: o200kBase.decode,
            encodeChat: () => [],
          };
          cachedTokenizer = fallbackTokenizer;
          return fallbackTokenizer;
        } catch (fallbackError) {
          throw new Error(
            `Failed to load gpt-tokenizer: ${fallbackError instanceof Error ? fallbackError.message : "Unknown error"}`,
          );
        }
      }

      const tokenizer = module.default || module;

      if (!tokenizer || typeof tokenizer.encode !== "function") {
        throw new Error("gpt-tokenizer module does not have encode function");
      }

      const tokenizerInterface = {
        encode: tokenizer.encode,
        decode: tokenizer.decode || ((tokens: number[]) => tokens.join("")),
        encodeChat: tokenizer.encodeChat || (() => []),
      };

      cachedTokenizer = tokenizerInterface;
      return tokenizerInterface;
    } catch (error) {
      throw new Error(
        `Failed to load gpt-tokenizer: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  })();

  return await tokenizerLoadPromise;
};

const encodingCache = new Map<string, any>();

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
