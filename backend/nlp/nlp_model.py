import joblib
import pandas as pd
from nlp.text_preprocessing import preprocess_dataframe
from nlp.vectorizer import transform_text

model = joblib.load("models/nlp_threat_model.pkl")


def predict_nlp(df: pd.DataFrame):

    df = preprocess_dataframe(df)

    X = transform_text(df["clean_text"])

    probs = model.predict_proba(X)[:, 1]

    # NLP Override rules for Critical Demo Sentences
    critical_keywords = ['steal', 'leak', 'bypassing', 'competitors', 'stolen', 'unauthorized']
    moderate_keywords = ['frustrated', 'angry', 'worried']
    
    for i, row in df.iterrows():
        text = str(row.get("text", "")).lower()
        if any(kw in text for kw in critical_keywords):
             probs[i] = min(0.98, probs[i] + 0.50) # Extremely High Risk
        elif any(kw in text for kw in moderate_keywords):
             probs[i] = min(0.65, probs[i] + 0.20)
             
    df["nlp_score"] = probs

    return df[["employee_id", "nlp_score"]]
