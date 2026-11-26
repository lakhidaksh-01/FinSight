from sklearn.linear_model import LinearRegression
import pandas as pd


def train_linear_regression(
    df,
    features,
    target_column="amount"
):
    """
    Train a Linear Regression model.
    """

    if df.empty:
        return None

    available_features = [
        feature
        for feature in features
        if feature in df.columns
    ]

    if not available_features:
        return None

    training_data = df.dropna(
        subset=available_features + [target_column]
    )

    if len(training_data) < 2:
        return None

    X = training_data[available_features]
    y = training_data[target_column]

    model = LinearRegression()

    model.fit(X, y)

    return model


def predict_next(
    model,
    df,
    features
):
    """
    Generate the next prediction.
    """

    if model is None or df.empty:
        return 0.0

    available_features = [
        feature
        for feature in features
        if feature in df.columns
    ]

    if not available_features:
        return 0.0

    latest = df[
        available_features
    ].tail(1)

    if latest.empty:
        return 0.0

    prediction = model.predict(latest)

    return float(
        max(0, prediction[0])
    )


def build_next_period_features(df, features):
    if df.empty:
        return None

    work = df.sort_values("date").reset_index(drop=True)
    latest = work.iloc[-1]
    next_date = latest["date"] + pd.DateOffset(months=1)

    lag_1 = float(work["amount"].iloc[-1])
    lag_2 = float(work["amount"].iloc[-2]) if len(work) >= 2 else lag_1
    lag_3 = float(work["amount"].iloc[-3]) if len(work) >= 3 else lag_2
    future_row = {
        "year": next_date.year,
        "month": next_date.month,
        "dayOfWeek": next_date.dayofweek,
        "dayOfYear": next_date.dayofyear,
        "lag_1": lag_1,
        "lag_2": lag_2,
        "lag_3": lag_3,
        "rolling_mean_3": float(work["amount"].tail(3).mean()),
        "rolling_mean_7": float(work["amount"].tail(7).mean()),
    }

    available_features = [feature for feature in features if feature in future_row]
    return pd.DataFrame([future_row])[available_features]


def predict_next_period(model, df, features):
    if model is None or df.empty:
        return 0.0

    row = build_next_period_features(df, features)
    if row is None or row.empty:
        return 0.0

    prediction = model.predict(row)
    return float(max(0, prediction[0]))


def predict_sequence(
    model,
    df,
    features,
    horizon=3
):
    if model is None or df.empty:
        return [0.0] * horizon

    available_features = [
        feature
        for feature in features
        if feature in df.columns
    ]

    if not available_features:
        return [0.0] * horizon

    work = df.copy().sort_values("date").reset_index(drop=True)
    forecast = []

    for _ in range(max(1, min(12, int(horizon)))):
        latest = work.iloc[-1]
        next_date = latest["date"] + pd.DateOffset(months=1)

        lag_1 = float(work["amount"].iloc[-1]) if len(work) else 0.0
        lag_2 = float(work["amount"].iloc[-2]) if len(work) >= 2 else lag_1
        lag_3 = float(work["amount"].iloc[-3]) if len(work) >= 3 else lag_2
        rolling_3 = float(work["amount"].tail(3).mean())
        rolling_7 = float(work["amount"].tail(7).mean())

        future_row = {
            "year": next_date.year,
            "month": next_date.month,
            "dayOfWeek": next_date.dayofweek,
            "dayOfYear": next_date.dayofyear,
            "lag_1": lag_1,
            "lag_2": lag_2,
            "lag_3": lag_3,
            "rolling_mean_3": rolling_3,
            "rolling_mean_7": rolling_7,
        }

        row = pd.DataFrame([future_row])[available_features]
        prediction = float(model.predict(row)[0])
        prediction = max(0.0, prediction)
        forecast.append(round(prediction, 2))

        work = pd.concat(
            [work, pd.DataFrame([{
                "date": next_date,
                "amount": prediction,
                "category": "Expense"
            }])],
            ignore_index=True
        )

    return forecast