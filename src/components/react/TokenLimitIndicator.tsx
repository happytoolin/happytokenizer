import styles from "../../styles/components/TokenDisplay.module.css";
import { MODEL_DISPLAY_NAMES } from "../../utils/modelEncodings";
import {
  getModelLimitStatus,
  getUsageStatusColor,
} from "../../utils/tokenUtils";

interface TokenLimitIndicatorProps {
  tokenCount: number;
  modelName: string;
}

export function TokenLimitIndicator({
  tokenCount,
  modelName,
}: TokenLimitIndicatorProps) {
  const modelStatus = getModelLimitStatus(tokenCount, modelName);
  const statusColor = getUsageStatusColor(modelStatus.percentage);

  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>Context Usage</span>
      <span
        className={styles.statValue}
        style={{ color: statusColor }}
        title={`${MODEL_DISPLAY_NAMES[modelName] || modelName}: ${modelStatus.remaining.toLocaleString()} tokens remaining`}
      >
        {modelStatus.percentage.toFixed(1)}%
      </span>
    </div>
  );
}
