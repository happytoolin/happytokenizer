import React, { useState, useEffect } from "react";
import { useTokenizer, type ModelType } from "../hooks/useTokenizer";
import { TokenDisplay } from "./TokenDisplay";
import styles from "./TokenizerApp.module.css";

const SAMPLE_TEXT = `GPT-4o is a large multimodal model that can accept image and text inputs and produce text outputs. It exhibits remarkable capabilities across various domains and tasks.`;

const LARGE_SAMPLE_TEXT = `Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals. Leading AI textbooks define the field as the study of "intelligent agents": any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals. Colloquially, the term "artificial intelligence" is often used to describe machines that mimic "cognitive" functions that humans associate with the human mind, such as "learning" and "problem solving".

AI applications include advanced web search engines, recommendation systems (used by YouTube, Amazon and Netflix), understanding human speech (such as Siri and Alexa), self-driving cars (e.g., Tesla), and competing at the highest level in strategic games (such as chess and Go). As machines become increasingly capable, tasks considered to require "intelligence" are often removed from the definition of AI, a phenomenon known as the AI effect. For instance, optical character recognition is frequently excluded from things considered to be AI, having become a routine technology.

Artificial intelligence was founded as an academic discipline in 1956, and in the years since has experienced several waves of optimism, followed by disappointment and the loss of funding (known as an "AI winter"), followed by new approaches, success and renewed funding. AI research has tried and discarded many different approaches since its founding, including simulating the brain, modeling human problem solving, formal logic, large databases of knowledge and imitating animal behavior. In the first decades of the 21st century, highly mathematical statistical machine learning has dominated the field, and this technique has proved highly successful, helping to solve many challenging problems throughout industry and academia.

The various sub-fields of AI research are centered around particular goals and the use of particular tools. The traditional goals of AI research include reasoning, knowledge representation, planning, learning, natural language processing, perception and the ability to move and manipulate objects. General intelligence (the ability to solve an arbitrary problem) is among the field's long-term goals. To solve these problems, AI researchers have adapted and integrated a wide range of problem-solving techniques—including search and mathematical optimization, formal logic, artificial neural networks, and methods based on statistics, probability and economics. AI also draws upon computer science, psychology, linguistics, philosophy, and many other fields.

${`The history of machine learning dates back to the 1950s when Arthur Samuel created a program that could play checkers and improve its performance through experience. This early example of machine learning demonstrated the potential for computers to learn from data without being explicitly programmed for every possible scenario. Throughout the 1960s and 1970s, researchers developed various learning algorithms, including nearest neighbor algorithms, decision trees, and early neural network models. However, progress was often hindered by limited computational power and the scarcity of large datasets. The 1980s saw a resurgence of interest in neural networks with the development of backpropagation, a key algorithm for training multi-layer networks. The 1990s brought support vector machines and ensemble methods, which became powerful tools for classification and regression tasks. The real revolution began in the 2000s and accelerated dramatically in the 2010s, driven by three key factors: the availability of massive datasets (often called "big data"), exponential improvements in GPU computing power, and breakthroughs in algorithm design. Deep learning, which uses neural networks with many layers, has transformed fields like computer vision, natural language processing, and speech recognition. Today, machine learning is ubiquitous, powering everything from recommendation systems and fraud detection to autonomous vehicles and medical diagnosis. `.repeat(20)}`;

export function TokenizerApp() {
  const [text, setText] = useState("");
  const [model, setModel] = useState<ModelType>("o200k_base");
  const [debouncedText, setDebouncedText] = useState("");
  const { tokens, isLoading, error, progress, tokenize } = useTokenizer();

  // Debounce text input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(text);
    }, 150); // Reduced debounce time for better responsiveness

    return () => clearTimeout(timer);
  }, [text]);

  // Tokenize when debounced text or model changes
  useEffect(() => {
    if (debouncedText) {
      tokenize(debouncedText, model);
    }
  }, [debouncedText, model, tokenize]);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModel(e.target.value as ModelType);
  };

  const handleClear = () => {
    setText("");
    setDebouncedText("");
  };

  const handleLoadSample = () => {
    setText(SAMPLE_TEXT);
  };

  const handleLoadLargeSample = () => {
    setText(LARGE_SAMPLE_TEXT);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>GPT Tokenizer</h1>
        <p className={styles.subtitle}>Explore how GPT models tokenize text</p>
      </header>

      <div className={styles.controls}>
        <div className={styles.modelSelector}>
          <label htmlFor="model-select" className={styles.label}>
            Model:
          </label>
          <select
            id="model-select"
            value={model}
            onChange={handleModelChange}
            className={styles.select}
          >
            <option value="o200k_base">GPT-4o (o200k_base)</option>
            <option value="cl100k_base">GPT-3.5/4 (cl100k_base)</option>
          </select>
        </div>

        <div className={styles.buttons}>
          <button onClick={handleLoadSample} className={styles.button}>
            Load Sample
          </button>
          <button onClick={handleLoadLargeSample} className={styles.button}>
            Load Large Text
          </button>
          <button
            onClick={handleClear}
            className={`${styles.button} ${styles.buttonSecondary}`}
          >
            Clear
          </button>
        </div>
      </div>

      <div className={styles.inputSection}>
        <label htmlFor="text-input" className={styles.label}>
          Input Text:
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to tokenize..."
          className={styles.textarea}
          rows={8}
        />
        {text && (
          <div className={styles.inputStats}>
            <span>{text.length} characters</span>
            <span>•</span>
            <span>{text.split(/\s+/).filter(Boolean).length} words</span>
          </div>
        )}
      </div>

      {isLoading && (
        <div className={styles.status}>
          {progress ? (
            <>
              <div>
                Tokenizing with{" "}
                {model === "o200k_base" ? "GPT-4o" : "GPT-3.5/4"}...
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress.percentage}%` }}
                />
                <span className={styles.progressText}>
                  {progress.percentage}% ({progress.chunkIndex + 1}/
                  {progress.totalChunks} chunks)
                </span>
              </div>
            </>
          ) : (
            <>
              Tokenizing with {model === "o200k_base" ? "GPT-4o" : "GPT-3.5/4"}
              ...
            </>
          )}
        </div>
      )}

      <TokenDisplay
        text={debouncedText}
        tokens={tokens}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
