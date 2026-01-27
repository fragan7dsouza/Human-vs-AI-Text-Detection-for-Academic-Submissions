import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

df = pd.read_csv('AI_Human.csv')

counts = df['generated'].value_counts()
min_count = counts.min()

df_human = df[df['generated'] == 0].sample(min_count, random_state=42)
df_ai = df[df['generated'] == 1].sample(min_count, random_state=42)
df_balanced = pd.concat([df_human, df_ai]).sample(frac=1, random_state=42)

tfidf = TfidfVectorizer(
    stop_words='english', 
    max_features=10000, 
    ngram_range=(1, 2)
)

X = tfidf.fit_transform(df_balanced['text'])
y = df_balanced['generated']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LogisticRegression(max_iter=1000, C=1.0)
model.fit(X_train, y_train)

joblib.dump(model, 'detector_model.pkl')
joblib.dump(tfidf, 'vectorizer.pkl')