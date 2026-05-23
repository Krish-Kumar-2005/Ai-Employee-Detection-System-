# Hybrid Insider Threat Detection System - Dependency Guide

This project is divided into a **Python FastAPI Backend** and a **React Frontend**. 
Here are all the dependencies we installed to build the SOC dashboard.

---

## 🐍 Backend Dependencies (Python)
These are required for the FastAPI server and the Machine Learning pipelines.
*These are tracked in `backend/requirements.txt`.*

To install:
```bash
cd backend
pip install -r requirements.txt
```

**Core Libraries:**
* `fastapi` - The high-performance API web framework.
* `uvicorn` - The ASGI server to run FastAPI (`uvicorn api.server:app --reload`).
* `python-multipart` - Required by FastAPI to accept `.csv` file uploads.

**Machine Learning & Data Processing:**
* `pandas` - Used to parse, clean, and manipulate the CSV logs.
* `numpy` - Core mathematical operations.
* `scikit-learn==1.6.1` - The ML framework used to train the Logistic Regression & TF-IDF models.
* `joblib` - Used to load the `.pkl` model weight files into memory.

---

## ⚛️ Frontend Dependencies (React / Node.js)
These are required for the futuristic SOC UI. 
*These are automatically tracked in `frontend/package.json`.*

To install all of them at once on a new machine:
```bash
cd frontend
npm install
```

**Core Framework:**
* `react`, `react-dom`, `react-scripts` - Standard Create React App foundation.
* `axios` - Used to make API calls (`POST`, `GET`) from React to the FastAPI backend.

**UI & Styling (The "Premium" Look):**
* `tailwindcss@^3.4.1`, `postcss`, `autoprefixer` - The utility-first CSS engine powering the dark mode and glassmorphism.
* `framer-motion` - The physics-based animation library for the smooth drop-downs and hover effects.
* `lucide-react` - The sleek SVG icon library (used for the `ShieldAlert`, `Sun`, `Moon`, etc).

**Data Visualization & Reporting:**
* `recharts` - The charting library used for the interactive Employee Risk Bar Chart.
* `sonner` - The toaster library used for the slide-in "Scanning..." and "Critical Threat" alerts.
* `jspdf`, `jspdf-autotable` - The client-side PDF generation engine used for the Incident Reporting export.
