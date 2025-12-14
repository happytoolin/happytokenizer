import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import { useMemo, useRef, useState, useEffect } from "react";
import styles from "../../styles/components/VirtualizedCompactTokenDisplay.module.css";
import { TOKEN_COLORS } from "../../utils/tokenColors";

interface VirtualizedCompactTokenDisplayProps {
  tokens: number[];
  tokenTexts: string[];
  containerHeight: number;
  tokensPerRow: number;
  itemWidth: number;
  itemHeight: number;
  gap: number;
}

export function VirtualizedCompactTokenDisplay({
  tokens,
  tokenTexts,
  containerHeight,
  tokensPerRow,
  itemWidth,
  itemHeight,
  gap,
}: VirtualizedCompactTokenDisplayProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Calculate optimal tokens per row based on container width
  // This will be updated dynamically when container is available
  const [containerWidth, setContainerWidth] = useState(0);

  // Recalculate tokens per row when container width changes
  // Account for 32px of horizontal padding (16px on each side)
  const effectiveTokensPerRow =
    containerWidth > 0
      ? Math.floor((containerWidth - 32 - gap) / (itemWidth + gap))
      : tokensPerRow;

  const rowCount = Math.ceil(tokens.length / effectiveTokensPerRow);

  // Update container width on resize
  useEffect(() => {
    const container = parentRef.current;
    if (!container) return;

    const updateWidth = () => {
      setContainerWidth(container.clientWidth);
    };

    // Initial width
    updateWidth();

    // Setup resize observer
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight + gap,
    overscan: 5, // Increased overscan for smoother scrolling
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  // Computation helper for individual token data
  const getTokenData = (index: number) => {
    const tokenId = tokens[index];
    const color = TOKEN_COLORS[index % TOKEN_COLORS.length];

    let displayText = tokenTexts[index] || `[${tokenId}]`;

    // Clean up whitespace-only tokens for better display
    if (displayText.trim() === "") {
      displayText = `[${tokenId}]`;
    }

    // Truncate very long tokens for display and tooltips (CSS perf optimization)
    if (displayText.length > 30) {
      displayText = displayText.substring(0, 30) + "...";
    }

    return { tokenId, color, text: displayText };
  };

  const visibleItems = useMemo(() => {
    const result: Array<{
      tokenId: number;
      color: string;
      text: string;
      virtualRow: VirtualItem;
      colIndex: number;
    }> = [];

    virtualRows.forEach((virtualRow) => {
      const startIndex = virtualRow.index * effectiveTokensPerRow;
      const endIndex = Math.min(
        startIndex + effectiveTokensPerRow,
        tokens.length,
      );

      for (let i = startIndex; i < endIndex; i++) {
        const tokenData = getTokenData(i);
        result.push({
          ...tokenData,
          virtualRow,
          colIndex: i - startIndex,
        });
      }
    });

    return result;
  }, [virtualRows, tokens, tokenTexts, effectiveTokensPerRow]);

  return (
    <div className={styles.virtualCompactContainer}>
      <div
        className={styles.scrollContainer}
        style={{ height: containerHeight }}
        ref={parentRef}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {visibleItems.map(
            ({ tokenId, color, text, virtualRow, colIndex }, index) => {
              const tokenIndex =
                virtualRow.index * effectiveTokensPerRow + colIndex;
              return (
                <span
                  key={tokenIndex}
                  className={styles.compactToken}
                  style={{
                    position: "absolute",
                    top: virtualRow.start,
                    left: 16 + colIndex * (itemWidth + gap), // Add 16px for left padding
                    width: itemWidth,
                    backgroundColor: color + "33", // 20% opacity hex
                    borderBottom: `2px solid ${color}`, // Underline style instead of full border
                  }}
                  data-tooltip={text}
                >
                  {tokenId}
                </span>
              );
            },
          )}
        </div>
      </div>

      {tokens.length > 0 && (
        <div className={styles.scrollIndicator}>
          {virtualRows[0]?.index * effectiveTokensPerRow + 1 || 0}-
          {Math.min(
            (virtualRows[virtualRows.length - 1]?.index + 1) *
              effectiveTokensPerRow,
            tokens.length,
          )}{" "}
          of {tokens.length} tokens
        </div>
      )}
    </div>
  );
}
