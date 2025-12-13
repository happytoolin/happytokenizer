import { useMemo, useState } from "react";
import styles from "../../styles/components/TokenDisplay.module.css";
import { VirtualizedCompactTokenDisplay } from "./VirtualizedCompactTokenDisplay";
import { VirtualizedInlineTokenDisplay } from "./VirtualizedInlineTokenDisplay";
import { VirtualTokenDisplay } from "./VirtualTokenDisplay";

interface TokenDisplayProps {
  text: string;
  tokens: number[];
  tokenTexts: string[];
  error?: string | null;
}

// Industrial Palette: Markers, Wires, and Warning Labels
const TOKEN_COLORS = [
  "#FF6600", // Brand Orange (Safety)
  "#2563EB", // International Klein Blue
  "#059669", // Emerald Green
  "#DB2777", // Pink 600 (Process Magenta)
  "#7C3AED", // Violet (Electrical Purple)
  "#D97706", // Amber (Warning Yellow)
  "#0891B2", // Cyan 600 (Oxidized Copper)
  "#DC2626", // Red 600 (Stop)
  "#4F46E5", // Indigo (Blueprint)
  "#65A30D", // Lime (High Vis)
  "#333333", // Carbon (Black)
  "#0284C7", // Sky Blue (Data)
  "#C026D3", // Fuchsia
  "#EA580C", // Burnt Orange
  "#16A34A", // Green 600
  "#9333EA", // Purple 600
  "#CA8A04", // Dark Gold
  "#BE123C", // Rose
  "#0D9488", // Teal
  "#475569", // Slate (Industrial Grey)
];

const CONTAINER_HEIGHT = 500;

export function TokenDisplay({
  text,
  tokens,
  tokenTexts,
  error,
}: TokenDisplayProps) {
  const [viewMode, setViewMode] = useState<"inline" | "compact" | "detailed">(
    "inline",
  );

  // Highly optimized token item generation using actual decoded token texts
  const tokenItems = useMemo(() => {
    if (tokens.length === 0) return [];

    const result = new Array(tokens.length);
    const colorsLen = TOKEN_COLORS.length;

    for (let i = 0; i < tokens.length; i++) {
      const tokenId = tokens[i];
      // Fast modulo
      const color = TOKEN_COLORS[i % colorsLen];

      // Use the actual decoded text for this token if available
      // This shows what each token actually represents, fixing the duplicate issue
      let displayText = tokenTexts[i] || `[${tokenId}]`;

      // Clean up whitespace-only tokens for better display
      if (displayText.trim() === "") {
        displayText = `[${tokenId}]`;
      }

      // Truncate very long tokens for display
      if (displayText.length > 20) {
        displayText = displayText.substring(0, 20) + "...";
      }

      result[i] = {
        id: i,
        tokenId,
        color,
        text: displayText,
      };
    }

    return result;
  }, [tokens, tokenTexts]);

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
            tokensPerRow={32} // Will be dynamically calculated
            itemWidth={48} // Increased for more horizontal space
            itemHeight={24} // Decreased to match new token height + spacing
            gap={2} // Reduced gap for tighter packing
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
