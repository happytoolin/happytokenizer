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

export function TokenDisplay({ text, tokens, isLoading, error }: TokenDisplayProps) {
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

  // Simple token visualization - split by spaces and map to tokens
  const words = text.split(/\s+/).filter(Boolean)
  const tokensPerWord = Math.ceil(tokens.length / words.length)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Tokens ({tokens.length})</h3>
        <div className={styles.modelInfo}>
          Each colored block represents a token
        </div>
      </div>

      <div className={styles.tokensContainer}>
        {words.map((_, wordIndex) => {
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
      </div>
    </div>
  )
}