from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .model import classifier

app = FastAPI(title="Spam/Ham Classifier API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageInput(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "Spam/Ham Classifier API is running"}

@app.post("/predict")
def predict_spam(input: MessageInput):
    if not input.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    result = classifier.predict(input.text)
    return result
