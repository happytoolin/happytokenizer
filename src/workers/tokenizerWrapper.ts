// Minimal tokenizer wrapper for Cloudflare Workers
// This file loads only the essential parts to avoid circular dependencies

export const getTokenizer = async () => {
  try {
    // Dynamic import to avoid bundling everything at startup
    const module = await import("gpt-tokenizer");
    return {
      encode: module.encode,
      decode: module.decode,
      encodeChat: module.encodeChat || (() => []),
    };
  } catch (error) {
    console.error("Failed to load tokenizer:", error);
    throw error;
  }
};

// Individual encoding loaders
export const loadCl100k = async () => {
  const mod = await import("gpt-tokenizer/encoding/cl100k_base");
  return { encode: mod.encode, decode: mod.decode };
};

export const loadP50kBase = async () => {
  const mod = await import("gpt-tokenizer/encoding/p50k_base");
  return { encode: mod.encode, decode: mod.decode };
};

export const loadP50kEdit = async () => {
  const mod = await import("gpt-tokenizer/encoding/p50k_edit");
  return { encode: mod.encode, decode: mod.decode };
};

export const loadR50kBase = async () => {
  const mod = await import("gpt-tokenizer/encoding/r50k_base");
  return { encode: mod.encode, decode: mod.decode };
};
