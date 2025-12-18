import styles from "../../styles/components/TokenDisplay.module.css";
import { getModelDisplayName } from "../../utils/models";
import { estimateCost } from "../../utils/tokenUtils";

interface CostEstimatorProps {
  tokenCount: number;
  modelName: string;
}

export function CostEstimator({ tokenCount, modelName }: CostEstimatorProps) {
  const costData = estimateCost(tokenCount, modelName);
  const totalCost = costData.totalInput + costData.totalOutput;

  return (
    <>
      <div className={styles.stat}>
        <span className={styles.statLabel}>Est. Cost</span>
        <span
          className={styles.statValue}
          title={`${getModelDisplayName(modelName)}: $${costData.input}/1K input, $${costData.output}/1K output`}
        >
          ${totalCost.toFixed(4)}
        </span>
      </div>
      <div className={styles.stat}>
        <span className={styles.statLabel}>Input/M Tokens</span>
        <span
          className={styles.statValue}
          title={`${getModelDisplayName(modelName)}: Input pricing per million tokens`}
        >
          ${(costData.input * 1000).toFixed(2)}
        </span>
      </div>
      <div className={styles.stat}>
        <span className={styles.statLabel}>Output/M Tokens</span>
        <span
          className={styles.statValue}
          title={`${getModelDisplayName(modelName)}: Output pricing per million tokens`}
        >
          ${(costData.output * 1000).toFixed(2)}
        </span>
      </div>
    </>
  );
}
