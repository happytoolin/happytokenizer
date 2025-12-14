import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import { useMemo, useRef, useState, useEffect } from "react";
import styles from "../../styles/components/VirtualizedCompactTokenDisplay.module.css";

interface TokenItem {
  id: number;
  tokenId: number;
  color: string;
  text: string;
}

interface VirtualizedCompactTokenDisplayProps {
  items: TokenItem[];
  containerHeight: number;
  tokensPerRow: number;
  itemWidth: number;
  itemHeight: number;
  gap: number;
}

export function VirtualizedCompactTokenDisplay({
  items,
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

  const rowCount = Math.ceil(items.length / effectiveTokensPerRow);

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

  const visibleItems = useMemo(() => {
    const result: Array<{
      token: TokenItem;
      virtualRow: VirtualItem;
      colIndex: number;
    }> = [];

    virtualRows.forEach((virtualRow) => {
      const startIndex = virtualRow.index * effectiveTokensPerRow;
      const endIndex = Math.min(
        startIndex + effectiveTokensPerRow,
        items.length,
      );

      for (let i = startIndex; i < endIndex; i++) {
        result.push({
          token: items[i],
          virtualRow,
          colIndex: i - startIndex,
        });
      }
    });

    return result;
  }, [virtualRows, items, effectiveTokensPerRow]);

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
          {visibleItems.map(({ token, virtualRow, colIndex }) => (
            <span
              key={token.id}
              className={styles.compactToken}
              style={{
                position: "absolute",
                top: virtualRow.start,
                left: 16 + colIndex * (itemWidth + gap), // Add 16px for left padding
                width: itemWidth,
                backgroundColor: token.color + "33", // 20% opacity hex
                borderBottom: `2px solid ${token.color}`, // Underline style instead of full border
              }}
              data-tooltip={token.text}
            >
              {token.tokenId}
            </span>
          ))}
        </div>
      </div>

      {items.length > 0 && (
        <div className={styles.scrollIndicator}>
          {virtualRows[0]?.index * effectiveTokensPerRow + 1 || 0}-
          {Math.min(
            (virtualRows[virtualRows.length - 1]?.index + 1) *
              effectiveTokensPerRow,
            items.length,
          )}{" "}
          of {items.length} tokens
        </div>
      )}
    </div>
  );
}
