import os
import pickle

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_rf_model():

    model_path = os.path.join(BASE_DIR, "models", "random_forest.pkl")
    with open(model_path, "rb") as f:
        model = pickle.load(f)

    return model

def predict_risk(model, X):

    risk = model.predict_proba(X)

    return risk