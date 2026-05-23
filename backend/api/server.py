from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import random

from preprocessing.log_parser import parse_logs
from feature_engineering.feature_builder import build_behavior_features
from models.behavior_model import predict_behavior
from nlp.nlp_model import predict_nlp

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database to fuse signals per employee
# Structure: {emp_id: {..., history: [], insights: [], department: ""}}
employee_db = {}

def get_department(emp_id):
    emp_str = str(emp_id)
    if "EX-0" in emp_str: return "Engineering"
    if "EX-1" in emp_str: return "Finance"
    if "EX-2" in emp_str: return "Sales"
    return "Operations"

def generate_insights(b_score, n_score, final_risk):
    insights = []
    if b_score > 0.5: insights.append("technical_anomaly")
    if n_score > 0.5: insights.append("linguistic_signaling")
    if final_risk > 0.7: insights.append("critical_alert")
    if b_score < 0.1 and n_score < 0.1: insights.append("nominal_baseline")
    return insights

def update_db(emp_id, b_score=None, n_score=None):
    if emp_id not in employee_db:
        employee_db[emp_id] = {
            "employee_id": emp_id, 
            "behavior_score": 0.0, 
            "nlp_score": 0.0, 
            "final_risk": 0.0,
            "department": get_department(emp_id),
            "history": [],
            "insights": []
        }
    
    emp = employee_db[emp_id]
    
    if b_score is not None:
        emp["behavior_score"] = round(float(b_score), 4)
    if n_score is not None:
        emp["nlp_score"] = round(float(n_score), 4)
    
    # Calculate Risk Fusion
    new_risk = round(0.6 * emp["behavior_score"] + 0.4 * emp["nlp_score"], 4)
    emp["final_risk"] = new_risk
    
    # Update History (Max 10 entries)
    emp["history"].append(new_risk)
    if len(emp["history"]) > 10:
        emp["history"] = emp["history"][-10:]
        
    # Generate Insights
    emp["insights"] = generate_insights(emp["behavior_score"], emp["nlp_score"], new_risk)

@app.get("/")
def home():
    return {"message": "Gadaar Engine: Neural Fusion API running"}

@app.post("/upload_behavior_logs")
async def upload_behavior_logs(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    parsed_logs = parse_logs(df)
    features = build_behavior_features(parsed_logs)
    results = predict_behavior(features)
    
    records = results.to_dict(orient="records")
    for rec in records:
        update_db(rec["employee_id"], b_score=rec["behavior_score"])
        
    return list(employee_db.values())

@app.post("/upload_text_logs")
async def upload_text_logs(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    results = predict_nlp(df)
    
    records = results.to_dict(orient="records")
    for rec in records:
        update_db(rec["employee_id"], n_score=rec["nlp_score"])
        
    return list(employee_db.values())

@app.get("/employee_risk")
def get_employee_risk():
    return list(employee_db.values())