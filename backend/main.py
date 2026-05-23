import os
import pandas as pd

from preprocessing.data_cleaning import clean_data
from feature_engineering.feature_builder import build_features
from models.isolation_forest_model import load_model, predict_anomaly


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def run_pipeline():

    csv_path = os.path.join(BASE_DIR, "dataset", "employee_logs.csv")
    df = pd.read_csv(csv_path)

    df = clean_data(df)

    features = build_features(df)

    model = load_model()

    predictions = predict_anomaly(model, features)

    df["prediction"] = predictions

    return df


if __name__ == "__main__":

    result = run_pipeline()

    print(result.head())