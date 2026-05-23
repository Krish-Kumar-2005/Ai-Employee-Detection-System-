import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

data = {
    "text": [
        "I will copy the database tonight",
        "Download confidential files",
        "Steal company data",
        "Send the report",
        "Schedule a meeting",
        "Team lunch tomorrow"
    ],
    "label": [1,1,1,0,0,0]
}

df = pd.DataFrame(data)

vectorizer = TfidfVectorizer()

X = vectorizer.fit_transform(df["text"])

model = LogisticRegression()

model.fit(X, df["label"])

joblib.dump(vectorizer, "models/tfidf_vectorizer.pkl")
joblib.dump(model, "models/nlp_threat_model.pkl")
