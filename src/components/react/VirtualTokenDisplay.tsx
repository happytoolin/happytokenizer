import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useEffect } from "react";
import styles from "../../styles/components/VirtualTokenDisplay.module.css";
import { TOKEN_COLORS } from "../../utils/tokenColors";
import { VIRTUAL_CONFIG } from "../../constants/virtual";

// "use no memo" directive to disable React Compiler for this component
/* @react-no-memo */

interface VirtualTokenDisplayProps {
  tokens: number[];
  tokenTexts: string[];
  containerHeight: number;
  estimatedItemHeight: number;
}

export function VirtualTokenDisplay({
  tokens,
  tokenTexts,
  containerHeight,
  estimatedItemHeight,
}: VirtualTokenDisplayProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Add cleanup for any potential async operations
  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: tokens.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedItemHeight,
    // Overscan determines how many items to render outside the visible area.
    // Increasing this slightly prevents white flickers during fast scrolling.
    overscan: VIRTUAL_CONFIG.OVERSCAN.DETAILED,
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
            height: `${rowVirtualizer.getTotalSize() + VIRTUAL_CONFIG.DETAILED.TOP_PADDING}px`,
            width: "100%",
            position: "relative",
            paddingTop: `${VIRTUAL_CONFIG.DETAILED.TOP_PADDING}px`,
          }}
        >
          {virtualItems.map((virtualItem) => {
            const index = virtualItem.index;
            const tokenId = tokens[index];
            const color = TOKEN_COLORS[index % TOKEN_COLORS.length];

            let displayText = tokenTexts[index] || `[${tokenId}]`;

            // Clean up whitespace-only tokens for better display
            if (displayText.trim() === "") {
              displayText = `[${tokenId}]`;
            }

            // Truncate very long tokens for display
            if (displayText.length > VIRTUAL_CONFIG.TOKEN.MAX_DISPLAY_LENGTH) {
              displayText = displayText.substring(0, VIRTUAL_CONFIG.TOKEN.MAX_DISPLAY_LENGTH) + "...";
            }

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
                  transform: `translateY(${virtualItem.start + VIRTUAL_CONFIG.DETAILED.TOP_PADDING}px)`,
                  willChange: "transform", // Performance optimization
                }}
              >
                <div className={styles.token}>
                  {/* Mechanical color bar indicator */}
                  <div
                    className={styles.colorIndicator}
                    style={{ backgroundColor: color }}
                  />
                  <span className={styles.tokenId}>
                    {index + 1}. #{tokenId}
                  </span>
                  <span className={styles.tokenText}>{displayText}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {tokens.length > 0 && virtualItems.length > 0 && (
        <div className={styles.scrollIndicator}>
          {virtualItems[0].index + 1}-
          {Math.min(
            virtualItems[virtualItems.length - 1].index + 1,
            tokens.length,
          )}{" "}
          of {tokens.length} tokens
        </div>
      )}
    </div>
  );
}
