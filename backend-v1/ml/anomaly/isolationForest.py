from sklearn.ensemble import IsolationForest


def detect_anomalies(
    df,
    target_column="amount",
    contamination=0.05
):
    """
    Detect unusual transaction amounts.
    """

    if df.empty:
        return df.copy()

    if target_column not in df.columns:
        return df.copy()

    if len(df) < 5:
        result = df.copy()
        result["anomaly"] = False
        return result

    result = df.copy()

    model = IsolationForest(
        contamination=contamination,
        random_state=42
    )

    predictions = model.fit_predict(
        result[[target_column]]
    )

    result["anomaly"] = predictions == -1

    return result