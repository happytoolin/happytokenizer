interface BaseEncoding {
  encode: (text: string) => number[];
  decode: (tokens: number[]) => string;
}

interface Tokenizer extends BaseEncoding {
  encodeChat: (messages: unknown[], model: string) => number[];
}

interface TokenizerModule {
  default?: unknown;
  encode?: unknown;
  decode?: unknown;
  encodeChat?: unknown;
}

const isFunction = (
  candidate: unknown,
): candidate is (...args: unknown[]) => unknown => {
  return typeof candidate === "function";
};

const buildTokenizer = (candidate: unknown): Tokenizer => {
  if (typeof candidate !== "object" || candidate === null) {
    throw new Error("gpt-tokenizer module has invalid shape");
  }

  const moduleObject = candidate as TokenizerModule;

  if (!isFunction(moduleObject.encode)) {
    throw new Error("gpt-tokenizer module does not have encode function");
  }

  const encode = moduleObject.encode as (text: string) => number[];
  const decode = isFunction(moduleObject.decode)
    ? (moduleObject.decode as (tokens: number[]) => string)
    : (tokens: number[]) => tokens.join("");
  const encodeChat = isFunction(moduleObject.encodeChat)
    ? (moduleObject.encodeChat as (
        messages: unknown[],
        model: string,
      ) => number[])
    : () => [];

  return {
    encode,
    decode,
    encodeChat,
  };
};

let cachedTokenizer: Tokenizer | null = null;
let tokenizerLoadPromise: Promise<Tokenizer> | null = null;

export const getTokenizer = async (): Promise<Tokenizer> => {
  if (cachedTokenizer) {
    return cachedTokenizer;
  }

  if (tokenizerLoadPromise) {
    return await tokenizerLoadPromise;
  }

  tokenizerLoadPromise = (async () => {
    try {
      let module: TokenizerModule;

      try {
        module = (await import("gpt-tokenizer")) as TokenizerModule;
      } catch {
        try {
          const o200kBase =
            (await import("gpt-tokenizer/encoding/o200k_base")) as BaseEncoding;

          const fallbackTokenizer: Tokenizer = {
            encode: o200kBase.encode,
            decode: o200kBase.decode,
            encodeChat: () => [],
          };

          cachedTokenizer = fallbackTokenizer;
          return fallbackTokenizer;
        } catch (fallbackError) {
          throw new Error(
            `Failed to load gpt-tokenizer fallback: ${fallbackError instanceof Error ? fallbackError.message : "Unknown error"}`,
            { cause: fallbackError },
          );
        }
      }

      const resolvedModule = module.default ?? module;
      const tokenizer = buildTokenizer(resolvedModule);

      cachedTokenizer = tokenizer;
      return tokenizer;
    } catch (error) {
      throw new Error(
        `Failed to load gpt-tokenizer: ${error instanceof Error ? error.message : "Unknown error"}`,
        { cause: error },
      );
    }
  })();

  return await tokenizerLoadPromise;
};

const encodingCache = new Map<string, BaseEncoding>();

const loadEncoding = async (
  cacheKey: string,
  loader: () => Promise<BaseEncoding>,
): Promise<BaseEncoding> => {
  if (encodingCache.has(cacheKey)) {
    return encodingCache.get(cacheKey)!;
  }

  const mod = await loader();
  const encoding: BaseEncoding = {
    encode: mod.encode,
    decode: mod.decode,
  };

  encodingCache.set(cacheKey, encoding);
  return encoding;
};

export const loadCl100k = async (): Promise<BaseEncoding> => {
  return await loadEncoding(
    "cl100k_base",
    async () =>
      (await import("gpt-tokenizer/encoding/cl100k_base")) as BaseEncoding,
  );
};

export const loadP50kBase = async (): Promise<BaseEncoding> => {
  return await loadEncoding(
    "p50k_base",
    async () =>
      (await import("gpt-tokenizer/encoding/p50k_base")) as BaseEncoding,
  );
};

export const loadP50kEdit = async (): Promise<BaseEncoding> => {
  return await loadEncoding(
    "p50k_edit",
    async () =>
      (await import("gpt-tokenizer/encoding/p50k_edit")) as BaseEncoding,
  );
};

export const loadR50kBase = async (): Promise<BaseEncoding> => {
  return await loadEncoding(
    "r50k_base",
    async () =>
      (await import("gpt-tokenizer/encoding/r50k_base")) as BaseEncoding,
  );
};
