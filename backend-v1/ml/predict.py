import json
import sys
import pandas as pd

from preprocessing.prepareData import prepare_data
from preprocessing.featureEngineering import engineer_features

from forecasting.baseline import (
    baseline_forecast,
    moving_average_forecast
)

from forecasting.linearRegression import (
    train_linear_regression,
    predict_next_period,
    predict_sequence
)

from anomaly.isolationForest import (
    detect_anomalies,
    MIN_ACTIVE_MONTHS
)
from forecasting.evaluate import evaluate_model


def evaluate_forecast(data, features):
    if len(data) < 4:
        return {
            "mae": None,
            "rmse": None,
            "samples": 0,
            "method": "rolling_origin_one_step"
        }, None

    holdout_count = min(3, max(1, len(data) // 4))
    first_holdout = len(data) - holdout_count
    training = data.iloc[:first_holdout].copy()
    actual_values = []
    predicted_values = []

    for index in range(first_holdout, len(data)):
        engineered_training = engineer_features(training)
        model = train_linear_regression(engineered_training, features)
        predicted_values.append(
            predict_next_period(model, engineered_training, features)
        )
        actual_values.append(float(data["amount"].iloc[index]))
        training = pd.concat(
            [training, data.iloc[[index]]],
            ignore_index=True
        )

    evaluation = evaluate_model(actual_values, predicted_values)
    evaluation["samples"] = len(actual_values)
    evaluation["method"] = "rolling_origin_one_step"
    mean_actual = sum(actual_values) / len(actual_values)
    mae = sum(
        abs(actual - predicted)
        for actual, predicted in zip(actual_values, predicted_values)
    ) / len(actual_values)
    fit_score = (
        round(max(0.0, min(100.0, 100.0 * (1 - mae / mean_actual))), 1)
        if mean_actual > 0
        else None
    )

    return evaluation, fit_score


def run_prediction(data, horizon=3):
    """
    Main FinSight ML pipeline.
    """

    prepared_data = prepare_data(data)

    if prepared_data.empty:
        return {
            "success": False,
            "message": "Not enough financial data"
        }

    horizon = max(1, min(12, int(horizon)))

    engineered_data = engineer_features(
        prepared_data
    )

    baseline_prediction = baseline_forecast(
        prepared_data
    )

    moving_average_prediction = (
        moving_average_forecast(
            prepared_data
        )
    )

    features = [
        "year",
        "month",
        "dayOfWeek",
        "dayOfYear",
        "lag_1",
        "lag_2",
        "lag_3",
        "rolling_mean_3",
        "rolling_mean_7"
    ]

    model = train_linear_regression(
        engineered_data,
        features
    )

    linear_forecast = predict_sequence(
        model,
        engineered_data,
        features,
        horizon
    )

    trend = "stable"
    if len(engineered_data) >= 3:
        mean_amount = float(engineered_data["amount"].mean())
        slope_values = engineered_data["amount"].tail(3).tolist()
        if len(slope_values) >= 2:
            slope = slope_values[-1] - slope_values[-2]
            trend = "up" if slope > mean_amount * 0.05 else "down" if slope < -mean_amount * 0.05 else "stable"

    evaluation, fit_score = evaluate_forecast(prepared_data, features)

    anomaly_data = detect_anomalies(
        prepared_data
    )

    anomaly_count = int(
        anomaly_data["anomaly"].sum()
    )

    anomaly_records = []
    for _, row in anomaly_data[anomaly_data["anomaly"]].iterrows():
        anomaly_records.append({
            "date": row["date"].isoformat(),
            "amount": round(float(row["amount"]), 2),
            "category": str(row["category"])
        })

    return {
        "success": True,
        "prediction": {
            "baseline": round(
                baseline_prediction,
                2
            ),
            "movingAverage": round(
                moving_average_prediction,
                2
            ),
            "linearRegression": linear_forecast
        },
        "anomalies": {
            "count": anomaly_count,
            "records": anomaly_records,
            "method": "isolation_forest",
            "granularity": "positive_monthly_expense_totals",
            "minimumActiveMonths": MIN_ACTIVE_MONTHS
        },
        "models": {
            "forecast": "scikit-learn LinearRegression",
            "anomaly": "scikit-learn IsolationForest"
        },
        "fitScore": fit_score,
        "fitScoreMethod": "100 * (1 - holdout MAE / mean holdout actual), clipped to 0-100",
        "trend": trend,
        "evaluation": evaluation,
        "dataPoints": len(prepared_data)
    }


def main():
    """
    Read JSON data from stdin
    and return JSON result.
    """

    try:
        input_data = sys.stdin.read()

        data = json.loads(input_data)

        if isinstance(data, dict):
            records = data.get("data", [])
            horizon = data.get("horizon", 3)
        else:
            records = data
            horizon = 3

        result = run_prediction(records, horizon)

        print(
            json.dumps(
                result,
                default=str
            )
        )

    except Exception as error:
        print(
            json.dumps({
                "success": False,
                "message": str(error)
            })
        )


if __name__ == "__main__":
    main()