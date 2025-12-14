import React from "react";
import { ComboboxShadcn, type ComboboxOption } from "../ui/combobox-shadcn";
import { VERSION } from "../../utils/version";

export interface SidebarProps {
  model: string;
  onModelChange: (model: string) => void;
  modelOptions: ComboboxOption[];
  encoding: string;
  mode: "text" | "chat";
  onModeChange?: () => void;
  // Generic actions for flexible content
  actions?: React.ReactNode;
  isLoading?: boolean;
}

export function Sidebar({
  model,
  onModelChange,
  modelOptions,
  encoding,
  mode,
  actions,
  isLoading,
}: SidebarProps) {
  return (
    <aside className="sticky top-10 h-[calc(100vh-3rem)] max-h-[900px] bg-white border border-brand-black shadow-hard-lg flex flex-col justify-between max-[1024px]:h-[calc(100vh-2.5rem)] max-[900px]:relative max-[900px]:top-0 max-[900px]:h-auto max-[900px]:max-h-none max-[900px]:shadow-none max-[768px]:mb-4">
      <div className="p-6 border-b border-brand-black bg-brand-black text-white max-[768px]:p-4 max-[480px]:p-3">
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

      <div className="p-6 flex flex-col gap-8 flex-1 overflow-y-auto scrollbar-mechanical max-[768px]:p-4 max-[768px]:gap-6 max-[480px]:p-3 max-[480px]:gap-4">
        <div className="flex flex-col gap-3">
          <label className="font-mono text-xxs uppercase text-gray-600 font-semibold tracking-[0.05em] flex justify-between">
            Model Selection
          </label>
          <ComboboxShadcn
            options={modelOptions}
            value={model}
            onValueChange={onModelChange}
            placeholder="Select a model..."
            className="w-full"
          />
        </div>

        {/* Mode Selection */}
        <div className="flex flex-col gap-3">
          <label className="font-mono text-xxs uppercase text-gray-600 font-semibold tracking-[0.05em] flex justify-between">
            Tokenization Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            {mode === "text" ? (
              <>
                <div className="bg-brand-orange text-brand-black border border-brand-black px-3 py-2 text-center font-mono text-xs font-semibold">
                  Text
                </div>
                <a
                  href="/chat"
                  className="bg-transparent border border-gray-300 text-gray-600 px-3 py-2 text-center font-mono text-xs font-semibold hover:border-brand-black hover:text-brand-black transition-all no-underline block"
                >
                  Chat
                </a>
              </>
            ) : (
              <>
                <a
                  href="/"
                  className="bg-transparent border border-gray-300 text-gray-600 px-3 py-2 text-center font-mono text-xs font-semibold hover:border-brand-black hover:text-brand-black transition-all no-underline block"
                >
                  Text
                </a>
                <div className="bg-brand-orange text-brand-black border border-brand-black px-3 py-2 text-center font-mono text-xs font-semibold">
                  Chat
                </div>
              </>
            )}
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

        {/* Input Source - Generic actions */}
        {actions && (
          <div className="flex flex-col gap-3">
            <label className="font-mono text-xxs uppercase text-gray-600 font-semibold tracking-[0.05em]">
              Input Source
            </label>
            {actions}
          </div>
        )}

        {/* Loading State */}
        <div className="h-[80px] shrink-0 max-[768px]:h-0 max-[768px]:overflow-hidden">
          {isLoading && (
            <div className="bg-brand-paper p-3 border border-gray-300 h-full">
              <div className="font-mono text-xxs uppercase text-gray-600 font-semibold tracking-[0.05em] mb-2">
                {mode === "text" ? "Processing Text" : "Processing Chat"}
              </div>
              <div className="h-1 bg-gray-300 w-full relative overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-orange to-orange-400 transition-all duration-300 ease-out animate-pulse" />
              </div>
              <div className="font-mono text-xxs text-gray-400 mt-1 text-right">
                {mode === "text"
                  ? "Tokenizing text..."
                  : "Tokenizing messages..."}
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

      <div className="p-6 border-t border-gray-200 bg-brand-paper max-[768px]:p-4 max-[480px]:p-3">
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
  );
}
