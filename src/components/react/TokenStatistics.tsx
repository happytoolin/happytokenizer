import React from "react";
import { getEncodingForModel } from "../../utils/modelEncodings";
import { getContextWindowLimit, getPricing } from "../../utils/contextLimits";

interface TokenStatisticsProps {
  tokens: number[];
  text: string;
  modelName: string;
  className?: string;
}

export function TokenStatistics({
  tokens,
  text,
  modelName,
  className = "",
}: TokenStatisticsProps) {
  const tokenCount = tokens.length;
  const charCount = text.length;
  const density =
    charCount > 0 && tokenCount > 0
      ? (charCount / tokenCount).toFixed(2)
      : "0.00";

  // Get context window and pricing info
  const contextLimit = getContextWindowLimit(modelName);
  const pricing = getPricing(modelName);

  const contextUsage =
    contextLimit > 0 ? ((tokenCount / contextLimit) * 100).toFixed(1) : "0.0";
  const estCost =
    tokenCount > 0
      ? ((tokenCount / 1000000) * pricing.input).toFixed(4)
      : "0.0000";

  return (
    <div className={`bg-white border border-black p-6 ${className}`}>
      <h3 className="font-display text-xl font-bold uppercase mb-6 flex items-center gap-2">
        Statistics
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

      <div className="space-y-4 font-mono text-xs">
        {/* Token Count */}
        <div className="flex justify-between items-end border-b border-gray-200 pb-2">
          <span className="text-gray-500 uppercase">Token Count</span>
          <span className="text-lg font-bold">
            {tokenCount.toLocaleString()}
          </span>
        </div>

        {/* Char Count */}
        <div className="flex justify-between items-end border-b border-gray-200 pb-2">
          <span className="text-gray-500 uppercase">Char Count</span>
          <span className="text-lg font-bold">
            {charCount.toLocaleString()}
          </span>
        </div>

        {/* Density */}
        <div className="flex justify-between items-end border-b border-gray-200 pb-2">
          <span className="text-gray-500 uppercase">Density</span>
          <span className="text-lg font-bold">{density}</span>
        </div>

        {/* Context Usage */}
        <div className="flex justify-between items-end border-b border-gray-200 pb-2">
          <span className="text-gray-500 uppercase">Context Usage</span>
          <span className="text-lg font-bold text-[var(--c-orange)]">
            {contextUsage}%
          </span>
        </div>

        {/* Total Context */}
        <div className="flex justify-between items-end border-b border-gray-200 pb-2">
          <span className="text-gray-500 uppercase">Total Context</span>
          <span className="text-lg font-bold">
            {contextLimit >= 1000
              ? `${(contextLimit / 1000).toFixed(0)}k`
              : contextLimit.toLocaleString()}
          </span>
        </div>

        {/* Est. Cost */}
        <div className="flex justify-between items-end border-b border-dashed border-gray-300 pb-2">
          <span className="text-gray-500 uppercase">Est. Cost</span>
          <span className="text-lg font-bold text-green-600">${estCost}</span>
        </div>

        {/* Pricing Info */}
        <div className="pt-2 space-y-1">
          <div className="flex justify-between items-end">
            <span className="text-gray-500 text-[10px] uppercase">
              Input/M Tokens
            </span>
            <span className="text-sm font-medium">
              ${pricing.input.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-gray-500 text-[10px] uppercase">
              Output/M Tokens
            </span>
            <span className="text-sm font-medium">
              ${pricing.output.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Usage Progress Bar */}
      <div className="mt-6">
        <div className="w-full bg-gray-200 rounded-full h-2 border border-black">
          <div
            className="bg-[var(--c-orange)] h-2 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(parseFloat(contextUsage), 100)}%`,
            }}
          />
        </div>
        <p className="font-mono text-[10px] text-gray-500 mt-2 text-center">
          {tokenCount.toLocaleString()} / {contextLimit.toLocaleString()} tokens
          used
        </p>
      </div>
    </div>
  );
}
