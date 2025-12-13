import { useState, useMemo } from 'react'
import { TanStackVirtualTokenDisplay } from './TanStackVirtualTokenDisplay'
import { VirtualizedCompactTokenDisplay } from './VirtualizedCompactTokenDisplay'
import styles from './TokenDisplay.module.css'

interface TokenDisplayProps {
  text: string
  tokens: number[]
  isLoading?: boolean
  error?: string | null
}

const TOKEN_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#6C5CE7', '#55A3FF', '#FD79A8', '#FDCB6E', '#6C5CE7',
  '#A29BFE', '#74B9FF', '#A0E7E5', '#FFBE76', '#FF7979'
]

const VIRTUALIZATION_THRESHOLD = 100
const ITEM_HEIGHT = 36
const CONTAINER_HEIGHT = 400

export function TokenDisplay({ text, tokens, isLoading, error }: TokenDisplayProps) {
  const [viewMode, setViewMode] = useState<'inline' | 'compact' | 'detailed'>('inline')

  if (error) {
    return (
      <div className={styles.error}>
        Error: {error}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        Tokenizing...
      </div>
    )
  }

  if (!text || tokens.length === 0) {
    return (
      <div className={styles.empty}>
        Enter text above to see tokens
      </div>
    )
  }

  const words = text.split(/\s+/).filter(Boolean)
  const shouldUseVirtualization = tokens.length > VIRTUALIZATION_THRESHOLD

  // Create token items for virtualized display
  const tokenItems = useMemo(() => {
    const wordsList = text.split(/\s+/).filter(Boolean)
    const tokensPerWord = Math.max(1, Math.ceil(tokens.length / wordsList.length))

    return tokens.map((tokenId, index) => {
      const colorIndex = index % TOKEN_COLORS.length
      const color = TOKEN_COLORS[colorIndex]

      // Try to get text context for this token
      const maxTokenLength = 15
      let displayText = `Token ${index + 1}`

      const wordIndex = Math.floor(index / tokensPerWord)
      if (wordsList[wordIndex]) {
        displayText = wordsList[wordIndex].substring(0, maxTokenLength)
        if (wordsList[wordIndex].length > maxTokenLength) {
          displayText += '...'
        }
      }

      return {
        id: index,
        tokenId,
        color,
        text: displayText
      }
    })
  }, [tokens, text])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          Tokens ({tokens.length})
          {shouldUseVirtualization && (
            <span className={styles.virtualBadge}>Virtualized</span>
          )}
        </h3>
        <div className={styles.controls}>
          <div className={styles.modelInfo}>
            Each colored block represents a token
          </div>
          {shouldUseVirtualization && (
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewButton} ${viewMode === 'inline' ? styles.active : ''}`}
                onClick={() => setViewMode('inline')}
              >
                Inline
              </button>
              <button
                className={`${styles.viewButton} ${viewMode === 'compact' ? styles.active : ''}`}
                onClick={() => setViewMode('compact')}
              >
                Compact
              </button>
              <button
                className={`${styles.viewButton} ${viewMode === 'detailed' ? styles.active : ''}`}
                onClick={() => setViewMode('detailed')}
              >
                Detailed
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.tokensContainer}>
        {!shouldUseVirtualization ? (
          // Original inline word-based display for smaller token lists
          <>
            {words.map((_, wordIndex) => {
              const tokensPerWord = Math.ceil(tokens.length / words.length)
              const startTokenIndex = wordIndex * tokensPerWord
              const endTokenIndex = Math.min(startTokenIndex + tokensPerWord, tokens.length)
              const wordTokens = tokens.slice(startTokenIndex, endTokenIndex)

              return (
                <div key={wordIndex} className={styles.wordGroup}>
                  {wordTokens.map((token, tokenIndex) => {
                    const globalIndex = startTokenIndex + tokenIndex
                    const colorIndex = globalIndex % TOKEN_COLORS.length

                    return (
                      <span
                        key={globalIndex}
                        className={styles.token}
                        style={{
                          backgroundColor: TOKEN_COLORS[colorIndex] + '20',
                          borderColor: TOKEN_COLORS[colorIndex]
                        }}
                      >
                        <span className={styles.tokenId}>{token}</span>
                      </span>
                    )
                  })}
                  <span className={styles.space}> </span>
                </div>
              )
            })}
          </>
        ) : viewMode === 'inline' ? (
          // Inline view with real text flow for large token lists
          <div className={styles.inlineContainer}>
            {words.map((word, wordIndex) => {
              const tokensPerWord = Math.max(1, Math.ceil(tokens.length / words.length))
              const startTokenIndex = wordIndex * tokensPerWord
              const endTokenIndex = Math.min(startTokenIndex + tokensPerWord, tokens.length)
              const wordTokens = tokens.slice(startTokenIndex, endTokenIndex)

              return (
                <span key={wordIndex}>
                  {wordTokens.map((token, tokenIndex) => {
                    const globalIndex = startTokenIndex + tokenIndex
                    const item = tokenItems[globalIndex]
                    return (
                      <span
                        key={globalIndex}
                        className={styles.inlineToken}
                        style={{
                          backgroundColor: item.color + '20',
                          borderColor: item.color
                        }}
                        title={`Token ${globalIndex + 1}: ${token}`}
                      >
                        <span className={styles.inlineTokenNumber}>{item.tokenId}</span>
                        <span className={styles.inlineTokenText}>{word}</span>
                      </span>
                    )
                  })}
                  <span className={styles.space}> </span>
                </span>
              )
            })}
          </div>
        ) : viewMode === 'compact' ? (
          // Virtualized compact grid view
          <VirtualizedCompactTokenDisplay
            items={tokenItems}
            containerHeight={CONTAINER_HEIGHT}
            tokensPerRow={20}
            itemWidth={50}
            itemHeight={28}
            gap={4}
          />
        ) : (
          // Detailed virtualized list view
          <TanStackVirtualTokenDisplay
            items={tokenItems}
            containerHeight={CONTAINER_HEIGHT}
            estimatedItemHeight={ITEM_HEIGHT}
          />
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total Tokens:</span>
          <span className={styles.statValue}>{tokens.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Characters:</span>
          <span className={styles.statValue}>{text.length}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Words:</span>
          <span className={styles.statValue}>{words.length}</span>
        </div>
        {shouldUseVirtualization && (
          <div className={styles.stat}>
            <span className={styles.statLabel}>View:</span>
            <span className={styles.statValue}>
              {viewMode === 'inline' ? 'Inline (text flow)' :
               viewMode === 'compact' ? 'Compact (grid)' :
               'Detailed (list)'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}