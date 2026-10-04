import pandas as pd


def create_time_features(df):
    """
    Create date-based features for forecasting.
    """

    if df.empty:
        return df.copy()

    result = df.copy()

    result["year"] = result["date"].dt.year
    result["month"] = result["date"].dt.month
    result["day"] = result["date"].dt.day
    result["dayOfWeek"] = result["date"].dt.dayofweek
    result["dayOfYear"] = result["date"].dt.dayofyear

    return result


def create_lag_features(
    df,
    target_column="amount",
    lags=(1, 2, 3)
):
    """
    Create previous-value features.

    Example:
    lag_1 = previous transaction amount
    lag_2 = amount from two records ago
    """

    if df.empty:
        return df.copy()

    result = df.copy()

    for lag in lags:
        result[f"lag_{lag}"] = (
            result[target_column]
            .shift(lag)
        )

    return result


def create_rolling_features(
    df,
    target_column="amount",
    windows=(3, 7)
):
    """
    Create rolling average features.
    """

    if df.empty:
        return df.copy()

    result = df.copy()

    for window in windows:
        result[f"rolling_mean_{window}"] = (
            result[target_column]
            .rolling(window=window)
            .mean()
        )

    return result


def engineer_features(df):
    """
    Run all feature engineering steps.
    """

    result = create_time_features(df)

    result = create_lag_features(result)

    result = create_rolling_features(result)

    result = result.dropna()

    result = result.reset_index(drop=True)

    return result