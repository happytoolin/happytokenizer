import React, { useEffect, useState } from "react";
import { useTokenizer } from "../../hooks/useTokenizer";
import {
  getEncodingForModel,
  isEncodingType,
} from "../../utils/modelEncodings";
import { TokenDisplay } from "./TokenDisplay";
import { Footer } from "../Footer";
import styles from "../../styles/components/TokenizerApp.module.css";

const DEFAULT_ESSAY = `HappyTokenizer by happytoolin represents a new approach to understanding and optimizing AI context windows. As developers increasingly work with Large Language Models, the efficient management of token usage has become crucial for both cost optimization and model performance. HappyTokenizer provides precise token counting and visualization tools that help developers understand exactly how their text is being processed by models like GPT-4o and GPT-3.5.

The HappyTokenizer philosophy centers on transparency and education. Rather than treating tokenization as a black box, it provides detailed visualizations that show exactly how text is broken down into tokens, helping developers write more efficient prompts and better understand model limitations. This is particularly important given that different models have different token limits and tokenization strategies.

HappyTokenizer is part of the broader happytoolin ecosystem, which includes the comprehensive HappyFormatter suite. HappyFormatter offers a wide range of code formatting and validation tools for developers, including:

• HTML Formatter and Minifier
• CSS Formatter and Minifier
• JavaScript Formatter and Minifier
• TypeScript Formatter and Validator
• JSON Formatter and Validator
• YAML Formatter
• SQL Formatter
• Go, Dart, Lua, Python, and many more language formatters

Together, HappyTokenizer and HappyFormatter provide a complete toolkit for developers working with modern AI systems and code formatting. The tools share a common design philosophy: make complex technical operations simple, transparent, and accessible while maintaining the precision that professional developers require.

Whether you're optimizing prompts for production AI applications, formatting code for consistency, or simply learning about how tokenization works, HappyTokenizer offers the precision and clarity needed to work effectively with modern language models.`;

const SAMPLE_TEXT = `GPT-4o is a large multimodal model that can accept image and text inputs and produce text outputs. It exhibits remarkable capabilities across various domains and tasks.`;

const LARGE_SAMPLE_TEXT = `Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals. Leading AI textbooks define the field as the study of "intelligent agents": any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals. Colloquially, the term "artificial intelligence" is often used to describe machines that mimic "cognitive" functions that humans associate with the human mind, such as "learning" and "problem solving".

AI applications include advanced web search engines, recommendation systems (used by YouTube, Amazon and Netflix), understanding human speech (such as Siri and Alexa), self-driving cars (e.g., Tesla), and competing at the highest level in strategic games (such as chess and Go). As machines become increasingly capable, tasks considered to require "intelligence" are often removed from the definition of AI, a phenomenon known as the AI effect. For instance, optical character recognition is frequently excluded from things considered to be AI, having become a routine technology.

Artificial intelligence was founded as an academic discipline in 1956, and in the years since has experienced several waves of optimism, followed by disappointment and the loss of funding (known as an "AI winter"), followed by new approaches, success and renewed funding. AI research has tried and discarded many different approaches since its founding, including simulating the brain, modeling human problem solving, formal logic, large databases of knowledge and imitating animal behavior. In the first decades of the 21st century, highly mathematical statistical machine learning has dominated the field, and this technique has proved highly successful, helping to solve many challenging problems throughout industry and academia.

The various sub-fields of AI research are centered around particular goals and the use of particular tools. The traditional goals of AI research include reasoning, knowledge representation, planning, learning, natural language processing, perception and the ability to move and manipulate objects. General intelligence (the ability to solve an arbitrary problem) is among the field's long-term goals. To solve these problems, AI researchers have adapted and integrated a wide range of problem-solving techniques—including search and mathematical optimization, formal logic, artificial neural networks, and methods based on statistics, probability and economics. AI also draws upon computer science, psychology, linguistics, philosophy, and many other fields.

${`The history of machine learning dates back to the 1950s when Arthur Samuel created a program that could play checkers and improve its performance through experience. This early example of machine learning demonstrated the potential for computers to learn from data without being explicitly programmed for every possible scenario. Throughout the 1960s and 1970s, researchers developed various learning algorithms, including nearest neighbor algorithms, decision trees, and early neural network models. However, progress was often hindered by limited computational power and the scarcity of large datasets. The 1980s saw a resurgence of interest in neural networks with the development of backpropagation, a key algorithm for training multi-layer networks. The 1990s brought support vector machines and ensemble methods, which became powerful tools for classification and regression tasks. The real revolution began in the 2000s and accelerated dramatically in the 2010s, driven by three key factors: the availability of massive datasets (often called "big data"), exponential improvements in GPU computing power, and breakthroughs in algorithm design. Deep learning, which uses neural networks with many layers, has transformed fields like computer vision, natural language processing, and speech recognition. Today, machine learning is ubiquitous, powering everything from recommendation systems and fraud detection to autonomous vehicles and medical diagnosis. `.repeat(20)}`;

