import { TokenLimitIndicator } from "./TokenLimitIndicator";
import { CostEstimator } from "./CostEstimator";
import { TotalContext } from "./TotalContext";
import styles from "../../styles/components/TokenDisplay.module.css";
import type { ChatMessage } from "../../types/chat";

interface TokenStatsProps {
  tokenCount: number;
  charCount: number;
  modelName: string;
  isChatMode?: boolean;
  chatMessages?: ChatMessage[];
  showLimitAndCost?: boolean;
}

export function TokenStats({
  tokenCount,
  charCount,
  modelName,
  isChatMode = false,
  chatMessages,
  showLimitAndCost = true,
}: TokenStatsProps) {
  const density = tokenCount > 0 ? (charCount / tokenCount).toFixed(2) : "0.00";

  return (
    <div className={styles.stats}>
      {isChatMode ? (
        <>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Mode</span>
            <span className={styles.statValue} style={{ color: "#ea580c" }}>
              CHAT
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Messages</span>
            <span className={styles.statValue}>
              {chatMessages?.length || 0}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total Tokens</span>
            <span className={styles.statValue}>{tokenCount}</span>
          </div>
          {showLimitAndCost && (
            <>
              <TokenLimitIndicator
                tokenCount={tokenCount}
                modelName={modelName}
              />
              <TotalContext modelName={modelName} />
              <CostEstimator tokenCount={tokenCount} modelName={modelName} />
            </>
          )}
        </>
      ) : (
        <>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Token Count</span>
            <span className={styles.statValue}>{tokenCount}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Char Count</span>
            <span className={styles.statValue}>{charCount}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Density</span>
            <span className={styles.statValue}>{density}</span>
          </div>
          {showLimitAndCost && (
            <>
              <TokenLimitIndicator
                tokenCount={tokenCount}
                modelName={modelName}
              />
              <TotalContext modelName={modelName} />
              <CostEstimator tokenCount={tokenCount} modelName={modelName} />
            </>
          )}
        </>
      )}
    </div>
  );
}
