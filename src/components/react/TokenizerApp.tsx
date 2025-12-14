import React, { useEffect, useRef, useState, useTransition } from "react";
import { useTokenizer } from "../../hooks/useTokenizer";
import { useModelOptions } from "../../hooks/useModelOptions";
import {
  DEFAULT_ESSAY,
  LARGE_SAMPLE_TEXT,
  SAMPLE_TEXT,
} from "../../utils/constants";
import {
  getEncodingForModel,
  isEncodingType,
} from "../../utils/modelEncodings";
import { Sidebar } from "./Sidebar";
import { TokenDisplay } from "./TokenDisplay";
import { TokenizerShell } from "./TokenizerShell";
import { StatusDisplay } from "../ui/StatusDisplay";

export function TokenizerApp() {
  const [text, setText] = useState(DEFAULT_ESSAY);
  const [model, setModel] = useState<string>("gpt-5"); // Default to a specific model
  const [tokenizeTarget, setTokenizeTarget] = useState(DEFAULT_ESSAY);
  const [isPending, startTransition] = useTransition();

  // Use the extracted model options hook
  const modelOptions = useModelOptions();

  // --- TAB STATE ---
  const [activeTab, setActiveTab] = useState<"input" | "upload">("input");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get encoding for the current model - if model is an encoding itself, use it directly
  const encoding = isEncodingType(model) ? model : getEncodingForModel(model);
  const { tokens, tokenTexts, isLoading, error, progress, tokenize } =
    useTokenizer();

  // Trigger tokenization when tokenizeTarget changes (updated via useTransition)
  useEffect(() => {
    if (tokenizeTarget && encoding) {
      tokenize(tokenizeTarget, encoding, { isChatMode: false });
    }
  }, [tokenizeTarget, encoding, tokenize]);

  // Handle text changes with immediate input update and deferred tokenization
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText); // Updates input immediately (High Priority)

    startTransition(() => {
      // Updates tokenization (Low Priority)
      setTokenizeTarget(newText);
    });
  };

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
        setTokenizeTarget(content);
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
    setTokenizeTarget("");
  };

  return (
    <TokenizerShell
      sidebar={
        <Sidebar
          model={model}
          onModelChange={setModel}
          modelOptions={modelOptions}
          encoding={encoding}
          mode="text"
          isLoading={isLoading}
          actions={
            <>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setText(SAMPLE_TEXT)}
                  className="bg-transparent border border-gray-400 text-gray-600 px-2 py-2 font-mono text-xs font-medium cursor-pointer transition-all duration-200 hover:border-brand-black hover:text-brand-black"
                >
                  Sample
                </button>
                <button
                  onClick={() => setText(LARGE_SAMPLE_TEXT)}
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
            </>
          }
        />
      }
      content={
        <>
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
                onChange={handleTextChange}
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

          {/* Status Display */}
          <StatusDisplay
            isLoading={isLoading}
            error={error}
            progress={progress}
            mode="text"
          />

          {!isLoading && !error && (
            <TokenDisplay
              text={tokenizeTarget}
              tokens={tokens || []}
              tokenTexts={tokenTexts || []}
            />
          )}
        </>
      }
    />
  );
}
