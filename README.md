# 🛡️ AI Insider Threat Detection System


An advanced, hybrid Machine Learning and Natural Language Processing (NLP) system designed to detect insider threats and anomalies in employee activity logs and communication patterns. The system features a futuristic Security Operations Center (SOC) dashboard.

---

## 🏗️ System Architecture

The project is structured as a monorepo consisting of two primary components:
1. **Python FastAPI Backend**: Hosts the anomaly detection models (Isolation Forest / Random Forest) and NLP models (TF-IDF + Logistic Regression) to analyze behavior logs and linguistic signals.
2. **React Frontend**: A premium, glassmorphism-themed Security Operations Center (SOC) dashboard containing risk widgets, real-time KPI alerts, interactive charts, and incident report exporting.

---

## 🚀 Getting Started

Follow these steps to set up and run the application on your local machine.

### Prerequisites
- **Python 3.8+** installed
- **Node.js (v16+) & npm** installed

---

### 🐍 Step 1: Run the Backend API

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server using Uvicorn:
   ```bash
   uvicorn api.server:app --reload --port 8000
   ```
   *The backend server will run on `http://127.0.0.1:8000`.*

---

### ⚛️ Step 2: Run the Frontend App

1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install the frontend dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   *The React frontend will start and open automatically in your browser at `http://localhost:3000`.*

---

## 📂 Project Structure

```
├── backend/                       # Python FastAPI Backend
│   ├── api/
│   │   └── server.py             # Server endpoints & database logic
│   ├── dataset/                   # Dummy datasets for parsing & training
│   ├── evaluation/                # Model evaluation scripts
│   ├── feature_engineering/       # Feature builders for ML
│   ├── models/                    # Pickled ML models & estimators
│   ├── nlp/                       # NLP pipeline & threat prediction models
│   ├── preprocessing/             # Cleaners and parsers for CSV logs
│   ├── requirements.txt           # Python backend dependencies
│   └── main.py                    # Local pipeline run script
│
├── frontend/                      # React Frontend
│   ├── public/                    # Icons and public index templates
│   ├── src/
│   │   ├── components/            # UI components (KPICards, RiskChart, Heatmaps)
│   │   ├── services/              # API caller service functions
│   │   ├── utils/                 # PDF generator helper functions
│   │   ├── App.js                 # Dashboard controller
│   │   └── index.js               # Entry point
│   ├── tailwind.config.js         # Styling definitions
│   └── package.json               # Frontend dependencies
│
├── insider_threat_final_dataset.csv # Base model training dataset (33 MB)
└── .gitignore                     # Git configuration to ignore dependencies/temp files
```

---

## 📊 Upload Formats

You can upload your activity logs directly through the UI. Use the templates in `backend/dataset/` as a guide:

### Behavior Logs CSV Format:
Required columns: `employee_id`, `activity`, `timestamp`, `pc`, `url` (or equivalent feature logs).

### Text Logs CSV Format:
Required columns: `employee_id`, `text` (communication text/email snippets).

---

## 🛡️ License
Private Project. All Rights Reserved.
