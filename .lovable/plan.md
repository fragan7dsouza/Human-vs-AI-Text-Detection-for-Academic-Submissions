
# External Python ML API Integration Plan

## Overview

This plan creates a complete integration between your Lovable app and an external Python ML API for AI text detection. The architecture follows best practices with an edge function acting as a secure proxy to your Python backend.

## Architecture

```text
+-------------------+      +----------------------+      +-------------------------+
|   React Frontend  | ---> |  Supabase Edge Fn    | ---> |  External Python API    |
|   TextAnalyzer    |      |  (text-analyzer)     |      |  (Railway/Render/etc)   |
+-------------------+      +----------------------+      +-------------------------+
        |                           |                              |
   User pastes text          Validates request             TF-IDF + LogReg Model
   Clicks "Analyze"          Forwards to Python            Returns verdict + score
   Shows results             Returns response              Trained on Kaggle data
```

## Implementation Steps

### Step 1: Create the Edge Function

Create a new Supabase edge function `text-analyzer` that:
- Accepts POST requests with the text to analyze
- Validates input (non-empty, minimum word count)
- Forwards the request to your external Python API
- Returns the ML prediction result

**Files to create:**
- `supabase/functions/text-analyzer/index.ts`
- `supabase/config.toml`

### Step 2: Create API Client Library

Create a clean API abstraction layer for calling the edge function:

**File to create:**
- `src/lib/api/textAnalyzer.ts`

### Step 3: Update TextAnalyzer Component

Modify the existing component to:
- Replace the simulated analysis with the real API call
- Handle loading states and errors gracefully
- Display results from the ML model

**File to modify:**
- `src/components/TextAnalyzer.tsx`

### Step 4: Add Python API URL Secret

You will need to provide the URL of your hosted Python ML API as a secret:
- Secret name: `ML_API_URL`
- Example value: `https://your-ml-api.railway.app/analyze`

---

## Recommended Python ML Datasets

For training your external Python API, here are high-quality datasets:

| Dataset | Source | Description |
|---------|--------|-------------|
| AI vs Human Text | [Kaggle](https://www.kaggle.com/datasets/shanegerami/ai-vs-human-text) | 500K+ samples of human and AI text |
| GPT Wiki Intro | [Hugging Face](https://huggingface.co/datasets/aadsblog/GPT-wiki-intro) | Wikipedia intros vs GPT-generated |
| MUSE Corpus | [GitHub](https://github.com/kinit-sk/MUSE) | Multi-domain human vs LLM text |
| HC3 Dataset | [Hugging Face](https://huggingface.co/datasets/Hello-SimpleAI/HC3) | Human ChatGPT Comparison Corpus |

## Sample Python API Code

Here's a complete FastAPI implementation you can host on Railway, Render, or Fly.io:

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

# Load pre-trained model (train this separately)
vectorizer = joblib.load("tfidf_vectorizer.pkl")
model = joblib.load("classifier.pkl")

class TextInput(BaseModel):
    text: str

class PredictionResult(BaseModel):
    verdict: str  # "AI" or "Human"
    confidence: float

def preprocess(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    return text

@app.post("/analyze", response_model=PredictionResult)
async def analyze_text(input: TextInput):
    processed = preprocess(input.text)
    features = vectorizer.transform([processed])
    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0]
    
    confidence = max(probability) * 100
    verdict = "AI" if prediction == 1 else "Human"
    
    return PredictionResult(verdict=verdict, confidence=round(confidence, 1))

@app.get("/health")
async def health():
    return {"status": "ok"}
```

### Training Script

```python
# train_model.py
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import joblib

# Load your dataset (adjust path/format as needed)
df = pd.read_csv("ai_human_text.csv")

X_train, X_test, y_train, y_test = train_test_split(
    df['text'], df['label'], test_size=0.2, random_state=42
)

vectorizer = TfidfVectorizer(max_features=10000, ngram_range=(1, 2))
X_train_tfidf = vectorizer.fit_transform(X_train)

model = LogisticRegression(max_iter=1000)
model.fit(X_train_tfidf, y_train)

# Save models
joblib.dump(vectorizer, "tfidf_vectorizer.pkl")
joblib.dump(model, "classifier.pkl")

print(f"Accuracy: {model.score(vectorizer.transform(X_test), y_test):.2%}")
```

---

## Technical Details

### Edge Function Implementation

The edge function will:
1. Parse incoming JSON with `{ text: string }`
2. Validate minimum word count (10 words)
3. Call the Python API at the URL stored in `ML_API_URL` secret
4. Return the prediction or appropriate error

### API Client Implementation

A TypeScript module that:
1. Imports the Supabase client
2. Invokes the `text-analyzer` edge function
3. Returns typed results or error messages

### Component Updates

The TextAnalyzer component will:
1. Import the new API client
2. Replace `simulateAnalysis` with the real API call
3. Handle network errors gracefully

---

## Next Steps After Implementation

1. **Host your Python API** on Railway, Render, Fly.io, or Hugging Face Spaces
2. **Train the model** using one of the recommended datasets
3. **Add the ML_API_URL secret** through Lovable's secrets management
4. **Test the integration** end-to-end

---

## Requirements Summary

Before I implement this, you will need:
- **A hosted Python ML API** with the `/analyze` endpoint
- **The API URL** to add as a secret (e.g., `https://your-app.railway.app`)

Would you like me to proceed with implementing the edge function and frontend integration? You can add the Python API URL secret later once you have your backend hosted.
