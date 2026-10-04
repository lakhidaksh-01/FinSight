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
    predict_next
)

from anomaly.isolationForest import (
    detect_anomalies
)


def run_prediction(data):
    """
    Main FinSight ML pipeline.
    """

    prepared_data = prepare_data(data)

    if prepared_data.empty:
        return {
            "success": False,
            "message": "Not enough financial data"
        }

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

    linear_prediction = predict_next(
        model,
        engineered_data,
        features
    )

    anomaly_data = detect_anomalies(
        prepared_data
    )

    anomaly_count = int(
        anomaly_data["anomaly"].sum()
    )

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
            "linearRegression": round(
                linear_prediction,
                2
            )
        },
        "anomalies": {
            "count": anomaly_count
        },
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

        result = run_prediction(data)

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