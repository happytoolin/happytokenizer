import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/components/VirtualizedInlineTokenDisplay.module.css";
import { TOKEN_COLORS } from "../../utils/tokenColors";
import { VIRTUAL_CONFIG } from "../../constants/virtual";

// "use no memo" directive to disable React Compiler for this component
/* @react-no-memo */

// Global canvas context cache - created once and reused
const measurementCanvas =
  typeof document !== "undefined" ? document.createElement("canvas") : null;
const measurementCtx = measurementCanvas
  ? measurementCanvas.getContext("2d")
  : null;

interface VirtualizedInlineTokenDisplayProps {
  tokens: number[];
  tokenTexts: string[];
  containerHeight: number;
}

interface LineInfo {
  tokens: Array<{
    id: number;
    tokenId: number;
    color: string;
    text: string;
  }>;
  startIndex: number;
  endIndex: number;
  height: number;
}

export function VirtualizedInlineTokenDisplay({
  tokens,
  tokenTexts,
  containerHeight,
}: VirtualizedInlineTokenDisplayProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [lineBreaks, setLineBreaks] = useState<LineInfo[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Use constants for configuration
  const CONSTANTS = {
    PADDING_X: VIRTUAL_CONFIG.INLINE.PADDING_X,
    BORDER: VIRTUAL_CONFIG.INLINE.BORDER,
    INNER_GAP: VIRTUAL_CONFIG.INLINE.INNER_GAP,
    TOKEN_GAP: VIRTUAL_CONFIG.INLINE.TOKEN_GAP,
    LINE_HEIGHT: VIRTUAL_CONFIG.INLINE.LINE_HEIGHT,
    DEFAULT_CHAR_WIDTH_ID: VIRTUAL_CONFIG.INLINE.DEFAULT_CHAR_WIDTH_ID,
    DEFAULT_CHAR_WIDTH_TEXT: VIRTUAL_CONFIG.INLINE.DEFAULT_CHAR_WIDTH_TEXT,
    DEBOUNCE_DELAY: VIRTUAL_CONFIG.INLINE.DEBOUNCE_DELAY,
    SCROLLBAR_PADDING: VIRTUAL_CONFIG.INLINE.SCROLLBAR_PADDING,
  };

  const measureLineBreaks = useCallback(() => {
    if (!parentRef.current || tokens.length === 0) {
      setLineBreaks([]);
      return;
    }

    const containerWidth = parentRef.current.clientWidth - VIRTUAL_CONFIG.INLINE.SCROLLBAR_PADDING;
    if (containerWidth <= 0) return;

    // 1. Calibrate Font Metrics (Fast, run once per measure)
    // Use cached canvas context for better performance
    let charWidthId = 5; // Type assertion needed for canvas measure
    let charWidthText = 8;

    if (measurementCtx) {
      try {
        // Measure ID font (10px)
        measurementCtx.font =
          '10px "JetBrains Mono", "Cascadia Code", "Fira Code", "SF Mono", "Consolas", "Menlo", "Monaco", "Courier New", "Noto Sans Mono SC", "Noto Sans Mono JP", "Noto Sans Mono KR", "Noto Sans Arabic", "Tahoma", "Arial Unicode MS", "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", monospace';
        const m1 = measurementCtx.measureText("0");
        if (m1.width > 0) charWidthId = m1.width;

        // Measure Text font (12px 500 weight)
        measurementCtx.font =
          '500 12px "JetBrains Mono", "Cascadia Code", "Fira Code", "SF Mono", "Consolas", "Menlo", "Monaco", "Courier New", "Noto Sans Mono SC", "Noto Sans Mono JP", "Noto Sans Mono KR", "Noto Sans Arabic", "Tahoma", "Arial Unicode MS", "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", monospace';
        const m2 = measurementCtx.measureText("M");
        if (m2.width > 0) charWidthText = m2.width;
      } catch (error) {
        console.error("Font measurement failed:", error);
        // Fallback to defaults if canvas fails
      }
    }

    // 2. Calculate Lines (Pure Math, No DOM)
    const lines: LineInfo[] = [];
    let currentLine: Array<{
      id: number;
      tokenId: number;
      color: string;
      text: string;
    }> = [];
    let currentLineWidth = 0;
    let currentLineStartIndex = 0;

    // Constant overhead per token: padding + border + inner gap between ID and Text
    const tokenBaseWidth =
      CONSTANTS.PADDING_X + CONSTANTS.BORDER + CONSTANTS.INNER_GAP;

    for (let i = 0; i < tokens.length; i++) {
      const tokenId = tokens[i];
      const color = TOKEN_COLORS[i % TOKEN_COLORS.length];

      let displayText = tokenTexts[i] || `[${tokenId}]`;

      // Clean up whitespace-only tokens for better display
      if (displayText.trim() === "") {
        displayText = `[${tokenId}]`;
      }

      // Truncate very long tokens for display
      if (displayText.length > VIRTUAL_CONFIG.TOKEN.MAX_DISPLAY_LENGTH) {
        displayText = displayText.substring(0, VIRTUAL_CONFIG.TOKEN.MAX_DISPLAY_LENGTH) + "...";
      }

      const item = { id: i, tokenId, color, text: displayText };

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
        endIndex: tokens.length - 1,
        height: CONSTANTS.LINE_HEIGHT,
      });
    }

    setLineBreaks(lines);
  }, [
    tokens,
    tokenTexts,
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

      // Wait after resize stops before recalculating
      timeoutId = setTimeout(() => {
        measureLineBreaks();
      }, VIRTUAL_CONFIG.INLINE.DEBOUNCE_DELAY);
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
    overscan: VIRTUAL_CONFIG.OVERSCAN.DEFAULT,
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
                      backgroundColor: item.color + VIRTUAL_CONFIG.TOKEN.COLOR_OPACITY,
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

      {tokens.length > 0 && lineBreaks.length > 0 && virtualItems.length > 0 && (
        <div className={styles.scrollIndicator}>
          {lineBreaks[virtualItems[0].index]?.startIndex + 1 || 1}-
          {Math.min(
            lineBreaks[virtualItems[virtualItems.length - 1].index]?.endIndex +
              1 || tokens.length,
            tokens.length,
          )}{" "}
          of {tokens.length} tokens
        </div>
      )}
    </div>
  );
}
