import { useState } from "react";
import { ModelTokenizer } from "./ModelTokenizer";
import { TokenStatistics } from "./TokenStatistics";

interface ModelTokenizerWithStatsProps {
  selectedModel: string;
}

export function ModelTokenizerWithStats({
  selectedModel,
}: ModelTokenizerWithStatsProps) {
  const [tokenData, setTokenData] = useState({
    tokens: [] as number[],
    text: "",
  });

  const handleTokensChange = (tokens: number[], text: string) => {
    setTokenData({ tokens, text });
  };

  return (
    <div className="space-y-8">
      <ModelTokenizer
        selectedModel={selectedModel}
        onTokensChange={handleTokensChange}
      />

      {/* Token Statistics Panel */}
      <div className="bg-white border border-black">
        <div className="p-6">
          <h3 className="font-display text-xl font-bold uppercase mb-6 flex items-center gap-2">
            Token Analysis
            <svg
              className="w-4 h-4 text-[var(--c-orange)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </h3>
        </div>

        <TokenStatistics
          tokens={tokenData.tokens}
          text={tokenData.text}
          modelName={selectedModel}
          className="border-t border-black"
        />
      </div>
    </div>
  );
}
