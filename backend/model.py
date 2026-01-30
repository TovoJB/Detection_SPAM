import pandas as pd
import pickle
import os
from .preprocessing import clean_text, tokenize

class SpamClassifier:
    def __init__(self):
        # Cache models
        self.bow_vectorizer = None
        self.bow_model = None
        self.ngram_vectorizer = None
        self.ngram_model = None
        
        # Preload default (Bag of Words)
        try:
            print("🔄 Preloading Bag of Words model...")
            self.bow_vectorizer = self._load_pickle("backend/modeles/bow_transformer_unigram.pkl")
            self.bow_model = self._load_pickle("backend/modeles/spam_detect_model_unigram.pkl")
            print("✅ Bag of Words model loaded successfully")
        except Exception as e:
            print(f"⚠️ Could not preload Bag of Words model: {e}")

    def predict(self, text: str, vectorization: str = "Bag of Words", model_type: str = "logistic_regression"):
        current_model = None
        current_vectorizer = None
        
        print(f"Requesting prediction with: {vectorization}, {model_type}")
        print(f"Input text: {text}")

        if vectorization == "Bag of Words":
            # Load Unigram (should be preloaded)
            if self.bow_vectorizer and self.bow_model:
                current_vectorizer = self.bow_vectorizer
                current_model = self.bow_model
            else:
                # Try loading again if failed during init
                try:
                    self.bow_vectorizer = self._load_pickle("backend/modeles/bow_transformer_unigram.pkl")
                    self.bow_model = self._load_pickle("backend/modeles/spam_detect_model_unigram.pkl")
                    current_vectorizer = self.bow_vectorizer
                    current_model = self.bow_model
                except Exception as e:
                     print(f"❌ Error loading BoW model: {e}")
                     return {"prediction": "ERROR", "confidence": 0.0, "details": {"tokens": [f"BoW error: {e}"], "vector": []}}

        elif vectorization == "n-grams":
            # Load Bigram (lazy load)
            try:
                if self.ngram_vectorizer is None or self.ngram_model is None:
                    self.ngram_vectorizer = self._load_pickle("backend/modeles/bow_transformer_bigram.pkl")
                    self.ngram_model = self._load_pickle("backend/modeles/spam_detect_model_bigram.pkl")
                
                current_vectorizer = self.ngram_vectorizer
                current_model = self.ngram_model
            except Exception as e:
                print(f"❌ Error loading n-grams model: {e}")
                return {"prediction": "ERROR", "confidence": 0.0, "details": {"tokens": [f"n-grams error: {e}"], "vector": []}}
        
        else:
            # Type de vectorisation non supporté
            print(f"❌ Vectorization type '{vectorization}' not supported")
            return {
                "prediction": "ERROR",
                "confidence": 0.0,
                "details": {"tokens": [f"Vectorization '{vectorization}' not supported. Use 'Bag of Words' or 'n-grams'."], "vector": []}
            }

        # Perform Prediction
        try:
            if not current_vectorizer or not current_model:
                raise ValueError("Model or Vectorizer not loaded")

            # Clean text before vectorization
            cleaned = clean_text(text)
            print(f"Cleaned text: {cleaned}")
            
            # Vectorize
            vector_data = current_vectorizer.transform([cleaned])
            
            # Predict
            prediction = current_model.predict(vector_data)[0]
            proba = current_model.predict_proba(vector_data).max()
            
            # Extract features
            feature_names = current_vectorizer.get_feature_names_out()
            feature_index = vector_data.nonzero()[1]
            
            tokens = []
            vector_values = []
            for idx in feature_index:
                tokens.append(feature_names[idx])
                vector_values.append(float(vector_data[0, idx]))
            
            print(f"✅ Prediction: {prediction}, Confidence: {proba:.2f}")
            print(f"📊 Tokens found: {tokens}")
            print(f"📊 Vector values: {vector_values}")
                 
            return {
                "prediction": prediction,
                "confidence": float(proba),
                "details": {
                    "tokens": tokens,
                    "vector": vector_values
                }
            }
            
        except Exception as e:
            print(f"❌ Prediction Error: {e}")
            import traceback
            traceback.print_exc()
            return {
                "prediction": "ERROR",
                "confidence": 0.0,
                "details": {"tokens": [f"Error during prediction: {str(e)}"], "vector": []}
            }

    def _load_pickle(self, path):
        """Load a pickle file with custom mapping for text_process"""
        import sys
        
        # Define text_process dummy or map it if it was used during training
        # This is a workaround because the model was trained in a different environment/script
        # where 'text_process' was likely a function name.
        if not hasattr(sys.modules['__main__'], 'text_process'):
            # Assign our clean_text or tokenize to allow unpickling
            # We map it to 'tokenize' because the vectorizer expects a list of tokens (words),
            # but 'clean_text' returns a single string (which results in char-level tokenization).
            setattr(sys.modules['__main__'], 'text_process', tokenize)
            
        if os.path.exists(path):
            with open(path, 'rb') as f:
                return pickle.load(f)
        raise FileNotFoundError(f"File not found: {path}")

# Global instance
classifier = SpamClassifier()