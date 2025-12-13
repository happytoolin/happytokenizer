# HappyTokenizer - Models & Encodings Guide

HappyTokenizer now supports **148+ OpenAI models** across **6 different encodings**. Each model uses a specific Byte Pair Encoding (BPE) algorithm that affects how text is tokenized.

## Supported Encodings

| Encoding          | Models                       | Description                      |
| ----------------- | ---------------------------- | -------------------------------- |
| **o200k_base**    | GPT-4o, O1, O3, GPT-5, etc.  | Latest generation models (2024+) |
| **cl100k_base**   | GPT-3.5/4 Turbo, GPT-4       | Modern chat models               |
| **p50k_base**     | Text/Code Davinci series     | Completion models                |
| **p50k_edit**     | Edit models                  | Code/text editing models         |
| **r50k_base**     | Ada, Babbage, Curie, Davinci | Legacy models                    |
| **o200k_harmony** | GPT-OSS models               | Open source models               |

## Model Categories

### 🚀 Modern Models (o200k_base)

- **GPT-4o series**: Latest multimodal models
- **O1/O3 series**: Reasoning models
- **GPT-5 series**: Next generation models
- **ChatGPT-4o Latest**: Always latest version
- **GPT-4.1 series**: Advanced GPT-4 variants

### 💬 Chat Models (cl100k_base)

- **GPT-3.5 Turbo**: Standard chat model
- **GPT-4 series**: Advanced chat models
- **GPT-4 Turbo**: Faster variants
- **GPT-4-32k**: Extended context
- **GPT-3.5 Turbo Instruct**: Instruction following

### 🔧 Completion Models (p50k_base)

- **Text Davinci**: Text generation
- **Code Davinci**: Code generation
- **Cushman Codex**: Code completion

### ✏️ Edit Models (p50k_edit)

- **Text/Code Edit**: Text and code editing

### 🏛️ Legacy Models (r50k_base)

- **Original GPT series**: Ada, Babbage, Curie, Davinci
- **Text completion**: Original completion models

### 🔍 Search & Similarity (r50k_base)

- **Text Search**: Document search models
- **Text Similarity**: Similarity comparison models

### 🎵 Audio & Media (o200k_base)

- **Whisper**: Speech recognition
- **TTS**: Text-to-speech
- **DALL-E**: Image generation
- **GPT Audio**: Audio processing
- **Sora**: Video generation

### 🧪 Open Source (o200k_harmony)

- **GPT-OSS**: Open source alternatives

### 📊 Embeddings (cl100k_base)

- **Text Embedding**: Text vectorization models

### 🛡️ Moderation (o200k_base)

- **Content moderation**: Safety filtering models

## How Different Encodings Affect Tokenization

Different encodings can produce different token counts for the same text:

```text
"Hello, world!"
- o200k_base: 4 tokens
- cl100k_base: 4 tokens
- p50k_base: 5 tokens
- r50k_base: 6 tokens
```

This affects:

- **Token costs**: Different pricing per encoding
- **Context window limits**: Different maximum token limits
- **Performance**: Encoding/decoding speed
- **Accuracy**: How well the model understands the text

## Usage

1. Select a model from the dropdown
2. The app automatically detects the encoding
3. Tokenization uses the appropriate encoder
4. Individual token texts are decoded using the same encoding

## Technical Details

The application uses the [gpt-tokenizer](https://github.com/niieani/gpt-tokenizer) library which supports all major OpenAI encodings. Each model is mapped to its correct encoding based on the official model specifications from the `models_sample` directory.

### Adding New Models

New models can be added by:

1. Adding them to `src/models/modelEncodings.ts`
2. Specifying their encoding type
3. Updating the UI dropdown if needed

The mapping is based on the source template found in each model's `.ts` file in the `models_sample` directory.
