import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

export const uploadBehaviorLogs = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await API.post("/upload_behavior_logs", formData);
  return res.data;
};

export const uploadTextLogs = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await API.post("/upload_text_logs", formData);
  return res.data;
};

export const getEmployeeRisk = async () => {
    const res = await API.get("/employee_risk");
    return res.data;
};
