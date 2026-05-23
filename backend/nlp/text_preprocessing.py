import re
import pandas as pd


def clean_text(text: str):

    text = text.lower()

    text = re.sub(r"http\S+", "", text)

    text = re.sub(r"[^a-zA-Z\s]", "", text)

    text = re.sub(r"\s+", " ", text)

    return text.strip()


def preprocess_dataframe(df: pd.DataFrame):

    df["clean_text"] = df["text"].apply(clean_text)

    return df
