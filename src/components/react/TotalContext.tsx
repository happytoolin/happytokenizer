import styles from "../../styles/components/TokenDisplay.module.css";
import { getContextWindowLimit } from "../../utils/contextLimits";
import { getModelDisplayName } from "../../utils/models";

interface TotalContextProps {
  modelName: string;
}

export function TotalContext({ modelName }: TotalContextProps) {
  const contextLimit = getContextWindowLimit(modelName);

  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>Total Context</span>
      <span
        className={styles.statValue}
        title={`${getModelDisplayName(modelName)} context window limit`}
      >
        {contextLimit.toLocaleString()}
      </span>
    </div>
  );
}
