import type { TokenizerProgress } from "../../hooks/useTokenizer";

interface StatusDisplayProps {
  isLoading: boolean;
  error?: string | null;
  progress?: TokenizerProgress;
  mode: "text" | "chat";
}

export function StatusDisplay({
  isLoading,
  error,
  progress,
  mode,
}: StatusDisplayProps) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4">
        <p className="font-mono text-sm text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-gray-50 p-3 border border-gray-200">
        <div className="h-1 bg-gray-200 w-full mt-2 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-orange to-orange-400 transition-all duration-300 ease-out animate-pulse"
            style={{ width: progress ? `${progress.percentage}%` : "100%" }}
          />
        </div>
        <p className="font-mono text-xxs text-gray-400 mt-1 text-right">
          {mode === "chat"
            ? "Processing... Tokenizing chat messages"
            : `Processing... ${progress ? Math.round(progress.percentage) : 0}%`}
        </p>
      </div>
    );
  }

  return null;
}
