import { useState } from "react";
import styles from "../../styles/components/TokenDisplay.module.css";
import { CONTAINER_HEIGHT } from "../../utils/tokenColors";
import { VirtualizedCompactTokenDisplay } from "./VirtualizedCompactTokenDisplay";
import { VirtualizedInlineTokenDisplay } from "./VirtualizedInlineTokenDisplay";
import { VirtualTokenDisplay } from "./VirtualTokenDisplay";
import { VirtualErrorBoundary } from "../ui/VirtualErrorBoundary";
import { TokenLimitIndicator } from "./TokenLimitIndicator";
import { CostEstimator } from "./CostEstimator";
import { TotalContext } from "./TotalContext";
import type { ChatMessage } from "../../types/chat";

interface TokenDisplayProps {
  text: string;
  tokens: number[];
  tokenTexts: string[];
  error?: string | null;
  isChatMode?: boolean;
  chatMessages?: ChatMessage[];
  modelName?: string;
  showLimitAndCost?: boolean;
}

export function TokenDisplay({
  text,
  tokens,
  tokenTexts,
  error,
  isChatMode = false,
  chatMessages,
  modelName = "gpt-5",
  showLimitAndCost = true,
}: TokenDisplayProps) {
  const [viewMode, setViewMode] = useState<"inline" | "compact" | "detailed">(
    "inline",
  );

  if (error) return <div className={styles.error}>ERR: {error}</div>;

  // For chat mode, we don't need text to show tokens
  const shouldShowEmpty =
    (!isChatMode && (!text || text.trim() === "")) || tokens.length === 0;

  if (shouldShowEmpty)
    return (
      <div className={styles.empty}>
        // HAPPYTOKENIZER:{" "}
        {isChatMode ? "ADD MESSAGES TO SEE TOKENS" : "WAITING FOR INPUT STREAM"}
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>TOKEN MAP {isChatMode && "[CHAT]"}</span>
          <span className={styles.countBadge}>{tokens.length}</span>
        </div>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewButton} ${viewMode === "inline" ? styles.active : ""}`}
            onClick={() => setViewMode("inline")}
          >
            TXT
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === "compact" ? styles.active : ""}`}
            onClick={() => setViewMode("compact")}
          >
            GRD
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === "detailed" ? styles.active : ""}`}
            onClick={() => setViewMode("detailed")}
          >
            LST
          </button>
        </div>
      </div>

      <div className={styles.tokensContainer}>
        {viewMode === "inline" && (
          <VirtualErrorBoundary componentName="VirtualizedInlineTokenDisplay">
            <VirtualizedInlineTokenDisplay
              tokens={tokens}
              tokenTexts={tokenTexts}
              containerHeight={CONTAINER_HEIGHT}
            />
          </VirtualErrorBoundary>
        )}
        {viewMode === "compact" && (
          <VirtualErrorBoundary componentName="VirtualizedCompactTokenDisplay">
            <VirtualizedCompactTokenDisplay
              tokens={tokens}
              tokenTexts={tokenTexts}
              containerHeight={CONTAINER_HEIGHT}
              tokensPerRow={32}
              itemWidth={48}
              itemHeight={32}
              gap={4}
            />
          </VirtualErrorBoundary>
        )}
        {viewMode === "detailed" && (
          <VirtualErrorBoundary componentName="VirtualTokenDisplay">
            <VirtualTokenDisplay
              tokens={tokens}
              tokenTexts={tokenTexts}
              containerHeight={CONTAINER_HEIGHT}
              estimatedItemHeight={40}
            />
          </VirtualErrorBoundary>
        )}
      </div>

      <div className={styles.stats}>
        {isChatMode ? (
          <>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Mode</span>
              <span className={styles.statValue} style={{ color: "#ea580c" }}>
                CHAT
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Messages</span>
              <span className={styles.statValue}>
                {chatMessages?.length || 0}
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Tokens</span>
              <span className={styles.statValue}>{tokens.length}</span>
            </div>
            {showLimitAndCost && (
              <>
                <TokenLimitIndicator
                  tokenCount={tokens.length}
                  modelName={modelName}
                />
                <TotalContext
                  tokenCount={tokens.length}
                  modelName={modelName}
                />
                <CostEstimator
                  tokenCount={tokens.length}
                  modelName={modelName}
                />
              </>
            )}
          </>
        ) : (
          <>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Token Count</span>
              <span className={styles.statValue}>{tokens.length}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Char Count</span>
              <span className={styles.statValue}>{text.length}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Density</span>
              <span className={styles.statValue}>
                {(text.length / tokens.length).toFixed(2)}
              </span>
            </div>
            {showLimitAndCost && (
              <>
                <TokenLimitIndicator
                  tokenCount={tokens.length}
                  modelName={modelName}
                />
                <TotalContext
                  tokenCount={tokens.length}
                  modelName={modelName}
                />
                <CostEstimator
                  tokenCount={tokens.length}
                  modelName={modelName}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
