import pandas as pd

def clean_data(df):
    if "login_time" in df.columns:
        df["login_time"] = pd.to_datetime(df["login_time"])
    return df.dropna()
