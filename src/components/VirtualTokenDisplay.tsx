import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import styles from "./VirtualTokenDisplay.module.css";

interface TokenItem {
  id: number;
  tokenId: number;
  color: string;
  text: string;
}

interface VirtualTokenDisplayProps {
  items: TokenItem[];
  containerHeight: number;
  estimatedItemHeight: number;
}

export function VirtualTokenDisplay({
  items,
  containerHeight,
  estimatedItemHeight,
}: VirtualTokenDisplayProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedItemHeight,
    // Overscan determines how many items to render outside the visible area.
    // Increasing this slightly (e.g., to 10) prevents white flickers during fast scrolling.
    overscan: 10,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div className={styles.virtualContainer}>
      <div
        ref={parentRef}
        className={styles.scrollContainer}
        style={{ height: containerHeight }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualItems.map((virtualItem) => {
            const item = items[virtualItem.index];
            return (
              <div
                key={virtualItem.key}
                className={styles.tokenItem}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                  willChange: "transform", // Performance optimization
                }}
              >
                <span
                  className={styles.token}
                  style={{
                    backgroundColor: item.color + "20",
                    borderColor: item.color,
                  }}
                >
                  <span className={styles.tokenId}>{item.tokenId}</span>
                  <span className={styles.tokenText}>{item.text}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {items.length > 0 && virtualItems.length > 0 && (
        <div className={styles.scrollIndicator}>
          {virtualItems[0].index + 1}-
          {Math.min(
            virtualItems[virtualItems.length - 1].index + 1,
            items.length,
          )}{" "}
          of {items.length} tokens
        </div>
      )}
    </div>
  );
}
