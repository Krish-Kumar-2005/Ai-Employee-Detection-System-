import pandas as pd


def build_behavior_features(df: pd.DataFrame):

    features = df.groupby("employee_id").agg(
        files_downloaded=("files_downloaded", "sum"),
        printed_pages=("printed_pages", "sum"),
        data_transfer_mb=("data_transfer_mb", "sum"),
        off_hour_activity=("is_off_hour", "sum"),
    )

    features.reset_index(inplace=True)

    return features