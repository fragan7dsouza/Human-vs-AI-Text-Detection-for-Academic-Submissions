# 🛡️ **Human vs AI Academic Text Detector**

An advanced machine learning system designed to classify academic text as either **Human-written** or **AI-generated**. The project uses a **Logistic Regression** model trained on a massive dataset of ~500k rows to identify linguistic patterns, word frequencies, and structural nuances.

Built with **Python**, **Flask**, and a modern **React + Tailwind** frontend.

🔥 **Features**

* **Real-time ML Analysis:** Instant classification of text using a trained backend model.
* **Probabilistic Results:** Provides a confidence percentage for every verdict.
* **Massive Dataset Training:** Model trained on ~500k rows of balanced human and AI text.
* **Clean & Responsive UI:** Built with ShadCN components for a professional academic feel.
* **Fully Local Processing:** Privacy-focused analysis with no data leaving your local server.

---

## 🚀 **Tech Stack**

### **Backend**

* Python 3.10+
* Flask (REST API)
* Scikit-Learn (Logistic Regression + TF-IDF)
* Pandas (Data processing)
* Joblib (Model serialization)

### **Frontend**

* React 18 (Vite)
* TypeScript
* Tailwind CSS
* Lucide React (Icons)

---

## 📦 **Project Structure**

```
Human-vs-AI-Text-Detection/
│
├── backend/                # python ml backend
│   ├── app.py              # flask api server
│   ├── train_model.py      # model training script
│   ├── AI_Human.csv        # kaggle dataset (ignored by git)
│   ├── detector_model.pkl  # trained ml model
│   └── vectorizer.pkl      # tf-idf vectorizer
│
├── src/                    # react frontend source
│   ├── components/
│   │   └── TextAnalyzer.tsx # main detection interface
│   └── pages/
│       └── Index.tsx        # landing page
│
├── index.html              # entry point
├── package.json            # frontend dependencies
└── tsconfig.json           # typescript configuration

```

---

## 🧠 **Model Training**

The model utilizes **TF-IDF Vectorization** with an `ngram_range` of (1, 2) to capture both individual words and common phrasing patterns.

To train the model:

```bash
cd backend
python train_model.py

```

The script performs class balancing (undersampling) to ensure the detector does not have a statistical bias toward "AI" results.

---

## 🔥 **Running the Backend**

```bash
cd backend
python app.py

```

The Flask server will run on `http://127.0.0.1:5000` and handle POST requests at the `/analyze` endpoint.

---

## 🎨 **Running the Frontend**

```bash
# from the root directory
npm install
npm run dev

```

The frontend will be available at `http://localhost:8080` (or the port specified by Vite).

---

## 🖼️ **Features Overview**

### ✔ Text Analysis

Paste any academic text (minimum 10 words) into the analyzer. The backend transforms the text into numerical vectors and runs it through the Logistic Regression model.

### ✔ Dynamic Verdicts

The UI updates instantly to show "Likely Human-Written" or "Likely AI-Generated" based on the model's prediction.

### ✔ Confidence Meter

A visual progress bar displays the model's confidence level (0-100%) in its current verdict.

---

## 👨‍💻 Author

**Fragan Dsouza**

📎 [LinkedIn](https://linkedin.com/in/fragan-dsouza) 




💻 [GitHub](https://github.com/fragan7dsouza)

---

## 📜 License

This project is open-source under the **MIT License**.
