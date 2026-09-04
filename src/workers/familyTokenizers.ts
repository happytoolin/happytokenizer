import type { ChatMessage } from "../types/chat";

export interface EncodingStrategy {
  encode: (text: string) => number[];
  decode: (tokens: number[]) => string;
}

// --- Anthropic Claude ---
// claude.json is the tiktoken-format vocab shipped with @anthropic-ai/tokenizer.
// js-tiktoken consumes it as-is; output matches the official package exactly.
let claudePromise: Promise<EncodingStrategy> | null = null;

export function loadClaude(): Promise<EncodingStrategy> {
  if (!claudePromise) {
    claudePromise = (async () => {
      const [{ Tiktoken }, res] = await Promise.all([
        import("js-tiktoken/lite"),
        fetch("/tokenizers/claude.json"),
      ]);
      if (!res.ok) {
        throw new Error(`Failed to load Claude tokenizer (${res.status})`);
      }
      const enc = new Tiktoken(await res.json(), {});
      return {
        encode: (text: string) => enc.encode(text, "all"),
        decode: (tokens: number[]) => enc.decode(tokens),
      };
    })();
  }
  return claudePromise;
}

// --- Moonshot Kimi ---
// Same tiktoken.model ships in K2.6 / K2.7-Code / K3 (byte-identical files).
// ponytail: pattern rewritten for JS (no class intersection "&&", no bare \p{Han} script
// shorthand); verified token-for-token against Python tiktoken on CJK/mixed/code samples.
const KIMI_RANKS_URL =
  "https://huggingface.co/moonshotai/Kimi-K2.6/resolve/main/tiktoken.model";
const KIMI_PATTERN = [
  "[\\p{Script=Han}]+",
  "[^\\r\\n\\p{L}\\p{N}]?(?:(?![\\p{Script=Han}])[\\p{Lu}\\p{Lt}\\p{Lm}\\p{Lo}\\p{M}])*(?:(?![\\p{Script=Han}])[\\p{Ll}\\p{Lm}\\p{Lo}\\p{M}])+(?i:'s|'t|'re|'ve|'m|'ll|'d)?",
  "[^\\r\\n\\p{L}\\p{N}]?(?:(?![\\p{Script=Han}])[\\p{Lu}\\p{Lt}\\p{Lm}\\p{Lo}\\p{M}])+(?:(?![\\p{Script=Han}])[\\p{Ll}\\p{Lm}\\p{Lo}\\p{M}])*(?i:'s|'t|'re|'ve|'m|'ll|'d)?",
  "\\p{N}{1,3}",
  " ?[^\\s\\p{L}\\p{N}]+[\\r\\n]*",
  "\\s*[\\r\\n]+",
  "\\s+(?!\\S)",
  "\\s+",
].join("|");
const KIMI_SPECIAL_TOKENS: Record<string, number> = {
  "[BOS]": 163584,
  "[EOS]": 163585,
  "<|im_end|>": 163586,
  "<|im_user|>": 163587,
  "<|im_assistant|>": 163588,
  "<|start_header_id|>": 163590,
  "<|end_header_id|>": 163591,
  "[EOT]": 163593,
  "<|im_system|>": 163594,
  "<|tool_calls_section_begin|>": 163595,
  "<|tool_calls_section_end|>": 163596,
  "<|tool_call_begin|>": 163597,
  "<|tool_call_argument_begin|>": 163598,
  "<|tool_call_end|>": 163599,
  "<|im_middle|>": 163601,
  "<|media_begin|>": 163602,
  "<|media_content|>": 163603,
  "<|media_end|>": 163604,
  "<|media_pad|>": 163605,
  "<think>": 163606,
  "</think>": 163607,
  "[UNK]": 163838,
  "[PAD]": 163839,
};

let kimiPromise: Promise<EncodingStrategy> | null = null;

export function loadKimi(): Promise<EncodingStrategy> {
  if (!kimiPromise) {
    kimiPromise = (async () => {
      const [{ Tiktoken }, res] = await Promise.all([
        import("js-tiktoken/lite"),
        fetch(KIMI_RANKS_URL),
      ]);
      if (!res.ok) {
        throw new Error(`Failed to load Kimi tokenizer (${res.status})`);
      }
      const tokens = (await res.text())
        .trim()
        .split("\n")
        .map((line) => line.split(" ")[0]);
      const enc = new Tiktoken(
        {
          pat_str: KIMI_PATTERN,
          special_tokens: KIMI_SPECIAL_TOKENS,
          bpe_ranks: "! 0 " + tokens.join(" "),
        },
        {},
      );
      return {
        encode: (text: string) => enc.encode(text, "all"),
        decode: (tokens: number[]) => enc.decode(tokens),
      };
    })();
  }
  return kimiPromise;
}

// --- Alibaba Qwen & Z.ai GLM (Hugging Face fast tokenizers via transformers.js) ---
// Tokenizer files are fetched from the HF Hub on first use and cached by the browser.
const GLM_REPOS: Record<string, string> = {
  "glm-5.3": "zai-org/GLM-5.3",
  "glm-5.3-flash": "zai-org/GLM-5.3",
  "glm-4.7": "zai-org/GLM-4.7",
};
const QWEN_REPO = "Qwen/Qwen3.8-2.4T-A95B";

const hfCache = new Map<string, Promise<EncodingStrategy>>();

export function loadHuggingFace(
  encoding: "qwen" | "glm",
  modelId?: string,
): Promise<EncodingStrategy> {
  const repo =
    encoding === "qwen"
      ? QWEN_REPO
      : (modelId && GLM_REPOS[modelId]) || GLM_REPOS["glm-5.3"];
  let loader = hfCache.get(repo);
  if (!loader) {
    loader = (async () => {
      const { AutoTokenizer, env } = await import("@huggingface/transformers");
      env.allowLocalModels = false;
      const tokenizer = await AutoTokenizer.from_pretrained(repo);
      return {
        // v4 types say number[], runtime returns a Tensor — handle both.
        encode: (text: string) => {
          const encoded = tokenizer.encode(text) as
            number[] | { data: ArrayLike<number | bigint> };
          const ids = Array.isArray(encoded) ? encoded : encoded.data;
          return Array.from(ids, Number);
        },
        decode: (tokens: number[]) =>
          tokenizer.decode(tokens, { skip_special_tokens: false }),
      };
    })();
    hfCache.set(repo, loader);
  }
  return loader;
}

// Chat serialization per family for chat-mode counting.
export function serializeChatForFamily(
  encoding: string,
  messages: ChatMessage[],
): string {
  switch (encoding) {
    case "kimi":
      return (
        "[BOS]" +
        messages
          .map((m) => {
            const tag =
              m.role === "assistant"
                ? "<|im_assistant|>"
                : m.role === "system"
                  ? "<|im_system|>"
                  : "<|im_user|>";
            return tag + m.content + "<|im_end|>\n";
          })
          .join("") +
        "<|im_assistant|>"
      );
    case "qwen":
      return (
        messages
          .map((m) => `<|im_start|>${m.role}\n${m.content}<|im_end|>\n`)
          .join("") + "<|im_start|>assistant\n"
      );
    case "glm":
      return (
        "[gMASK]<sop>" +
        messages
          .map(
            (m) =>
              `<|${m.role === "assistant" ? "assistant" : "user"}|>\n${m.content}`,
          )
          .join("") +
        "<|assistant|>\n"
      );
    default:
      // ponytail: Anthropic does not publish its wire template; plain text join.
      return messages.map((m) => m.content).join("\n\n");
  }
}
