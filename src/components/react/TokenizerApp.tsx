import React, { useEffect, useMemo, useRef, useState } from "react";
import { type ComboboxOption } from "../../components/ui/combobox-shadcn";
import { useTokenizer } from "../../hooks/useTokenizer";
import {
  DEFAULT_ESSAY,
  LARGE_SAMPLE_TEXT,
  SAMPLE_TEXT,
} from "../../utils/constants";
import {
  getEncodingForModel,
  isEncodingType,
  MODEL_DISPLAY_NAMES,
  MODEL_ENCODINGS,
} from "../../utils/modelEncodings";
import { Sidebar } from "./Sidebar";
import { TokenDisplay } from "./TokenDisplay";

export function TokenizerApp() {
  const [text, setText] = useState(DEFAULT_ESSAY);
  const [model, setModel] = useState<string>("gpt-5"); // Default to a specific model
  const [debouncedText, setDebouncedText] = useState("");

  // Generate combobox options from model encodings
  const modelOptions = useMemo(() => {
    const options: ComboboxOption[] = [];

    // Define group names without emojis and encoding details
    const groupNames: Record<string, string> = {
      o200k_base: "Modern Models",
      cl100k_base: "Chat Models",
      p50k_base: "Completion Models",
      p50k_edit: "Edit Models",
      r50k_base: "Legacy Models",
      o200k_harmony: "OpenAI OSS",
    };

    // Group specific models for better organization
    const specialGroups: Record<
      string,
      { models: string[]; groupName: string }
    > = {
      search: {
        models: [
          "text-search-ada-doc-001",
          "text-search-ada-query-001",
          "text-search-babbage-doc-001",
          "text-search-babbage-query-001",
          "text-search-curie-doc-001",
          "text-search-curie-query-001",
          "text-search-davinci-doc-001",
          "text-search-davinci-query-001",
        ],
        groupName: "Search & Similarity",
      },
      similarity: {
        models: [
          "text-similarity-ada-001",
          "text-similarity-babbage-001",
          "text-similarity-curie-001",
          "text-similarity-davinci-001",
        ],
        groupName: "Search & Similarity",
      },
      audioMedia: {
        models: [
          "whisper-1",
          "tts-1",
          "tts-1-hd",
          "dall-e-2",
          "dall-e-3",
          "gpt-audio",
          "gpt-audio-mini",
          "sora-2",
          "sora-2-pro",
        ],
        groupName: "Audio & Media",
      },
      codeSearch: {
        models: [
          "code-search-ada-code-001",
          "code-search-ada-text-001",
          "code-search-babbage-code-001",
          "code-search-babbage-text-001",
        ],
        groupName: "Legacy Models",
      },
    };

    // Process models by encoding type
    Object.entries(MODEL_ENCODINGS).forEach(([encoding, models]) => {
      if (encoding === "r50k_base") {
        // For r50k_base, we need to handle special grouping
        models.forEach((modelName) => {
          let groupName = groupNames[encoding];
          let isInSpecialGroup = false;

          // Check if model belongs to a special group
          Object.entries(specialGroups).forEach(([, group]) => {
            if (group.models.includes(modelName)) {
              groupName = group.groupName;
              isInSpecialGroup = true;
            }
          });

          // Only add if not already in a special group
          if (!isInSpecialGroup) {
            options.push({
              value: modelName,
              label: MODEL_DISPLAY_NAMES[modelName] || modelName,
              group: groupName,
            });
          }
        });

        // Add special groups
        Object.values(specialGroups).forEach((group) => {
          if (
            group.groupName.includes("Search") ||
            group.groupName.includes("Similarity") ||
            group.groupName.includes("Code") ||
            group.groupName.includes("Legacy")
          ) {
            group.models.forEach((modelName) => {
              if (MODEL_ENCODINGS.r50k_base.includes(modelName as never)) {
                options.push({
                  value: modelName,
                  label: MODEL_DISPLAY_NAMES[modelName] || modelName,
                  group: group.groupName,
                });
              }
            });
          }
        });
      } else {
        // For other encodings, add models normally
        models.forEach((modelName) => {
          let groupName = groupNames[encoding];

          // Check for audio/media special group
          if (specialGroups.audioMedia.models.includes(modelName)) {
            groupName = specialGroups.audioMedia.groupName;
          }

          options.push({
            value: modelName,
            label: MODEL_DISPLAY_NAMES[modelName] || modelName,
            group: groupName,
          });
        });
      }
    });

    return options;
  }, []);

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
      tokenize(debouncedText, encoding, { isChatMode: false });
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
    <div className="max-w-7xl mx-auto p-10 min-h-screen grid grid-cols-[320px_1fr] gap-8 items-start max-[1024px]:gap-6 max-[900px]:grid-cols-1 max-[900px]:p-4 max-[768px]:p-3 max-[480px]:p-2">
      {/* --- CONTROL DECK (Sidebar) --- */}
      <Sidebar
        model={model}
        onModelChange={setModel}
        modelOptions={modelOptions}
        encoding={encoding}
        mode="text"
        onSampleText={() => setText(SAMPLE_TEXT)}
        onLargeText={() => setText(LARGE_SAMPLE_TEXT)}
        onEssayText={() => setText(DEFAULT_ESSAY)}
        onClearText={handleClear}
        isLoading={isLoading}
      />

      {/* --- RIGHT PANEL: WORKSPACE --- */}
      <div className="flex flex-col gap-6 max-[768px]:pb-32 max-[600px]:pb-20 max-[480px]:pb-24">
        {/* Editor Section */}
        <div className="bg-white border border-brand-black shadow-hard">
          <div className="flex border-b border-brand-black bg-brand-paper">
            <button
              onClick={() => setActiveTab("input")}
              className={`bg-transparent border-none border-r border-brand-black px-5 py-2.5 font-mono text-xs uppercase font-semibold cursor-pointer relative transition-colors hover:text-brand-black hover:bg-black/2 ${
                activeTab === "input"
                  ? "bg-white text-brand-black shadow-[inset_0_2px_0_var(--c-orange)]"
                  : "text-gray-500"
              }`}
            >
              Input Stream
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`bg-transparent border-none px-5 py-2.5 font-mono text-xs uppercase font-semibold cursor-pointer relative transition-colors hover:text-brand-black hover:bg-black/2 ${
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
              className="w-full border-none p-6 font-mono text-sm leading-7 text-brand-black resize-y min-h-[200px] focus:outline-none focus:bg-gray-50 max-[768px]:p-4 max-[480px]:p-3 max-[480px]:text-xs"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white min-h-[235px] max-[768px]:p-4 max-[480px]:p-3">
              <div
                className={`w-full h-full max-h-[216px] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-4 cursor-pointer relative bg-gray-50 transition-all ${
                  isDragging
                    ? "border-brand-orange bg-brand-orange/2 scale-[0.98]"
                    : "hover:border-brand-orange hover:bg-brand-orange/2"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <svg
                  className={`w-12 h-12 transition-colors ${
                    isDragging ? "text-brand-orange" : "text-gray-400"
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
                className="h-full bg-linear-to-r from-brand-orange to-orange-400 transition-all duration-300 ease-out"
                style={{ width: `${progress ? progress.percentage : 100}%` }}
              />
            </div>
            <p className="font-mono text-xxs text-gray-400 mt-1 text-right">
              Processing... {progress ? Math.round(progress.percentage) : 0}%
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 p-4">
            <p className="font-mono text-sm text-red-600">Error: {error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <TokenDisplay
            text={debouncedText}
            tokens={tokens || []}
            tokenTexts={tokenTexts || []}
          />
        )}
      </div>
    </div>
  );
}
