import { useState } from "react";
import styles from "../../styles/components/TokenDisplay.module.css";
import { TOKEN_COLORS, CONTAINER_HEIGHT } from "../../utils/tokenColors";
import { VirtualizedCompactTokenDisplay } from "./VirtualizedCompactTokenDisplay";
import { VirtualizedInlineTokenDisplay } from "./VirtualizedInlineTokenDisplay";
import { VirtualTokenDisplay } from "./VirtualTokenDisplay";
import type { ChatMessage } from "../../types/chat";

interface TokenDisplayProps {
  text: string;
  tokens: number[];
  tokenTexts: string[];
  error?: string | null;
  isChatMode?: boolean;
  chatMessages?: ChatMessage[];
}

export function TokenDisplay({
  text,
  tokens,
  tokenTexts,
  error,
  isChatMode = false,
  chatMessages,
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
          <VirtualizedInlineTokenDisplay
            tokens={tokens}
            tokenTexts={tokenTexts}
            containerHeight={CONTAINER_HEIGHT}
          />
        )}
        {viewMode === "compact" && (
          <VirtualizedCompactTokenDisplay
            tokens={tokens}
            tokenTexts={tokenTexts}
            containerHeight={CONTAINER_HEIGHT}
            tokensPerRow={32} // Will be dynamically calculated
            itemWidth={48} // Increased for more horizontal space
            itemHeight={24} // Decreased to match new token height + spacing
            gap={2} // Reduced gap for tighter packing
          />
        )}
        {viewMode === "detailed" && (
          <VirtualTokenDisplay
            tokens={tokens}
            tokenTexts={tokenTexts}
            containerHeight={CONTAINER_HEIGHT}
            estimatedItemHeight={40}
          />
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
            <div className={styles.stat}>
              <span className={styles.statLabel}>Est. Cost</span>
              <span className={styles.statValue}>
                ${((tokens.length / 1000) * 0.005).toFixed(4)}
              </span>
            </div>
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
              <span className={styles.statLabel}>Est. Cost (Input)</span>
              <span className={styles.statValue}>
                ${((tokens.length / 1000) * 0.005).toFixed(4)}
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Density</span>
              <span className={styles.statValue}>
                {(text.length / tokens.length).toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
