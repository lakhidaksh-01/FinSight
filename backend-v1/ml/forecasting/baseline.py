import pandas as pd


def baseline_forecast(
    df,
    target_column="amount"
):
    """
    Predict the next value using the historical average.
    """

    if df.empty:
        return 0.0

    if target_column not in df.columns:
        return 0.0

    return float(
        df[target_column].mean()
    )


def moving_average_forecast(
    df,
    target_column="amount",
    window=3
):
    """
    Predict the next value using
    the average of the latest records.
    """

    if df.empty:
        return 0.0

    if target_column not in df.columns:
        return 0.0

    recent_values = (
        df[target_column]
        .tail(window)
    )

    if recent_values.empty:
        return 0.0

    return float(
        recent_values.mean()
    )