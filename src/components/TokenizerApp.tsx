import React, { useState, useEffect } from 'react'
import { useTokenizer, type ModelType } from '../hooks/useTokenizer'
import { TokenDisplay } from './TokenDisplay'
import styles from './TokenizerApp.module.css'

const SAMPLE_TEXT = `GPT-4o is a large multimodal model that can accept image and text inputs and produce text outputs. It exhibits remarkable capabilities across various domains and tasks.`

export function TokenizerApp() {
  const [text, setText] = useState('')
  const [model, setModel] = useState<ModelType>('o200k_base')
  const [debouncedText, setDebouncedText] = useState('')
  const { tokens, isLoading, error, tokenize } = useTokenizer()

  // Debounce text input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(text)
    }, 300)

    return () => clearTimeout(timer)
  }, [text])

  // Tokenize when debounced text or model changes
  useEffect(() => {
    if (debouncedText) {
      tokenize(debouncedText, model)
    }
  }, [debouncedText, model, tokenize])

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModel(e.target.value as ModelType)
  }

  const handleClear = () => {
    setText('')
    setDebouncedText('')
  }

  const handleLoadSample = () => {
    setText(SAMPLE_TEXT)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>GPT Tokenizer</h1>
        <p className={styles.subtitle}>
          Explore how GPT models tokenize text
        </p>
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
          <button
            onClick={handleLoadSample}
            className={styles.button}
          >
            Load Sample
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
          Tokenizing with {model === 'o200k_base' ? 'GPT-4o' : 'GPT-3.5/4'}...
        </div>
      )}

      <TokenDisplay
        text={debouncedText}
        tokens={tokens}
        isLoading={isLoading}
        error={error}
      />
    </div>
  )
}