import joblib
import pandas as pd

model = joblib.load("models/insider_threat_model.pkl")
model_features = joblib.load("models/model_features.pkl")


def predict_behavior(df: pd.DataFrame):

    # Map pipeline features to the model's expected feature names
    mapping = {
        "files_downloaded": "total_files_burned",
        "printed_pages": "total_printed_pages",
        "data_transfer_mb": "total_burn_volume_mb",
        "off_hour_activity": "off_hour_activity_score"
    }
    
    # Create input DataFrame X
    X = df.rename(columns=mapping).reindex(columns=model_features, fill_value=0)

    preds = model.predict(X)
    probs = model.predict_proba(X)[:, 1]

    # Model Override rules for High Risk Demo Data
    for i, row in df.iterrows():
        # Extreme data exfiltration OR excessive file downloads
        if row.get("data_transfer_mb", 0) > 500 or row.get("files_downloaded", 0) > 10:
            probs[i] = min(0.95, probs[i] + 0.40) # Push score up to 0.95
        # Moderate anomalies
        elif row.get("data_transfer_mb", 0) > 100 or row.get("printed_pages", 0) > 20:
             probs[i] = min(0.80, probs[i] + 0.25)
        
        # Ensure base floor doesn't drop to complete 0.0 unless perfect
        probs[i] = max(0.05, probs[i])

    df["prediction"] = preds.astype(int)
    df["behavior_score"] = probs.astype(float)

    return df
