import os
import pickle

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_model():

    model_path = os.path.join(BASE_DIR, "models", "insider_threat_model.pkl")
    with open(model_path, "rb") as f:
        model = pickle.load(f)

    return model

def predict_anomaly(model, X):

    preds = model.predict(X)

    return preds