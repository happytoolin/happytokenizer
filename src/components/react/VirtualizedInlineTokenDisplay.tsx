import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/components/VirtualizedInlineTokenDisplay.module.css";

// "use no memo" directive to disable React Compiler for this component
/* @react-no-memo */

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
  const [lineBreaks, setLineBreaks] = useState<LineInfo[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Update Constants for the new font sizes and tighter layout
  const CONSTANTS = {
    PADDING_X: 8, // Tighter padding
    BORDER: 0,
    INNER_GAP: 4,
    TOKEN_GAP: 2,
    LINE_HEIGHT: 32, // Tighter lines for "Code Editor" feel
    DEFAULT_CHAR_WIDTH_ID: 5,
    DEFAULT_CHAR_WIDTH_TEXT: 8,
  };

  const measureLineBreaks = useCallback(() => {
    if (!parentRef.current || items.length === 0) {
      setLineBreaks([]);
      return;
    }

    const containerWidth = parentRef.current.clientWidth - 16; // Subtract scrollbar/padding safety
    if (containerWidth <= 0) return;

    // 1. Calibrate Font Metrics (Fast, run once per measure)
    // We create a temporary canvas to get the EXACT width of a character
    // since we are using a Monospace font.
    let charWidthId = CONSTANTS.DEFAULT_CHAR_WIDTH_ID;
    let charWidthText = CONSTANTS.DEFAULT_CHAR_WIDTH_TEXT;

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Measure ID font (10px)
        ctx.font =
          '10px "JetBrains Mono", "Cascadia Code", "Fira Code", "SF Mono", "Consolas", "Menlo", "Monaco", "Courier New", "Noto Sans Mono SC", "Noto Sans Mono JP", "Noto Sans Mono KR", "Noto Sans Arabic", "Tahoma", "Arial Unicode MS", "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", monospace';
        const m1 = ctx.measureText("0");
        if (m1.width > 0) charWidthId = m1.width;

        // Measure Text font (12px 500 weight)
        ctx.font =
          '500 12px "JetBrains Mono", "Cascadia Code", "Fira Code", "SF Mono", "Consolas", "Menlo", "Monaco", "Courier New", "Noto Sans Mono SC", "Noto Sans Mono JP", "Noto Sans Mono KR", "Noto Sans Arabic", "Tahoma", "Arial Unicode MS", "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", monospace';
        const m2 = ctx.measureText("M");
        if (m2.width > 0) charWidthText = m2.width;
      }
    } catch (error) {
      console.error("Font measurement failed:", error);
      // Fallback to defaults if canvas fails
    }

    // 2. Calculate Lines (Pure Math, No DOM)
    const lines: LineInfo[] = [];
    let currentLine: TokenItem[] = [];
    let currentLineWidth = 0;
    let currentLineStartIndex = 0;

    // Constant overhead per token: padding + border + inner gap between ID and Text
    const tokenBaseWidth =
      CONSTANTS.PADDING_X + CONSTANTS.BORDER + CONSTANTS.INNER_GAP;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Calculate ID width: number of digits * char width
      // Optimization: Get digit count without converting to string for small numbers
      const idDigits =
        item.tokenId < 10
          ? 1
          : item.tokenId < 100
            ? 2
            : item.tokenId < 1000
              ? 3
              : item.tokenId < 10000
                ? 4
                : item.tokenId < 100000
                  ? 5
                  : 6;

      const idWidth = idDigits * charWidthId;

      // Calculate Text width: char length * char width
      // item.text is already truncated to max 15 chars + "..." in TokenDisplay
      const textWidth = item.text.length * charWidthText;

      // Total token width
      // We use Math.ceil to avoid sub-pixel rounding issues causing wrap early
      const itemWidth = Math.ceil(tokenBaseWidth + idWidth + textWidth);

      // Check if adding this token exceeds container width
      // Note: First item in a line is always added even if it's too wide
      const gap = currentLine.length > 0 ? CONSTANTS.TOKEN_GAP : 0;

      if (
        currentLine.length > 0 &&
        currentLineWidth + gap + itemWidth > containerWidth
      ) {
        // Wrap to new line
        lines.push({
          tokens: currentLine,
          startIndex: currentLineStartIndex,
          endIndex: i - 1,
          height: CONSTANTS.LINE_HEIGHT,
        });

        currentLine = [item];
        currentLineWidth = itemWidth;
        currentLineStartIndex = i;
      } else {
        // Add to current line
        currentLine.push(item);
        currentLineWidth += gap + itemWidth;
      }
    }

    // Add the final line
    if (currentLine.length > 0) {
      lines.push({
        tokens: currentLine,
        startIndex: currentLineStartIndex,
        endIndex: items.length - 1,
        height: CONSTANTS.LINE_HEIGHT,
      });
    }

    setLineBreaks(lines);
  }, [
    items,
    CONSTANTS.PADDING_X,
    CONSTANTS.BORDER,
    CONSTANTS.INNER_GAP,
    CONSTANTS.TOKEN_GAP,
    CONSTANTS.LINE_HEIGHT,
    CONSTANTS.DEFAULT_CHAR_WIDTH_ID,
    CONSTANTS.DEFAULT_CHAR_WIDTH_TEXT,
  ]);

  // Handle Resize with Debounce
  useEffect(() => {
    if (!parentRef.current) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    resizeObserverRef.current = new ResizeObserver(() => {
      // Clear existing timeout to debounce
      if (timeoutId) clearTimeout(timeoutId);

      // Wait 100ms after resize stops before recalculating
      timeoutId = setTimeout(() => {
        measureLineBreaks();
      }, 100);
    });

    resizeObserverRef.current.observe(parentRef.current);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [measureLineBreaks]);

  // Initial measurement
  useEffect(() => {
    // Small delay to ensure container has rendered width
    const timer = setTimeout(measureLineBreaks, 0);
    return () => clearTimeout(timer);
  }, [measureLineBreaks]);

  const rowVirtualizer = useVirtualizer({
    count: lineBreaks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CONSTANTS.LINE_HEIGHT,
    overscan: 5,
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
            const line = lineBreaks[virtualItem.index];
            if (!line) return null;

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
                  // optimization: hint browser for GPU layering
                  willChange: "transform",
                }}
              >
                {line.tokens.map((item) => (
                  <span
                    key={item.id}
                    className={styles.token}
                    style={{
                      // Use background opacity for the "Highlighter" effect
                      backgroundColor: item.color + "33", // 20% opacity hex
                      borderBottom: `2px solid ${item.color}`, // Underline style instead of full border
                    }}
                    data-tooltip={`ID: ${item.tokenId}`}
                  >
                    <span className={styles.tokenId}>{item.tokenId}</span>
                    {item.text}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {items.length > 0 && lineBreaks.length > 0 && virtualItems.length > 0 && (
        <div className={styles.scrollIndicator}>
          {lineBreaks[virtualItems[0].index]?.startIndex + 1 || 1}-
          {Math.min(
            lineBreaks[virtualItems[virtualItems.length - 1].index]?.endIndex +
              1 || items.length,
            items.length,
          )}{" "}
          of {items.length} tokens
        </div>
      )}
    </div>
  );
}