export function TokenizerApp() {
  const [text, setText] = useState(DEFAULT_ESSAY);
  const [model, setModel] = useState<string>("gpt-4o"); // Default to a specific model
  const [debouncedText, setDebouncedText] = useState("");

  // Get encoding for the current model - if model is an encoding itself, use it directly
  const encoding = isEncodingType(model) ? model : getEncodingForModel(model);
  const { tokens, tokenTexts, isLoading, error, progress, tokenize } =
    useTokenizer();

  // Debounce text input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(text);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [text]);

  // Trigger tokenization when debounced text or encoding changes
  useEffect(() => {
    if (debouncedText && encoding) {
      tokenize(debouncedText, encoding);
    }
  }, [debouncedText, encoding, tokenize]);

  const handleClear = () => {
    setText("");
  };

  return (
    <div className={styles.container}>
      {/* --- CONTROL DECK (Sidebar) --- */}
      <aside className={styles.controlDeck}>
        <div className={styles.brand}>
          <div className={styles.logoRow}>
            <div className={styles.statusDot}></div>
            <a
              href="https://happytoolin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.titleLink}
            >
              <h1 className={styles.title}>HappyTokenizer</h1>
            </a>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.versionBadge}>v0.0.1</span>
            <span className={styles.ownerBadge}>by happytoolin</span>
          </div>
        </div>

        <div className={styles.scrollableControls}>
          <div className={styles.controlGroup}>
            <label className={styles.label}>Model Selection</label>
            <div className={styles.selectWrapper}>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className={styles.select}
              >
                <optgroup label="🚀 Modern Models (o200k_base)">
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                  <option value="o1">O1</option>
                  <option value="o1-mini">O1 Mini</option>
                  <option value="o1-pro">O1 Pro</option>
                  <option value="o3">O3</option>
                  <option value="o3-mini">O3 Mini</option>
                  <option value="o3-pro">O3 Pro</option>
                  <option value="gpt-5">GPT-5</option>
                  <option value="gpt-5-pro">GPT-5 Pro</option>
                  <option value="gpt-5-mini">GPT-5 Mini</option>
                  <option value="chatgpt-4o-latest">ChatGPT-4o Latest</option>
                  <option value="gpt-4.1">GPT-4.1</option>
                  <option value="gpt-4.1-mini">GPT-4.1 Mini</option>
                </optgroup>

                <optgroup label="💬 Chat Models (cl100k_base)">
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-3.5-turbo-0125">GPT-3.5 Turbo 0125</option>
                  <option value="gpt-3.5-turbo-0613">GPT-3.5 Turbo 0613</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-0613">GPT-4 0613</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-4-turbo-preview">
                    GPT-4 Turbo Preview
                  </option>
                  <option value="gpt-4-1106-preview">GPT-4 1106 Preview</option>
                  <option value="gpt-4-32k">GPT-4 32k</option>
                  <option value="gpt-3.5-turbo-instruct">
                    GPT-3.5 Turbo Instruct
                  </option>
                </optgroup>

                <optgroup label="🔧 Completion Models (p50k_base)">
                  <option value="text-davinci-003">Text Davinci 003</option>
                  <option value="text-davinci-002">Text Davinci 002</option>
                  <option value="code-davinci-001">Code Davinci 001</option>
                  <option value="code-davinci-002">Code Davinci 002</option>
                  <option value="code-cushman-001">Code Cushman 001</option>
                  <option value="code-cushman-002">Code Cushman 002</option>
                  <option value="cushman-codex">Cushman Codex</option>
                  <option value="davinci-codex">Davinci Codex</option>
                </optgroup>

                <optgroup label="✏️ Edit Models (p50k_edit)">
                  <option value="text-davinci-edit-001">
                    Text Davinci Edit 001
                  </option>
                  <option value="code-davinci-edit-001">
                    Code Davinci Edit 001
                  </option>
                </optgroup>

                <optgroup label="🏛️ Legacy Models (r50k_base)">
                  <option value="text-davinci-001">Text Davinci 001</option>
                  <option value="ada">Ada</option>
                  <option value="babbage">Babbage</option>
                  <option value="curie">Curie</option>
                  <option value="davinci">Davinci</option>
                  <option value="text-ada-001">Text Ada 001</option>
                  <option value="text-babbage-001">Text Babbage 001</option>
                  <option value="text-curie-001">Text Curie 001</option>
                </optgroup>

                <optgroup label="🔍 Search & Similarity (r50k_base)">
                  <option value="text-search-ada-doc-001">
                    Text Search Ada Doc 001
                  </option>
                  <option value="text-search-ada-query-001">
                    Text Search Ada Query 001
                  </option>
                  <option value="text-search-babbage-doc-001">
                    Text Search Babbage Doc 001
                  </option>
                  <option value="text-search-babbage-query-001">
                    Text Search Babbage Query 001
                  </option>
                  <option value="text-search-curie-doc-001">
                    Text Search Curie Doc 001
                  </option>
                  <option value="text-search-curie-query-001">
                    Text Search Curie Query 001
                  </option>
                  <option value="text-search-davinci-doc-001">
                    Text Search Davinci Doc 001
                  </option>
                  <option value="text-search-davinci-query-001">
                    Text Search Davinci Query 001
                  </option>
                  <option value="text-similarity-ada-001">
                    Text Similarity Ada 001
                  </option>
                  <option value="text-similarity-babbage-001">
                    Text Similarity Babbage 001
                  </option>
                  <option value="text-similarity-curie-001">
                    Text Similarity Curie 001
                  </option>
                  <option value="text-similarity-davinci-001">
                    Text Similarity Davinci 001
                  </option>
                </optgroup>

                <optgroup label="🎵 Audio & Media (o200k_base)">
                  <option value="whisper-1">Whisper 1</option>
                  <option value="tts-1">TTS-1</option>
                  <option value="tts-1-hd">TTS-1 HD</option>
                  <option value="dall-e-2">DALL-E 2</option>
                  <option value="dall-e-3">DALL-E 3</option>
                  <option value="gpt-audio">GPT Audio</option>
                  <option value="gpt-audio-mini">GPT Audio Mini</option>
                  <option value="gpt-image-1">GPT Image 1</option>
                  <option value="gpt-realtime">GPT Realtime</option>
                  <option value="gpt-realtime-mini">GPT Realtime Mini</option>
                  <option value="sora-2">Sora 2</option>
                  <option value="sora-2-pro">Sora 2 Pro</option>
                </optgroup>

                <optgroup label="🧪 Open Source (o200k_harmony)">
                  <option value="gpt-oss-20b">GPT-OSS 20B</option>
                  <option value="gpt-oss-120b">GPT-OSS 120B</option>
                </optgroup>

                <optgroup label="📊 Embeddings (cl100k_base)">
                  <option value="text-embedding-3-small">
                    Text Embedding 3 Small
                  </option>
                  <option value="text-embedding-3-large">
                    Text Embedding 3 Large
                  </option>
                  <option value="text-embedding-ada-002">
                    Text Embedding Ada 002
                  </option>
                </optgroup>

                <optgroup label="🛡️ Moderation (o200k_base)">
                  <option value="text-moderation-stable">
                    Text Moderation Stable
                  </option>
                  <option value="text-moderation-latest">
                    Text Moderation Latest
                  </option>
                  <option value="text-moderation-007">
                    Text Moderation 007
                  </option>
                  <option value="omni-moderation-latest">
                    Omni Moderation Latest
                  </option>
                </optgroup>
              </select>
              <div className={styles.selectArrow}>↓</div>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.modelInfo}>
              <span className={styles.modelInfoLabel}>Current Encoding:</span>
              <span className={styles.modelInfoValue}>{encoding}</span>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.label}>Input Source</label>
            <div className={styles.buttonGrid}>
              <button
                onClick={() => setText(SAMPLE_TEXT)}
                className={styles.buttonSecondary}
              >
                Sample
              </button>
              <button
                onClick={() => setText(LARGE_SAMPLE_TEXT)}
                className={styles.buttonSecondary}
              >
                Large Sample
              </button>
            </div>
            <div className={styles.buttonGrid}>
              <button
                onClick={() => setText(DEFAULT_ESSAY)}
                className={styles.buttonSecondary}
              >
                Essay
              </button>
              <button onClick={handleClear} className={styles.button}>
                Clear
              </button>
            </div>
          </div>

          {isLoading && (
            <div className={styles.processingState}>
              <div className={styles.label}>Processing Stream</div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress ? progress.percentage : 100}%` }}
                />
              </div>
              <div className={styles.processingMeta}>
                {progress
                  ? `Chunk ${progress.chunkIndex}/${progress.totalChunks}`
                  : "Calculating..."}
              </div>
            </div>
          )}
        </div>

        <div className={styles.privacySection}>
          <span className={styles.privacyLabel}>Client-Side Processing</span>
          <span className={styles.privacyDesc}>No data sent to servers</span>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerLabel}>Open Source Software</div>
          <a
            href="https://github.com/happytoolin/happytokenizer"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            github.com/happytoolin
          </a>
        </div>
      </aside>

      <main className={styles.workspace}>
        <section className={styles.editorSection}>
          <div className={styles.editorHeader}>
            <span className={styles.tabActive}>Input Stream</span>
            <span className={styles.tabInactive}>Upload File (Beta)</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here to see how it gets tokenized..."
            className={styles.textarea}
          />
          <div className={styles.metaBar}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>CHARS</span>
              <span className={styles.metaValue}>{text.length}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>WORDS</span>
              <span className={styles.metaValue}>
                {
                  text
                    .trim()
                    .split(/\s+/)
                    .filter((w) => w.length > 0).length
                }
              </span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>STATUS</span>
              <span className={styles.metaValue}>
                {error ? (
                  <span style={{ color: "var(--c-red)" }}>
                    Processing Error
                  </span>
                ) : isLoading ? (
                  "Processing..."
                ) : (
                  <span style={{ color: "var(--c-orange)" }}>READY</span>
                )}
              </span>
            </div>
          </div>
        </section>

        {/* --- TOKEN DISPLAY --- */}
        <TokenDisplay
          text={debouncedText}
          tokens={tokens}
          tokenTexts={tokenTexts}
          error={error}
        />
      </main>
      <Footer />
    </div>
  );
}
