import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle
import os
from .preprocessing import clean_text

# Mock Dataset if no file provided
MOCK_DATA = [
    ("Gagnez un iPhone maintenant ! Cliquez ici.", "SPAM"),
    ("Bonjour, comment vas-tu ?", "HAM"),
    ("Offre spéciale : -50% aujourd'hui seulement", "SPAM"),
    ("Réunion demain à 10h", "HAM"),
    ("Urgent : votre compte est bloqué", "SPAM"),
    ("Peux-tu m'envoyer le dossier ?", "HAM"),
    ("Félicitations, vous avez été sélectionné", "SPAM"),
    ("On mange ensemble ce midi ?", "HAM"),
    ("Perdez du poids rapidement sans effort", "SPAM"),
    ("Merci pour ton email", "HAM")
]

MODEL_PATH = "backend/spam_classifier.pkl"

class SpamClassifier:
    def __init__(self):
        self.model = None
        self.vectorizer = None

    def train(self, data=None):
        if data is None:
            df = pd.DataFrame(MOCK_DATA, columns=["text", "label"])
        else:
            df = pd.DataFrame(data, columns=["text", "label"])

        X = df["text"]
        y = df["label"]

        # Create Pipeline
        self.model = Pipeline([
            ('tfidf', TfidfVectorizer(preprocessor=clean_text)),
            ('clf', LogisticRegression())
        ])

        self.model.fit(X, y)
        print("Model trained.")
        self.save_model()

    def predict(self, text: str):
        if not self.model:
            self.load_model()
        
        prediction = self.model.predict([text])[0]
        # Get probabilities
        proba = self.model.predict_proba([text]).max()
        
        # Get tf-idf feature names and weights for this text (simplified)
        # transform text to get vector
        vectorizer = self.model.named_steps['tfidf']
        tfidf_vector = vectorizer.transform([text])
        feature_names = vectorizer.get_feature_names_out()
        
        # Get non-zero features
        feature_index = tfidf_vector.nonzero()[1]
        tokens = []
        vector_values = []
        for idx in feature_index:
             tokens.append(feature_names[idx])
             vector_values.append(tfidf_vector[0, idx])
             
        return {
            "prediction": prediction,
            "confidence": float(proba),
            "details": {
                "tokens": tokens,
                "vector": [float(v) for v in vector_values] # JSON serializable
            }
        }

    def save_model(self):
        with open(MODEL_PATH, 'wb') as f:
            pickle.dump(self.model, f)

    def load_model(self):
        if os.path.exists(MODEL_PATH):
            with open(MODEL_PATH, 'rb') as f:
                self.model = pickle.load(f)
        else:
            print("Model not found, training new one...")
            self.train()

# Global instance
classifier = SpamClassifier()
