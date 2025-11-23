# Meta Sender Protect (MSP) - Email Spam Detection System

A reproducible spam detection system built with TF-IDF + Linear SVM, featuring a React frontend UI and Flask backend API.

## Features

✅ **Dual Model Comparison**
- Baseline: TF-IDF + Linear SVM
- Enhanced: TF-IDF + Domain Metadata + Linear SVM

✅ **Real-time Predictions**
- Analyze emails via text input or `.eml` file upload
- Get instant spam/ham classification with confidence scores

✅ **User-Friendly Interface**
- Beautiful blue & gold Isatu University branding
- Explanations for non-technical users
- Responsive design for mobile & desktop

✅ **Verified Metrics**
- 99.46% accuracy on 39,154 email dataset
- Calibrated probabilities (Platt scaling)
- K-fold cross-validation results included

## Quick Start

### Local Development
```bash
# Backend
cd backend
pip install -r requirements.txt
python app.py

# Frontend (in new terminal)
cd frontend
npm install
npm start
```

Visit `http://localhost:3000`

### Deploy to Render
See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions.

## Project Structure

```
MSP/
├── backend/
│   ├── app.py                 # Flask API
│   ├── requirements.txt       # Python dependencies
│   ├── train_verified.py      # Training script
│   ├── text_meta_transformer.py
│   ├── models/                # Trained pipelines
│   ├── experiments_out/       # Metrics & artifacts
│   └── datasets/
│       └── final_dataset.csv  # 39,154 emails
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── App.css           # Styling
│   │   └── index.js
│   ├── package.json
│   └── public/
├── thesis/
│   ├── thesis.tex            # Academic paper
│   └── README_thesis.md
├── Procfile                   # Render deployment
├── render.yaml               # Render config
├── .gitignore
└── DEPLOYMENT.md             # Setup guide
```

## Technology Stack

**Backend:**
- Python 3.12
- Flask + Flask-CORS
- scikit-learn (TF-IDF, LinearSVC, CalibratedClassifierCV)
- Joblib (model persistence)
- Pandas, NumPy

**Frontend:**
- React 18
- Recharts (metrics visualization)
- CSS3 (responsive design)

**Data:**
- Enron dataset (39,154 emails)
- 80/20 train/test split
- Stratified sampling

## Model Performance

| Metric | Baseline | Enhanced |
|--------|----------|----------|
| Accuracy | 99.46% | 99.46% |
| Precision | 99.45% | 99.45% |
| Recall | 99.59% | 99.59% |
| F1-Score | 99.52% | 99.52% |

*Note: Enhanced model with domain features achieves same performance, indicating TF-IDF captures sufficient signal for this task.*

## API Endpoints

### `GET /api/metrics`
Returns verified model performance metrics.

### `POST /api/analyze`
Analyze text input.
```json
{
  "sender_email": "user@example.com",
  "email_content": "Email text here",
  "use_enhanced": false
}
```

### `POST /api/analyze-file`
Upload `.eml` file for analysis.

### `GET /api/health`
Health check endpoint.

## Training

To retrain models:
```bash
cd backend
python train_verified.py
```

This creates:
- `models/baseline_pipeline.pkl`
- `models/enhanced_pipeline.pkl`
- `experiments_out/verified_metrics.json`

## Thesis

Academic paper documenting the system is in `thesis/thesis.tex`. Includes:
- Dataset description
- Methods & model architecture
- Results & evaluation
- Cross-validation metrics
- Reproducibility documentation

Compile with: `pdflatex thesis.tex`

## Authors

Built for Isatu University thesis project.

## License

Academic use only.
