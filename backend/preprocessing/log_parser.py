import pandas as pd


def parse_logs(df: pd.DataFrame):

    # convert timestamp
    df["timestamp"] = pd.to_datetime(df["timestamp"])

    # extract hour
    df["hour"] = df["timestamp"].dt.hour

    # off-hour activity
    df["is_off_hour"] = df["hour"].apply(lambda x: 1 if x < 6 or x > 22 else 0)

    return df
