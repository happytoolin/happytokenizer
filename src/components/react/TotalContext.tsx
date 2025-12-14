import React from "react";
import { getContextWindowLimit } from "../../utils/contextLimits";
import { MODEL_DISPLAY_NAMES } from "../../utils/modelEncodings";
import styles from "../../styles/components/TokenDisplay.module.css";

interface TotalContextProps {
  tokenCount: number;
  modelName: string;
}

export function TotalContext({ tokenCount, modelName }: TotalContextProps) {
  const contextLimit = getContextWindowLimit(modelName);

  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>Total Context</span>
      <span
        className={styles.statValue}
        title={`${MODEL_DISPLAY_NAMES[modelName] || modelName} context window limit`}
      >
        {contextLimit.toLocaleString()}
      </span>
    </div>
  );
}
