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

  const [containerWidth, setContainerWidth] = useState(0);

  const effectiveTokensPerRow =
    containerWidth > 0
      ? Math.floor((containerWidth - 32 - gap) / (itemWidth + gap))
      : tokensPerRow;

  const rowCount = Math.ceil(tokens.length / effectiveTokensPerRow);

  useEffect(() => {
    const container = parentRef.current;
    if (!container) return;

    const updateWidth = () => {
      setContainerWidth(container.clientWidth);
    };

    updateWidth();

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
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  const getTokenData = (index: number) => {
    const tokenId = tokens[index];
    const color = TOKEN_COLORS[index % TOKEN_COLORS.length];

    let displayText = tokenTexts[index] || `[${tokenId}]`;

    if (displayText.trim() === "") {
      displayText = `[${tokenId}]`;
    }

    if (displayText.length > 20) {
      displayText = displayText.substring(0, 20) + "...";
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
  }, [virtualRows, tokens, effectiveTokensPerRow]);

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
            ({ tokenId, color, text, virtualRow, colIndex }) => {
              const tokenIndex =
                virtualRow.index * effectiveTokensPerRow + colIndex;
              return (
                <span
                  key={tokenIndex}
                  className={styles.compactToken}
                  style={{
                    position: "absolute",
                    top: virtualRow.start,
                    left: 16 + colIndex * (itemWidth + gap),
                    width: itemWidth,
                    backgroundColor: color + "33",
                    borderBottom: `2px solid ${color}`,
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
