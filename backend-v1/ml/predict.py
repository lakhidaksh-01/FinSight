import json
import sys

from preprocessing.prepareData import prepare_data
from preprocessing.featureEngineering import engineer_features

from forecasting.baseline import (
    baseline_forecast,
    moving_average_forecast
)

from forecasting.linearRegression import (
    train_linear_regression,
    predict_next,
    predict_sequence
)

from anomaly.isolationForest import (
    detect_anomalies
)
from forecasting.evaluate import evaluate_model


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

    confidence = 45.0
    trend = "stable"
    if len(engineered_data) >= 3:
        mean_amount = float(engineered_data["amount"].mean())
        slope_values = engineered_data["amount"].tail(3).tolist()
        if len(slope_values) >= 2:
            slope = slope_values[-1] - slope_values[-2]
            trend = "up" if slope > mean_amount * 0.05 else "down" if slope < -mean_amount * 0.05 else "stable"

        actual = engineered_data["amount"].iloc[-1]
        holdout_features = features
        training = engineer_features(prepared_data.iloc[:-1])
        holdout_model = train_linear_regression(training, holdout_features)
        predicted = predict_next(holdout_model, training, holdout_features)
        error = abs(float(actual) - float(predicted))
        relative_error = error / max(float(actual), 1.0)
        confidence = max(45.0, min(96.0, 96.0 - relative_error * 51.0))

    evaluation = {"mae": 0.0, "rmse": 0.0}
    if len(engineered_data) >= 4:
        holdout_count = min(3, max(1, len(engineered_data) // 4))
        training_data = engineered_data.iloc[:-holdout_count]
        holdout_data = engineered_data.iloc[-holdout_count:]

        evaluation_model = train_linear_regression(
            training_data,
            features
        )

        predicted_values = [
            predict_next(evaluation_model, training_data, features)
        ] * len(holdout_data)

        evaluation = evaluate_model(
            holdout_data["amount"].tolist(),
            predicted_values
        )

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
            "records": anomaly_records
        },
        "confidence": round(confidence, 2),
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