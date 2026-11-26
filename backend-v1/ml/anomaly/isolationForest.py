import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

MIN_ACTIVE_MONTHS = 5


def detect_anomalies(
    df,
    target_column="amount"
):
    """
    Detect unusual positive monthly expense totals.
    """

    result = df.copy()
    result["anomaly"] = False

    if result.empty or target_column not in result.columns:
        return result

    amounts = pd.to_numeric(result[target_column], errors="coerce")
    valid_amounts = np.isfinite(amounts) & (amounts > 0)
    candidate_indices = result.index[valid_amounts]

    if len(candidate_indices) < MIN_ACTIVE_MONTHS:
        return result

    model = IsolationForest(
        contamination="auto",
        random_state=42
    )

    predictions = model.fit_predict(
        amounts.loc[candidate_indices].to_frame(name=target_column)
    )

    result.loc[candidate_indices, "anomaly"] = predictions == -1

    return result