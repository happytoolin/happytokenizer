# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HappyTokenizer is an interactive web application that visualizes how different GPT/LLM models tokenize text in real-time. It helps developers understand AI context window optimization and token management for API cost optimization.

## Development Commands

```bash
# Development
pnpm dev          # Start Astro dev server with hot reload
pnpm build        # Production build with optimization
pnpm preview      # Local preview of production build

# Code Quality
pnpm typecheck    # TypeScript validation
pnpm lint         # ESLint with React and TypeScript rules
pnpm format       # Prettier code formatting

# Astro CLI
pnpm astro        # Direct access to Astro CLI commands
```

## Architecture Overview

### Technology Stack

- **Framework**: Astro with React 19 integration
- **Language**: TypeScript throughout
- **Styling**: Tailwind CSS v4 with custom design system
- **Tokenization**: OpenAI's official `gpt-tokenizer` library
- **Build Tool**: Vite (via Astro)
- **Deployment**: Cloudflare Pages (with Wrangler)
- **UI Components**: Radix UI primitives with custom styling
- **Performance**: Virtualized rendering with `@tanstack/react-virtual`

### Key Directory Structure

```
src/
├── components/
│   ├── react/          # Main React components
│   │   ├── TokenizerApp.tsx     # Main application component
│   │   ├── TokenDisplay.tsx     # Token visualization (inline/grid/detailed views)
│   │   ├── ChatTokenizer.tsx    # Chat mode tokenizer
│   │   └── Sidebar.tsx          # Model selection sidebar
│   └── ui/             # Reusable UI components (Dialog, Popover, etc.)
├── layouts/
│   └── MainLayout.astro # SEO-optimized base layout
├── pages/
│   ├── index.astro     # Main tokenizer page
│   ├── chat.astro      # Chat tokenizer page
│   └── models.astro    # Complete model manifest
├── utils/
│   ├── modelEncodings.ts    # Model configurations and mappings (60+ models)
│   ├── tokenUtils.ts        # Token calculation utilities
│   ├── contextLimits.ts     # Context window limits and pricing data
│   ├── constants.ts         # Sample texts and defaults
│   └── tokenColors.ts       # Token color management
├── hooks/
│   ├── useTokenizer.ts      # Core tokenization hook with Web Worker
│   └── useModelOptions.ts   # Model selection options
├── types/
│   └── chat.ts             # Chat message type definitions
└── workers/
    └── tokenizer.worker.ts # Web Worker for non-blocking tokenization
```

## Core Components & Patterns

### 1. TokenizerApp.tsx

Main application component that coordinates:

- Text input and file upload functionality
- Model selection via sidebar
- Tab state management (input vs upload)
- Integration with token display components

### 2. TokenDisplay.tsx

Renders tokens in three view modes:

- **Inline view**: Continuous text visualization
- **Grid view**: Compact token grid for large datasets
- **Detailed view**: List format with comprehensive token info

Uses virtualized rendering for performance with large token sets.

### 3. useTokenizer Hook

Core tokenization logic that:

- Manages Web Worker for non-blocking processing
- Provides 150ms debounced tokenization
- Handles progress tracking and error states
- Supports both text and chat message tokenization

### 4. Web Worker Pattern

All tokenization happens in `tokenizer.worker.ts` to:

- Prevent UI blocking during processing
- Handle chunking for large texts
- Support appropriate encoding strategies per model
- Process chat messages with proper formatting

### 5. Model Encodings System

`src/utils/modelEncodings.ts` contains:

- Comprehensive mapping of 60+ GPT models
- Categorization by encoding type (o200k_base, cl100k_base, p50k_base, etc.)
- Display names and utility functions
- Model groupings for organized selection

## Performance Optimizations

1. **Virtualized Rendering**: Large token sets use `@tanstack/react-virtual`
2. **Web Workers**: Tokenization runs in separate thread
3. **Debouncing**: 150ms delay on input to prevent excessive processing
4. **Chunk Processing**: Large texts processed in chunks with progress updates
5. **Error Boundaries**: Implemented for virtualized components

## Key Features

- Real-time token visualization with multiple view modes
- Support for 60+ GPT models across different encoding types
- Chat mode for message-based tokenization
- Cost estimation with real-time API cost calculations
- Context window awareness with usage indicators
- File upload support (txt, md, json, code files)
- Privacy-focused (all client-side processing)

## Design System

- **Theme**: Industrial utility aesthetic with orange accent
- **Fonts**: Archivo (display), Inter (body), JetBrains Mono (code)
- **Styling**: Tailwind CSS v4 with CSS-in-JS
- **Components**: Radix UI primitives with custom styling
- **Responsive**: Mobile-first design

## Important Files for Development

1. `src/utils/modelEncodings.ts` - Model configurations and mappings
2. `src/workers/tokenizer.worker.ts` - Core tokenization logic
3. `src/hooks/useTokenizer.ts` - Main tokenization hook
4. `src/components/react/TokenDisplay.tsx` - Token rendering with virtualization
5. `src/utils/contextLimits.ts` - Context window limits and pricing data
6. `astro.config.mjs` - Build configuration with Cloudflare adapter

## Development Notes

- Uses React 19 with the new JSX transform
- All styling is done with Tailwind CSS CSS-in-JS (no separate CSS files)
- Components are designed to be reusable and composable
- The application is fully client-side with no server-side dependencies
- Error boundaries are implemented for virtualized components
- Follows ESLint and TypeScript best practices throughout
- Package manager: pnpm (required for consistent lockfile)
