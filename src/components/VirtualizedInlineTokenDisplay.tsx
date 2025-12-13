import { useRef, useEffect, useState, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import styles from "./VirtualizedInlineTokenDisplay.module.css";

interface TokenItem {
  id: number;
  tokenId: number;
  color: string;
  text: string;
}

interface VirtualizedInlineTokenDisplayProps {
  items: TokenItem[];
  containerHeight: number;
}

interface LineInfo {
  tokens: TokenItem[];
  startIndex: number;
  endIndex: number;
  height: number;
}

export function VirtualizedInlineTokenDisplay({
  items,
  containerHeight,
}: VirtualizedInlineTokenDisplayProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [lineBreaks, setLineBreaks] = useState<LineInfo[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Measure tokens and calculate natural line breaks
  const measureLineBreaks = useCallback(() => {
    if (!measureRef.current || !parentRef.current || items.length === 0) {
      setLineBreaks([]);
      return;
    }

    const measureContainer = measureRef.current;
    const scrollContainer = parentRef.current;
    const containerWidth = scrollContainer.offsetWidth - 16; // Account for padding
    if (containerWidth <= 0) return;

    // Set width for measurement (matching scroll container padding)
    measureContainer.style.width = `${containerWidth}px`;

    // Clear and rebuild measurement tokens
    measureContainer.innerHTML = "";

    const tokenElements: HTMLElement[] = [];
    items.forEach((item) => {
      const tokenSpan = document.createElement("span");
      tokenSpan.className = styles.token;
      tokenSpan.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: 1px solid ${item.color};
        border-radius: 4px;
        padding: 6px 10px;
        font-size: 12px;
        font-weight: 500;
        background-color: ${item.color}20;
        white-space: nowrap;
        flex-shrink: 0;
      `;

      const tokenIdSpan = document.createElement("span");
      tokenIdSpan.className = styles.tokenId;
      tokenIdSpan.textContent = String(item.tokenId);
      tokenIdSpan.style.cssText =
        "opacity: 0.7; font-size: 10px; flex-shrink: 0;";

      const tokenTextSpan = document.createElement("span");
      tokenTextSpan.className = styles.tokenText;
      tokenTextSpan.textContent = item.text;
      tokenTextSpan.style.cssText =
        "white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;";

      tokenSpan.appendChild(tokenIdSpan);
      tokenSpan.appendChild(tokenTextSpan);
      measureContainer.appendChild(tokenSpan);
      tokenElements.push(tokenSpan);
    });

    // Force reflow to get accurate measurements
    void measureContainer.offsetHeight;

    // Calculate line breaks based on actual positions
    const lines: LineInfo[] = [];
    let currentLine: TokenItem[] = [];
    let currentLineStartIndex = 0;
    let currentTop = -1;
    let lineHeight = 0;

    tokenElements.forEach((tokenEl, index) => {
      const rect = tokenEl.getBoundingClientRect();
      const tokenTop = rect.top;

      if (currentTop === -1) {
        currentTop = tokenTop;
        lineHeight = rect.height;
      }

      // Check if token wrapped to a new line (with tolerance for rounding errors)
      if (Math.abs(tokenTop - currentTop) > 3) {
        // Token wrapped, save previous line
        if (currentLine.length > 0) {
          lines.push({
            tokens: currentLine,
            startIndex: currentLineStartIndex,
            endIndex: currentLineStartIndex + currentLine.length - 1,
            height: lineHeight,
          });
        }
        currentLine = [items[index]];
        currentLineStartIndex = index;
        currentTop = tokenTop;
        lineHeight = rect.height;
      } else {
        currentLine.push(items[index]);
        lineHeight = Math.max(lineHeight, rect.height);
      }
    });

    // Add the last line
    if (currentLine.length > 0) {
      lines.push({
        tokens: currentLine,
        startIndex: currentLineStartIndex,
        endIndex: currentLineStartIndex + currentLine.length - 1,
        height: lineHeight || 36,
      });
    }

    setLineBreaks(lines);
  }, [items]);

  // Set up ResizeObserver to recalculate on container resize
  useEffect(() => {
    if (!parentRef.current) return;

    resizeObserverRef.current = new ResizeObserver(() => {
      // Debounce measurements
      setTimeout(measureLineBreaks, 50);
    });

    resizeObserverRef.current.observe(parentRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [measureLineBreaks]);

  // Initial measurement and remeasure when items change
  useEffect(() => {
    measureLineBreaks();
  }, [measureLineBreaks]);

  // Use the same virtualization approach as detailed view but virtualize by calculated lines
  const virtualizer = useVirtualizer({
    count: lineBreaks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => lineBreaks[index]?.height || 36,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div className={styles.virtualContainer}>
      {/* Hidden measurement container */}
      <div ref={measureRef} className={styles.measureContainer} />

      <div
        ref={parentRef}
        className={styles.scrollContainer}
        style={{ height: containerHeight }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualItems.map((virtualItem) => {
            const lineInfo = lineBreaks[virtualItem.index];
            if (!lineInfo) return null;

            return (
              <div
                key={virtualItem.key}
                className={styles.tokenLine}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                {lineInfo.tokens.map((item) => (
                  <span
                    key={item.id}
                    className={styles.token}
                    style={{
                      backgroundColor: item.color + "20",
                      borderColor: item.color,
                    }}
                    title={`Token ${item.id + 1}: ${item.tokenId}`}
                  >
                    <span className={styles.tokenId}>{item.tokenId}</span>
                    <span className={styles.tokenText}>{item.text}</span>
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {items.length > 0 && lineBreaks.length > 0 && (
        <div className={styles.scrollIndicator}>
          {virtualItems[0]
            ? lineBreaks[virtualItems[0].index]?.startIndex + 1 || 0
            : 0}
          -
          {Math.min(
            lineBreaks[virtualItems[virtualItems.length - 1]?.index]?.endIndex +
              1 || items.length,
            items.length,
          )}{" "}
          of {items.length} tokens
        </div>
      )}
    </div>
  );
}
