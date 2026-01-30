import string
import spacy
from typing import List

# Load French model
try:
    nlp = spacy.load("fr_core_news_sm")
except OSError:
    print("Downloading fr_core_news_sm model...")
    from spacy.cli import download
    download("fr_core_news_sm")
    nlp = spacy.load("fr_core_news_sm")

def clean_text(text: str) -> str:
    # 1. Lowercase
    text = text.lower()
    # 2. Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    return text

def tokenize(text: str) -> List[str]:
    doc = nlp(text)
    # Remove stop words and punctuation, return lemmas
    tokens = [token.lemma_ for token in doc if not token.is_stop and not token.is_punct and not token.is_space]
    return tokens

def preprocess_pipeline(text: str) -> List[str]:
    cleaned = clean_text(text)
    tokens = tokenize(cleaned)
    return tokens
