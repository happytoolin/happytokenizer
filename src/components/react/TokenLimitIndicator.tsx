import styles from "../../styles/components/TokenDisplay.module.css";
import { getModelDisplayName } from "../../utils/models";
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
        title={`${getModelDisplayName(modelName)}: ${modelStatus.remaining.toLocaleString()} tokens remaining`}
      >
        {modelStatus.percentage.toFixed(1)}%
      </span>
    </div>
  );
}
