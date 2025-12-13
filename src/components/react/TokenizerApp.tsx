import React, { useEffect, useRef, useState } from "react";
import { useTokenizer } from "../../hooks/useTokenizer";
import {
  getEncodingForModel,
  isEncodingType,
} from "../../utils/modelEncodings";
import { VERSION } from "../../utils/version";
import {
  DEFAULT_ESSAY,
  SAMPLE_TEXT,
  LARGE_SAMPLE_TEXT,
} from "../../utils/constants";
import { TokenDisplay } from "./TokenDisplay";

export function TokenizerApp() {
  const [text, setText] = useState(DEFAULT_ESSAY);
  const [model, setModel] = useState<string>("gpt-4o"); // Default to a specific model
  const [debouncedText, setDebouncedText] = useState("");

  // --- TAB STATE ---
  const [activeTab, setActiveTab] = useState<"input" | "upload">("input");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get encoding for the current model - if model is an encoding itself, use it directly
  const encoding = isEncodingType(model) ? model : getEncodingForModel(model);
  const { tokens, tokenTexts, isLoading, error, progress, tokenize } =
    useTokenizer();

  // Debounce text input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(text);
    }, 150); // Faster debounce for better UX

    return () => clearTimeout(timer);
  }, [text]);

  // Trigger tokenization when debounced text or encoding changes
  useEffect(() => {
    if (debouncedText && encoding) {
      tokenize(debouncedText, encoding);
    }
  }, [debouncedText, encoding, tokenize]);

  // --- FILE HANDLERS ---
  const processFile = (file: File) => {
    setUploadError(null);

    // Basic validation
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setUploadError("File is too large (Max 5MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        setText(content);
        setActiveTab("input"); // Switch back to editor view to see content
      }
    };
    reader.onerror = () => setUploadError("Failed to read file");

    // Attempt to read as text (covers txt, md, json, code files)
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setText("");
  };

  return (
    <div className="max-w-7xl mx-auto p-10 min-h-screen grid grid-cols-[320px_1fr] gap-8 items-start max-[900px]:grid-cols-1 max-[900px]:p-4">
      {/* --- CONTROL DECK (Sidebar) --- */}
      <aside className="sticky top-10 h-[800px] bg-white border border-brand-black shadow-hard-lg flex flex-col justify-between max-[900px]:relative max-[900px]:top-0 max-[900px]:h-auto max-[900px]:shadow-none">
        <div className="p-6 border-b border-brand-black bg-brand-black text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2.5 h-2.5 bg-brand-orange rounded-full shadow-[0_0_10px_var(--color-brand-orange)]"></div>
            <a
              href="https://happytokenizer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline inline-block"
            >
              <h1 className="font-display font-black text-xl uppercase m-0 tracking-[-0.02em] text-white hover:text-brand-orange transition-colors">
                HappyTokenizer
              </h1>
            </a>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-mono text-xxs text-gray-400">{VERSION}</span>
            <a
              href="https://happytoolin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-mono text-xxs bg-white text-brand-black px-1 py-0.5 font-bold">
                by happytoolin
              </span>
            </a>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-8 flex-1 overflow-y-auto scrollbar-mechanical">
          <div className="flex flex-col gap-3">
            <label className="font-mono text-xxs uppercase text-gray-600 font-semibold tracking-[0.05em] flex justify-between">
              Model Selection
            </label>
            <div className="relative">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full appearance-none bg-brand-paper border border-brand-black rounded-none p-3 font-body font-semibold text-sm text-brand-black cursor-pointer transition-all hover:bg-gray-200 focus:outline-none focus:bg-brand-black focus:text-white"
              >
                <optgroup label="🚀 Modern Models (o200k_base)">
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                  <option value="o1">O1</option>
                  <option value="o1-mini">O1 Mini</option>
                  <option value="o1-pro">O1 Pro</option>
                  <option value="o3">O3</option>
                  <option value="o3-mini">O3 Mini</option>
                  <option value="o3-pro">O3 Pro</option>
                  <option value="gpt-5">GPT-5</option>
                  <option value="gpt-5-pro">GPT-5 Pro</option>
                  <option value="gpt-5-mini">GPT-5 Mini</option>
                  <option value="chatgpt-4o-latest">ChatGPT-4o Latest</option>
                  <option value="gpt-4.1">GPT-4.1</option>
                  <option value="gpt-4.1-mini">GPT-4.1 Mini</option>
                </optgroup>

                <optgroup label="💬 Chat Models (cl100k_base)">
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-3.5-turbo-0125">GPT-3.5 Turbo 0125</option>
                  <option value="gpt-3.5-turbo-0613">GPT-3.5 Turbo 0613</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-0613">GPT-4 0613</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-4-turbo-preview">
                    GPT-4 Turbo Preview
                  </option>
                  <option value="gpt-4-1106-preview">GPT-4 1106 Preview</option>
                  <option value="gpt-4-32k">GPT-4 32k</option>
                  <option value="gpt-3.5-turbo-instruct">
                    GPT-3.5 Turbo Instruct
                  </option>
                </optgroup>

                <optgroup label="🔧 Completion Models (p50k_base)">
                  <option value="text-davinci-003">Text Davinci 003</option>
                  <option value="text-davinci-002">Text Davinci 002</option>
                  <option value="code-davinci-001">Code Davinci 001</option>
                  <option value="code-davinci-002">Code Davinci 002</option>
                  <option value="code-cushman-001">Code Cushman 001</option>
                  <option value="code-cushman-002">Code Cushman 002</option>
                  <option value="cushman-codex">Cushman Codex</option>
                  <option value="davinci-codex">Davinci Codex</option>
                </optgroup>

                <optgroup label="✏️ Edit Models (p50k_edit)">
                  <option value="text-davinci-edit-001">
                    Text Davinci Edit 001
                  </option>
                  <option value="code-davinci-edit-001">
                    Code Davinci Edit 001
                  </option>
                </optgroup>

                <optgroup label="🏛️ Legacy Models (r50k_base)">
                  <option value="text-davinci-001">Text Davinci 001</option>
                  <option value="ada">Ada</option>
                  <option value="babbage">Babbage</option>
                  <option value="curie">Curie</option>
                  <option value="davinci">Davinci</option>
                  <option value="text-ada-001">Text Ada 001</option>
                  <option value="text-babbage-001">Text Babbage 001</option>
                  <option value="text-curie-001">Text Curie 001</option>
                </optgroup>

                <optgroup label="🔍 Search & Similarity (r50k_base)">
                  <option value="text-search-ada-doc-001">
                    Text Search Ada Doc 001
                  </option>
                  <option value="text-search-ada-query-001">
                    Text Search Ada Query 001
                  </option>
                  <option value="text-search-babbage-doc-001">
                    Text Search Babbage Doc 001
                  </option>
                  <option value="text-search-babbage-query-001">
                    Text Search Babbage Query 001
                  </option>
                  <option value="text-search-curie-doc-001">
                    Text Search Curie Doc 001
                  </option>
                  <option value="text-search-curie-query-001">
                    Text Search Curie Query 001
                  </option>
                  <option value="text-search-davinci-doc-001">
                    Text Search Davinci Doc 001
                  </option>
                  <option value="text-search-davinci-query-001">
                    Text Search Davinci Query 001
                  </option>
                  <option value="text-similarity-ada-001">
                    Text Similarity Ada 001
                  </option>
                  <option value="text-similarity-babbage-001">
                    Text Similarity Babbage 001
                  </option>
                  <option value="text-similarity-curie-001">
                    Text Similarity Curie 001
                  </option>
                  <option value="text-similarity-davinci-001">
                    Text Similarity Davinci 001
                  </option>
                </optgroup>

                <optgroup label="🎵 Audio & Media (o200k_base)">
                  <option value="whisper-1">Whisper 1</option>
                  <option value="tts-1">TTS-1</option>
                  <option value="tts-1-hd">TTS-1 HD</option>
                  <option value="dall-e-2">DALL-E 2</option>
                  <option value="dall-e-3">DALL-E 3</option>
                  <option value="gpt-audio">GPT Audio</option>
                  <option value="gpt-audio-mini">GPT Audio Mini</option>
                  <option value="sora">Sora</option>
                </optgroup>

                <optgroup label="🎵 OpenAI OSS (o200k_harmony)">
                  <option value="gpt-4o-mini-audiopreview">
                    GPT-4o Mini AudioPreview
                  </option>
                  <option value="gpt-4o-audiopreview">
                    GPT-4o AudioPreview
                  </option>
                  <option value="gpt-4o-realtime-preview">
                    GPT-4o Realtime Preview
                  </option>
                  <option value="gpt-4o-mini-realtime-preview">
                    GPT-4o Mini Realtime Preview
                  </option>
                  <option value="chatgpt-4o-latest-audiopreview">
                    ChatGPT-4o Latest AudioPreview
                  </option>
                  <option value="realtime-model-preview-2024-10-01">
                    Realtime Model Preview 2024-10-01
                  </option>
                </optgroup>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none text-brand-orange">
                ↓
              </span>
            </div>
          </div>

          {/* Model Info */}
          <div className="flex justify-between items-center p-2 bg-brand-paper border border-gray-300">
            <span className="font-mono text-xxs text-gray-400 uppercase font-semibold">
              Encoding
            </span>
            <span className="font-mono text-xs text-brand-black font-semibold">
              {encoding}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-mono text-xxs uppercase text-gray-600 font-semibold tracking-[0.05em]">
              Input Source
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setText(SAMPLE_TEXT);
                  setActiveTab("input");
                }}
                className="bg-transparent border border-gray-400 text-gray-600 px-2 py-2 font-mono text-xs font-medium cursor-pointer transition-all duration-200 hover:border-brand-black hover:text-brand-black"
              >
                Sample
              </button>
              <button
                onClick={() => {
                  setText(LARGE_SAMPLE_TEXT);
                  setActiveTab("input");
                }}
                className="bg-transparent border border-gray-400 text-gray-600 px-2 py-2 font-mono text-xs font-medium cursor-pointer transition-all duration-200 hover:border-brand-black hover:text-brand-black"
              >
                Large
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setText(DEFAULT_ESSAY)}
                className="bg-transparent border border-gray-400 text-gray-600 px-2 py-2 font-mono text-xs font-medium cursor-pointer transition-all duration-200 hover:border-brand-black hover:text-brand-black"
              >
                Essay
              </button>
              <button
                onClick={handleClear}
                className="bg-brand-orange text-brand-black border border-brand-black px-3 py-3 font-mono text-xs font-bold uppercase cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard active:translate-x-0 active:translate-y-0 active:shadow-none"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Always reserve space for loading state to prevent layout shift */}
          <div className="h-[80px] flex-shrink-0">
            {isLoading && (
              <div className="bg-brand-paper p-3 border border-gray-300 h-full">
                <div className="font-mono text-xxs uppercase text-gray-600 font-semibold tracking-[0.05em] mb-2">
                  Processing Stream
                </div>
                <div className="h-1 bg-gray-300 w-full relative overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-orange to-orange-400 transition-all duration-300 ease-out"
                    style={{
                      width: `${progress ? progress.percentage : 100}%`,
                    }}
                  />
                </div>
                <div className="font-mono text-xxs text-gray-400 mt-1 text-right">
                  {progress
                    ? `Chunk ${progress.chunkIndex}/${progress.totalChunks}`
                    : "Calculating..."}
                </div>
              </div>
            )}
          </div>

          {/* Privacy Section */}
          <div className="flex flex-col items-center gap-0.5 p-1.5 m-2 text-center">
            <span className="font-mono text-xxs text-gray-400 uppercase leading-none mb-1">
              Privacy
            </span>
            <span className="font-mono text-xs text-brand-black font-semibold leading-none">
              100% Client-Side
            </span>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-brand-paper">
          <div className="font-mono text-xxs text-gray-400 uppercase mb-1 text-center block">
            Open Source Software
          </div>
          <a
            href="https://github.com/happytoolin/happytokenizer"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-brand-black no-underline font-semibold text-center block hover:text-brand-orange transition-colors"
          >
            github.com/happytoolin
          </a>
        </div>
      </aside>

      {/* --- RIGHT PANEL: WORKSPACE --- */}
      <div className="flex flex-col gap-6">
        {/* Editor Section */}
        <div className="bg-white border border-brand-black shadow-hard">
          <div className="flex border-b border-brand-black bg-brand-paper">
            <button
              onClick={() => setActiveTab("input")}
              className={`bg-transparent border-none border-r border-brand-black px-5 py-2.5 font-mono text-xs uppercase font-semibold cursor-pointer relative transition-colors hover:text-brand-black hover:bg-black/[0.02] ${
                activeTab === "input"
                  ? "bg-white text-brand-black shadow-[inset_0_2px_0_var(--c-orange)]"
                  : "text-gray-500"
              }`}
            >
              Input Stream
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`bg-transparent border-none px-5 py-2.5 font-mono text-xs uppercase font-semibold cursor-pointer relative transition-colors hover:text-brand-black hover:bg-black/[0.02] ${
                activeTab === "upload"
                  ? "bg-white text-brand-black shadow-[inset_0_2px_0_var(--c-orange)]"
                  : "text-gray-500"
              }`}
            >
              Upload File
            </button>
          </div>

          {activeTab === "input" ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here to see how it gets tokenized..."
              className="w-full border-none p-6 font-mono text-sm leading-7 text-brand-black resize-y min-h-[200px] focus:outline-none focus:bg-gray-50"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white min-h-[235px]">
              <div
                className={`w-full h-full max-h-[216px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-4 cursor-pointer relative bg-gray-50 transition-all ${
                  isDragging || isDragging
                    ? "border-brand-orange bg-brand-orange/[0.02] scale-[0.98]"
                    : "hover:border-brand-orange hover:bg-brand-orange/[0.02]"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <svg
                  className={`w-12 h-12 transition-colors ${
                    isDragging || isDragging
                      ? "text-brand-orange"
                      : "text-gray-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <div className="text-center">
                  <p className="font-display font-bold text-base text-brand-black">
                    Drop File Here
                  </p>
                  <p className="font-mono text-xs text-gray-500 max-w-[250px] text-center leading-6">
                    Supports .txt, .md, .json, .js, .py (Max 5MB)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.json,.js,.ts,.jsx,.tsx,.py,.html,.css"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              {uploadError && (
                <p className="text-red-500 font-mono text-xs mt-4">
                  {uploadError}
                </p>
              )}
            </div>
          )}

          {/* Meta Bar */}
          <div className="flex gap-6 border-t border-brand-black p-2 bg-white">
            <div className="flex gap-2 items-center">
              <span className="font-mono text-xxs text-gray-400 font-bold">
                CH
              </span>
              <span className="font-mono text-xs font-medium">
                {text.length}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-mono text-xxs text-gray-400 font-bold">
                WORD
              </span>
              <span className="font-mono text-xs font-medium">
                {text.split(/\s+/).filter((w) => w).length}
              </span>
            </div>
          </div>
        </div>

        {/* Token Display */}
        {isLoading && (
          <div className="bg-gray-50 p-3 border border-gray-200">
            <div className="h-1 bg-gray-200 w-full mt-2 relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-orange to-orange-400 transition-all duration-300 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="font-mono text-xxs text-gray-400 mt-1 text-right">
              Processing... {Math.round(progress * 100)}%
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-sm">
            <p className="font-mono text-sm text-red-600">Error: {error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <TokenDisplay
            text={debouncedText}
            tokens={tokens || []}
            tokenTexts={tokenTexts || []}
            encoding={encoding!}
          />
        )}
      </div>
    </div>
  );
}
