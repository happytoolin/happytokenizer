<div align="center">
  <img src="public/logo.svg" alt="HappyTokenizer Logo" width="120" height="120">

# HappyTokenizer

**Interactive GPT Tokenizer Visualization Tool**

[![Live Site](https://img.shields.io/badge/Live-Site-brightgreen)](https://happytokenizer.com)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Explore how different GPT models tokenize your text in real-time. Privacy-focused, client-side processing.

</div>

## Features

- **Real-time Visualization** - See your text being tokenized as you type
- **Multiple Model Support** - Compare tokenization across all OpenAI GPT models
- **Cost Optimization** - Understand token counts to optimize your API usage
- **Privacy First** - All processing happens in your browser, no data sent to servers
- **Lightning Fast** - Instant tokenization with OpenAI's official tiktoken library
- **Comprehensive Models** - Support for 60+ models including GPT-4o, GPT-3.5, and code models

## Why Tokenization Matters

When using OpenAI's API, you're charged **per token**, not per word. Understanding tokenization helps you:

- **Reduce API costs** by writing efficient prompts
- **Avoid hitting token limits** in your requests
- **Optimize model performance** by understanding how text is processed
- **Compare different models** for your specific use case

Example: "Hello, world!" might be:

- 3 tokens in GPT-4o
- 4 tokens in GPT-3.5-turbo
- This directly affects your API costs!

## Getting Started

### Quick Start

Visit [**happytokenizer.com**](https://happytokenizer.com) and start typing in the text area. That's it!

### Using the Tool

1. **Enter or paste your text** in the main text area
2. **Select a model** from the dropdown to see how it tokenizes your text
3. **View token breakdown** including token IDs and character mappings
4. **Compare models** to find the most cost-effective option for your needs

### Supported Models

#### Modern Models (o200k_base)

- GPT-4o series (gpt-4o, gpt-4o-mini, etc.)
- Latest OpenAI models with optimized encoding

#### Chat Models (cl100k_base)

- GPT-3.5 series (gpt-3.5-turbo, gpt-3.5-turbo-16k)
- GPT-4 series (gpt-4, gpt-4-32k)

#### Code Models (p50k_base)

- Code-davinci series
- Optimized for code generation

#### And Many More...

- Legacy models (r50k_base)
- Edit models (p50k_edit)
- Open-source models (o200k_harmony)

View the complete list at [happytokenizer.com/models](https://happytokenizer.com/models)

## For Developers

### Local Development

Want to run HappyTokenizer locally or contribute? Here's how:

```bash
# Clone the repository
git clone https://github.com/yourusername/happytokenizer.git
cd happytokenizer

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Tech Stack

- **Framework**: Astro with React
- **Styling**: Tailwind CSS with custom design system
- **Tokenization**: OpenAI's official [tiktoken](https://github.com/openai/tiktoken) library
- **Type Safety**: TypeScript throughout
- **Build Tool**: Vite

### Architecture

```
src/
├── components/
│   ├── react/          # React components with client-side logic
│   └── Footer.astro    # Footer component
├── layouts/
│   └── MainLayout.astro  # SEO-optimized base layout
├── pages/
│   ├── index.astro     # Main tokenizer page
│   └── models.astro    # Complete model manifest
└── utils/
    └── modelEncodings.ts  # Model configurations
```

## Privacy & Security

HappyTokenizer is designed with privacy as a core principle:

- **No data sent to servers** - All processing happens locally
- **No tracking or analytics** - Your data stays yours
- **Open source** - Transparent and auditable code
- **No cookies** - Zero tracking technologies

## Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test them
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Areas for Contribution

- **UI/UX improvements** - Better visualization ideas
- **Mobile enhancements** - Responsive design improvements
- **Performance** - Faster tokenization or loading
- **Documentation** - Better guides and examples
- **Bug fixes** - Report and fix issues

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for the [tiktoken](https://github.com/openai/tiktoken) library
- The Astro team for the amazing framework
- All contributors who help improve this tool

## Contact

- [Website](https://happytokenizer.com)
- [Issues](https://github.com/yourusername/happytokenizer/issues)
- [Discussions](https://github.com/yourusername/happytokenizer/discussions)

---

<div align="center">
  <sub>Built for the AI community</sub>
</div>
