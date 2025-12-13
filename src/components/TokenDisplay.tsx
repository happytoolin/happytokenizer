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

// Industrial Palette: Oranges, Teals, Greys, with specific opacities
const TOKEN_COLORS = [
  "#FF6600", // Brand Orange
  "#00CC99", // Mint
  "#333333", // Dark Grey
  "#666666", // Mid Grey
  "#999999", // Light Grey
  "#0066FF", // Tech Blue
  "#FF3366", // Warning Red
  "#CCFF00", // Volt
];

const CONTAINER_HEIGHT = 500;

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

  if (error) return <div className={styles.error}>ERR: {error}</div>;
  if (!text || tokens.length === 0)
    return (
      <div className={styles.empty}>
        // HAPPYTOKENIZER: WAITING FOR INPUT STREAM
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>TOKEN MAP</span>
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
            items={tokenItems}
            containerHeight={CONTAINER_HEIGHT}
          />
        )}
        {viewMode === "compact" && (
          <VirtualizedCompactTokenDisplay
            items={tokenItems}
            containerHeight={CONTAINER_HEIGHT}
            tokensPerRow={24} // Denser grid
            itemWidth={40}
            itemHeight={24}
            gap={2}
          />
        )}
        {viewMode === "detailed" && (
          <VirtualTokenDisplay
            items={tokenItems}
            containerHeight={CONTAINER_HEIGHT}
            estimatedItemHeight={40}
          />
        )}
      </div>

      <div className={styles.stats}>
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
      </div>
    </div>
  );
}
