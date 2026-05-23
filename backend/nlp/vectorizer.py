import joblib

vectorizer = joblib.load("models/tfidf_vectorizer.pkl")


def transform_text(text_series):

    X = vectorizer.transform(text_series)

    return X
