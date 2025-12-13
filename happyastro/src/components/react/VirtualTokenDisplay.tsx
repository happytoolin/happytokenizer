import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

// "use no memo" directive to disable React Compiler for this component
/* @react-no-memo */

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

  // eslint-disable-next-line react-hooks/incompatible-library
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
    <div className="virtual-display">
      <div
        ref={parentRef}
        className="virtual-list"
        style={{ height: containerHeight }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize() + 24}px`, // Add 24px top padding
            width: "100%",
            position: "relative",
            paddingTop: "24px",
          }}
        >
          {virtualItems.map((virtualItem) => {
            const item = items[virtualItem.index];
            return (
              <div
                key={virtualItem.key}
                className="virtual-item"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start + 24}px)`, // Add 24px for top padding
                  willChange: "transform", // Performance optimization
                }}
              >
                <div className="token-list-item">
                  {/* Mechanical color bar indicator */}
                  <div
                    className="token-color-indicator"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="token-info">
                    <span className="token-id">
                      {item.id + 1}. #{item.tokenId}
                    </span>
                    <span className="token-text">{item.text}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {items.length > 0 && virtualItems.length > 0 && (
        <div className="scroll-position-indicator">
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
