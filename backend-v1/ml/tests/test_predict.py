import unittest
from unittest.mock import patch

import pandas as pd

from anomaly.isolationForest import detect_anomalies
from predict import evaluate_forecast, run_prediction


FEATURES = [
    "year",
    "month",
    "dayOfWeek",
    "dayOfYear",
    "lag_1",
    "lag_2",
    "lag_3",
    "rolling_mean_3",
    "rolling_mean_7",
]


class PredictionEvaluationTests(unittest.TestCase):
    def test_evaluation_reports_rolling_holdout_samples_and_fit_score(self):
        data = [
            {
                "date": f"2026-{month:02d}-01",
                "amount": amount,
                "category": "Expense",
            }
            for month, amount in enumerate(
                [100, 120, 115, 150, 145, 180, 170, 200],
                start=1,
            )
        ]

        result = run_prediction(data, horizon=2)

        self.assertTrue(result["success"])
        self.assertEqual(result["evaluation"]["samples"], 2)
        self.assertGreaterEqual(result["evaluation"]["mae"], 0)
        self.assertGreaterEqual(result["evaluation"]["rmse"], 0)
        self.assertGreaterEqual(result["fitScore"], 0)
        self.assertLessEqual(result["fitScore"], 100)
        self.assertNotIn("confidence", result)
        self.assertEqual(
            result["anomalies"]["count"],
            len(result["anomalies"]["records"]),
        )
        self.assertEqual(
            result["anomalies"]["granularity"],
            "positive_monthly_expense_totals",
        )
        self.assertEqual(result["anomalies"]["minimumActiveMonths"], 5)

    def test_isolation_forest_ignores_empty_months_and_flags_extreme_active_month(self):
        frame = pd.DataFrame({
            "amount": [0, 0, 100, 120, 115, 150, 10000],
        })

        result = detect_anomalies(frame)

        self.assertEqual(
            result.loc[result["anomaly"], "amount"].tolist(),
            [10000],
        )

    def test_isolation_forest_does_not_force_an_anomaly_for_small_or_flat_history(self):
        small = detect_anomalies(pd.DataFrame({"amount": [0, 100, 120, 115, 10000]}))
        flat = detect_anomalies(pd.DataFrame({"amount": [100, 100, 100, 100, 100]}))

        self.assertFalse(small["anomaly"].any())
        self.assertFalse(flat["anomaly"].any())

    def test_fit_score_uses_unrounded_holdout_error(self):
        data = pd.DataFrame({
            "date": pd.date_range("2026-01-01", periods=4, freq="MS"),
            "amount": [0.1, 0.1, 0.1, 0.1],
            "category": ["Expense"] * 4,
        })

        with patch("predict.predict_next_period", return_value=0.096):
            evaluation, fit_score = evaluate_forecast(data, FEATURES)

        self.assertEqual(evaluation["mae"], 0.0)
        self.assertEqual(evaluation["samples"], 1)
        self.assertEqual(fit_score, 96.0)

    def test_fit_score_is_unavailable_for_zero_mean_holdout(self):
        data = pd.DataFrame({
            "date": pd.date_range("2026-01-01", periods=4, freq="MS"),
            "amount": [0, 0, 0, 0],
            "category": ["Expense"] * 4,
        })

        evaluation, fit_score = evaluate_forecast(data, FEATURES)

        self.assertEqual(evaluation["mae"], 0.0)
        self.assertIsNone(fit_score)


if __name__ == "__main__":
    unittest.main()
