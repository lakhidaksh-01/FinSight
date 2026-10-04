import pandas as pd


def prepare_data(data):
    """
    Convert raw financial data into a clean DataFrame.

    Expected input:
    [
        {
            "date": "2026-01-01",
            "amount": 500,
            "category": "Food"
        }
    ]
    """

    if not data:
        return pd.DataFrame(
            columns=["date", "amount", "category"]
        )

    df = pd.DataFrame(data)

    required_columns = [
        "date",
        "amount",
        "category"
    ]

    for column in required_columns:
        if column not in df.columns:
            df[column] = None

    df["date"] = pd.to_datetime(
        df["date"],
        errors="coerce"
    )

    df["amount"] = pd.to_numeric(
        df["amount"],
        errors="coerce"
    )

    df["category"] = (
        df["category"]
        .fillna("Other")
        .astype(str)
        .str.strip()
    )

    df = df.dropna(
        subset=["date", "amount"]
    )

    df = df.sort_values("date")

    df = df.reset_index(drop=True)

    return df