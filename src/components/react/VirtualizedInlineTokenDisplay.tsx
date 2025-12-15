import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/components/VirtualizedInlineTokenDisplay.module.css";
import { TOKEN_COLORS } from "../../utils/tokenColors";

/* @react-no-memo */

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

  const PADDING_X = 8;
  const BORDER = 0;
  const INNER_GAP = 4;
  const TOKEN_GAP = 2;
  const LINE_HEIGHT = 32;
  const DEFAULT_CHAR_WIDTH_ID = 5;
  const DEFAULT_CHAR_WIDTH_TEXT = 8;

  const measureLineBreaks = useCallback(() => {
    if (!parentRef.current || tokens.length === 0) {
      setLineBreaks([]);
      return;
    }

    const containerWidth = parentRef.current.clientWidth - 16;
    if (containerWidth <= 0) return;

    let charWidthId = DEFAULT_CHAR_WIDTH_ID;
    let charWidthText = DEFAULT_CHAR_WIDTH_TEXT;

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.font = '10px "JetBrains Mono", monospace';
        const m1 = ctx.measureText("0");
        if (m1.width > 0) charWidthId = m1.width;

        ctx.font = '500 12px "JetBrains Mono", monospace';
        const m2 = ctx.measureText("M");
        if (m2.width > 0) charWidthText = m2.width;
      }
    } catch (error) {
      console.error("Font measurement failed:", error);
    }

    const lines: LineInfo[] = [];
    let currentLine: Array<{
      id: number;
      tokenId: number;
      color: string;
      text: string;
    }> = [];
    let currentLineWidth = 0;
    let currentLineStartIndex = 0;

    const tokenBaseWidth = PADDING_X + BORDER + INNER_GAP;

    for (let i = 0; i < tokens.length; i++) {
      const tokenId = tokens[i];
      const color = TOKEN_COLORS[i % TOKEN_COLORS.length];

      let displayText = tokenTexts[i] || `[${tokenId}]`;

      if (displayText.trim() === "") {
        displayText = `[${tokenId}]`;
      }

      if (displayText.length > 20) {
        displayText = displayText.substring(0, 20) + "...";
      }

      const item = { id: i, tokenId, color, text: displayText };

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
      const textWidth = item.text.length * charWidthText;
      const itemWidth = Math.ceil(tokenBaseWidth + idWidth + textWidth);
      const gap = currentLine.length > 0 ? TOKEN_GAP : 0;

      if (
        currentLine.length > 0 &&
        currentLineWidth + gap + itemWidth > containerWidth
      ) {
        lines.push({
          tokens: currentLine,
          startIndex: currentLineStartIndex,
          endIndex: i - 1,
          height: LINE_HEIGHT,
        });

        currentLine = [item];
        currentLineWidth = itemWidth;
        currentLineStartIndex = i;
      } else {
        currentLine.push(item);
        currentLineWidth += gap + itemWidth;
      }
    }

    if (currentLine.length > 0) {
      lines.push({
        tokens: currentLine,
        startIndex: currentLineStartIndex,
        endIndex: tokens.length - 1,
        height: LINE_HEIGHT,
      });
    }

    setLineBreaks(lines);
  }, [tokens, tokenTexts]);

  useEffect(() => {
    if (!parentRef.current) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    resizeObserverRef.current = new ResizeObserver(() => {
      if (timeoutId) clearTimeout(timeoutId);
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

  useEffect(() => {
    const timer = setTimeout(measureLineBreaks, 0);
    return () => clearTimeout(timer);
  }, [measureLineBreaks]);

  const rowVirtualizer = useVirtualizer({
    count: lineBreaks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => LINE_HEIGHT,
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
                  willChange: "transform",
                }}
              >
                {line.tokens.map((item) => (
                  <span
                    key={item.id}
                    className={styles.token}
                    style={{
                      backgroundColor: item.color + "33",
                      borderBottom: `2px solid ${item.color}`,
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

      {tokens.length > 0 &&
        lineBreaks.length > 0 &&
        virtualItems.length > 0 && (
          <div className={styles.scrollIndicator}>
            {lineBreaks[virtualItems[0].index]?.startIndex + 1 || 1}-
            {Math.min(
              lineBreaks[virtualItems[virtualItems.length - 1].index]
                ?.endIndex + 1 || tokens.length,
              tokens.length,
            )}{" "}
            of {tokens.length} tokens
          </div>
        )}
    </div>
  );
}
