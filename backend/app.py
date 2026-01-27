from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app) 

model = joblib.load('detector_model.pkl')
tfidf = joblib.load('vectorizer.pkl')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    text = data.get('text', '')
    
    vectorized_text = tfidf.transform([text])
    
    prediction = model.predict(vectorized_text)[0]
    probability = model.predict_proba(vectorized_text)[0]
    
    verdict = "AI" if prediction == 1 else "Human"
    confidence = max(probability) * 100
    
    return jsonify({
        "verdict": verdict,
        "confidence": round(confidence, 1)
    })

if __name__ == '__main__':
    app.run(port=5000)