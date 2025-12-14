/**
 * Configuration constants for virtualized token display components
 */

export const VIRTUAL_CONFIG = {
  // Container and scrolling
  CONTAINER_HEIGHT: 400,

  // Virtual scrolling performance
  OVERSCAN: {
    DEFAULT: 5,
    DETAILED: 10, // More for detailed view to prevent flickers
  },

  // VirtualizedInlineTokenDisplay constants
  INLINE: {
    PADDING_X: 8,
    BORDER: 0,
    INNER_GAP: 4,
    TOKEN_GAP: 2,
    LINE_HEIGHT: 32,
    DEFAULT_CHAR_WIDTH_ID: 5,
    DEFAULT_CHAR_WIDTH_TEXT: 8,
    DEBOUNCE_DELAY: 100, // for resize observer
    SCROLLBAR_PADDING: 16, // safety margin for scrollbar/padding
  },

  // VirtualizedCompactTokenDisplay constants
  COMPACT: {
    TOKENS_PER_ROW: 32, // default, will be dynamically calculated
    ITEM_WIDTH: 48,
    ITEM_HEIGHT: 32,
    GAP: 4,
    HORIZONTAL_PADDING: 32, // 16px on each side
  },

  // VirtualTokenDisplay constants
  DETAILED: {
    ITEM_HEIGHT: 40,
    TOP_PADDING: 24,
  },

  // Tokenization worker constants
  WORKER: {
    CHUNK_SIZE: 20000, // Size of text chunks for processing
    CHUNK_THRESHOLD: 20000, // Threshold to enable chunking
    BATCH_SIZE: 50, // Number of chunks to process per batch
    DEBOUNCE_DELAY: 150,
    PROGRESS_UPDATES: 5, // Max progress updates per tokenization
  },

  // Token display
  TOKEN: {
    MAX_DISPLAY_LENGTH: 30,
    COLOR_OPACITY: "33", // 20% opacity as hex
  },
} as const;

// Type exports for better TypeScript support
export type VirtualConfig = typeof VIRTUAL_CONFIG;