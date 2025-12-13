import { useMemo, useState } from "react";
import { VirtualTokenDisplay } from "./VirtualTokenDisplay";
import styles from "./TokenDisplay.module.css";
import { VirtualizedCompactTokenDisplay } from "./VirtualizedCompactTokenDisplay";
import { VirtualizedInlineTokenDisplay } from "./VirtualizedInlineTokenDisplay";

interface TokenDisplayProps {
  text: string;
  tokens: number[];
  isLoading?: boolean;
  error?: string | null;
}

const TOKEN_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#6C5CE7",
  "#55A3FF",
  "#FD79A8",
  "#FDCB6E",
  "#6C5CE7",
  "#A29BFE",
  "#74B9FF",
  "#A0E7E5",
  "#FFBE76",
  "#FF7979",
];

const VIRTUALIZATION_THRESHOLD = 100;
const ITEM_HEIGHT = 36;
const CONTAINER_HEIGHT = 400;

export function TokenDisplay({
  text,
  tokens,
  isLoading,
  error,
}: TokenDisplayProps) {
  const [viewMode, setViewMode] = useState<"inline" | "compact" | "detailed">(
    "inline",
  );

  // Memoize word splitting so it doesn't run on every render
  const wordsList = useMemo(() => {
    if (!text) return [];
    return text.split(/\s+/).filter(Boolean);
  }, [text]);

  // Highly optimized token item generation
  const tokenItems = useMemo(() => {
    if (tokens.length === 0) return [];

    const result = new Array(tokens.length);
    const wordsCount = wordsList.length;

    // Estimate tokens per word for distribution
    const tokensPerWord =
      wordsCount > 0 ? Math.max(1, tokens.length / wordsCount) : 1;

    const colorsLen = TOKEN_COLORS.length;

    for (let i = 0; i < tokens.length; i++) {
      const tokenId = tokens[i];
      // Fast modulo
      const color = TOKEN_COLORS[i % colorsLen];

      // Calculate approximate word context
      // Math.floor is faster than parseInt
      const wordIndex = Math.floor(i / tokensPerWord);

      let displayText = `Token ${i + 1}`;

      if (wordIndex < wordsCount) {
        const word = wordsList[wordIndex];
        // Hard truncation for performance and display consistency
        // This matches the math in VirtualizedInlineTokenDisplay
        if (word.length > 15) {
          displayText = word.substring(0, 15) + "...";
        } else {
          displayText = word;
        }
      }

      result[i] = {
        id: i,
        tokenId,
        color,
        text: displayText,
      };
    }

    return result;
  }, [tokens, wordsList]);

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (isLoading) {
    return <div className={styles.loading}>Tokenizing...</div>;
  }

  if (!text || tokens.length === 0) {
    return <div className={styles.empty}>Enter text above to see tokens</div>;
  }

  const shouldUseVirtualization = tokens.length > VIRTUALIZATION_THRESHOLD;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Tokens ({tokens.length})</h3>
        <div className={styles.controls}>
          <div className={styles.modelInfo}>
            Each colored block represents a token
          </div>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${viewMode === "inline" ? styles.active : ""}`}
              onClick={() => setViewMode("inline")}
            >
              Inline
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === "compact" ? styles.active : ""}`}
              onClick={() => setViewMode("compact")}
            >
              Compact
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === "detailed" ? styles.active : ""}`}
              onClick={() => setViewMode("detailed")}
            >
              Detailed
            </button>
          </div>
        </div>
      </div>

      <div className={styles.tokensContainer}>
        {viewMode === "inline" ? (
          shouldUseVirtualization ? (
            <VirtualizedInlineTokenDisplay
              items={tokenItems}
              containerHeight={CONTAINER_HEIGHT}
            />
          ) : (
            // Fallback for very small text (original logic)
            <div className={styles.inlineContainer}>
              {wordsList.map((word, wordIndex) => {
                const tokensPerWord = Math.max(
                  1,
                  Math.ceil(tokens.length / wordsList.length),
                );
                const startTokenIndex = wordIndex * tokensPerWord;
                const endTokenIndex = Math.min(
                  startTokenIndex + tokensPerWord,
                  tokens.length,
                );

                return (
                  <span key={wordIndex}>
                    {Array.from(
                      { length: Math.max(0, endTokenIndex - startTokenIndex) },
                      (_, tokenIndex) => {
                        const globalIndex = startTokenIndex + tokenIndex;
                        const item = tokenItems[globalIndex];
                        if (!item) return null;

                        return (
                          <span
                            key={globalIndex}
                            className={styles.inlineToken}
                            style={{
                              backgroundColor: item.color + "20",
                              borderColor: item.color,
                            }}
                            title={`Token ${globalIndex + 1}: ${item.tokenId}`}
                          >
                            <span className={styles.inlineTokenNumber}>
                              {item.tokenId}
                            </span>
                            <span className={styles.inlineTokenText}>
                              {word}
                            </span>
                          </span>
                        );
                      },
                    )}
                    <span className={styles.space}> </span>
                  </span>
                );
              })}
            </div>
          )
        ) : viewMode === "compact" ? (
          <VirtualizedCompactTokenDisplay
            items={tokenItems}
            containerHeight={CONTAINER_HEIGHT}
            tokensPerRow={20}
            itemWidth={50}
            itemHeight={28}
            gap={4}
          />
        ) : (
          <VirtualTokenDisplay
            items={tokenItems}
            containerHeight={CONTAINER_HEIGHT}
            estimatedItemHeight={ITEM_HEIGHT}
          />
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total Tokens:</span>
          <span className={styles.statValue}>{tokens.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Characters:</span>
          <span className={styles.statValue}>{text.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Words:</span>
          <span className={styles.statValue}>{wordsList.length}</span>
        </div>
        {shouldUseVirtualization && (
          <div className={styles.stat}>
            <span className={styles.statLabel}>View:</span>
            <span className={styles.statValue}>
              {viewMode === "inline"
                ? "Inline (Virtual)"
                : viewMode === "compact"
                  ? "Compact (Grid)"
                  : "Detailed (List)"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
