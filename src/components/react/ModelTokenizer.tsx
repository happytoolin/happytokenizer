import React, { useEffect, useRef, useState } from "react";
import { useTokenizer } from "../../hooks/useTokenizer";
import {
  getEncodingForModel,
  isEncodingType,
} from "../../utils/modelEncodings";
import { StatusDisplay } from "../ui/StatusDisplay";
import { TokenDisplay } from "./TokenDisplay";
import { TokenStatistics } from "./TokenStatistics";

interface ModelTokenizerProps {
  selectedModel: string;
  onTokensChange?: (tokens: number[], text: string) => void;
}

export function ModelTokenizer({
  selectedModel,
  onTokensChange,
}: ModelTokenizerProps) {
  const [text, setText] = useState(
    "The quick brown fox jumps over the lazy dog.",
  );
  const [debouncedText, setDebouncedText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const encoding = isEncodingType(selectedModel)
    ? selectedModel
    : getEncodingForModel(selectedModel);

  const { tokens, tokenTexts, isLoading, error, progress, tokenize } =
    useTokenizer();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(text);
    }, 150);

    return () => clearTimeout(timer);
  }, [text]);

  useEffect(() => {
    if (debouncedText && encoding) {
      tokenize(debouncedText, encoding, { isChatMode: false });
    }
  }, [debouncedText, encoding, tokenize]);

  useEffect(() => {
    if (
      onTokensChange &&
      tokens &&
      (tokens.length > 0 || debouncedText.length > 0)
    ) {
      onTokensChange(Array.from(tokens), debouncedText);
    }
  }, [tokens, debouncedText, onTokensChange]);

  const processFile = (file: File) => {
    setUploadError(null);

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File is too large (Max 5MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        setText(content);
      }
    };
    reader.onerror = () => setUploadError("Failed to read file");

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

  return (
    <div className="bg-white border-2 border-brand-black shadow-hard">
      {/* Tab Navigation */}
      <div className="flex border-b border-brand-black bg-brand-paper">
        <button className="border-none border-r border-brand-black px-5 py-2.5 font-mono text-xs uppercase font-semibold cursor-pointer bg-white text-brand-black shadow-[inset_0_2px_0_var(--c-orange)]">
          Input Stream
        </button>
        <button
          className="bg-transparent border-none px-5 py-2.5 font-mono text-xs uppercase font-semibold cursor-pointer text-gray-500 hover:text-brand-black hover:bg-black/2 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload File
        </button>
      </div>

      {/* Text Input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here to see how it gets tokenized..."
        className="w-full border-none p-6 font-mono text-sm leading-7 text-brand-black resize-y min-h-[200px] focus:outline-none focus:bg-gray-50 max-[768px]:p-4 max-[480px]:p-3 max-[480px]:text-xs"
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.json,.js,.ts,.jsx,.tsx,.py,.html,.css"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drag & Drop Area */}
      {isDragging && (
        <div
          className="p-6 border-t border-brand-black bg-brand-orange/2"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <svg
              className="w-10 h-10 text-brand-orange"
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
              <p className="font-display font-bold text-sm text-brand-black">
                Drop file here
              </p>
              <p className="font-mono text-xs text-gray-500">
                Supports .txt, .md, .json, .js, .py (Max 5MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Error Message */}
      {uploadError && !isDragging && (
        <div className="px-6 py-3 bg-red-50 border-t border-brand-black">
          <p className="text-red-500 font-mono text-xs text-center">
            {uploadError}
          </p>
        </div>
      )}

      {/* Meta Bar */}
      <div className="flex gap-6 border-t border-brand-black p-2 bg-white">
        <div className="flex gap-2 items-center">
          <span className="font-mono text-xxs text-gray-400 font-bold">CH</span>
          <span className="font-mono text-xs font-medium">{text.length}</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="font-mono text-xxs text-gray-400 font-bold">
            WORD
          </span>
          <span className="font-mono text-xs font-medium">
            {text.split(/\s+/).filter((w) => w).length}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="font-mono text-xxs text-gray-400 font-bold">
            ENCODING
          </span>
          <span className="font-mono text-xs font-medium text-black">
            {encoding}
          </span>
        </div>
      </div>

      {/* Status Display */}
      <StatusDisplay
        isLoading={isLoading}
        error={error}
        progress={progress}
        mode="text"
      />

      {/* Token Display */}
      {!isLoading && !error && (
        <TokenDisplay
          text={debouncedText}
          tokens={Array.from(tokens || [])}
          tokenTexts={tokenTexts || []}
          modelName={selectedModel}
          showLimitAndCost={true}
        />
      )}
    </div>
  );
}
