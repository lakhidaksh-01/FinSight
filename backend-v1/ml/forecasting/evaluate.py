from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error
)
import math


def evaluate_model(
    actual,
    predicted
):
    """
    Evaluate prediction accuracy.
    """

    if not actual or not predicted:
        return {
            "mae": 0.0,
            "rmse": 0.0
        }

    mae = mean_absolute_error(
        actual,
        predicted
    )

    mse = mean_squared_error(
        actual,
        predicted
    )

    rmse = math.sqrt(mse)

    return {
        "mae": round(float(mae), 2),
        "rmse": round(float(rmse), 2)
    }