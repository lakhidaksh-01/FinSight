from sklearn.linear_model import LinearRegression


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