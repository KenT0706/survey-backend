// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./lib/mongodb.js";
import HRSelfAssessmentResponse from "./models/HRSelfAssessmentResponse.js";
import UserSurveyResponse from "./models/UserSurveyResponse.js";
import ManagementResponse from "./models/ManagementResponse.js";
import { verifyAdmin } from "./lib/adminAuth.js";
import authRoutes from "./api/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to ensure DB connection for each request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
app.use("/auth", authRoutes);

app.get("/api", (req, res) => {
  res.json({ message: "Survey Backend API is running!" });
});

// ---------------------
// Management Responses
// ---------------------
app.get("/api/management-responses", async (req, res) => {
  try {
    const responses = await ManagementResponse.find().sort({ submittedAt: -1 });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/management-responses", async (req, res) => {
  try {
    const response = new ManagementResponse(req.body);
    await response.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/management-responses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ManagementResponse.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ success: false, message: "Response not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------
// HR Self-Assessment
// ---------------------
app.get("/api/hr-self-assessment", async (req, res) => {
  try {
    const responses = await HRSelfAssessmentResponse.find().sort({ submittedAt: -1 });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/hr-self-assessment", async (req, res) => {
  try {
    const response = new HRSelfAssessmentResponse(req.body);
    await response.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/hr-self-assessment", async (req, res) => {
  try {
    const { id } = req.query;
    const result = await HRSelfAssessmentResponse.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ success: false, message: "Response not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------
// User Survey
// ---------------------
app.get("/api/user-survey", async (req, res) => {
  try {
    const responses = await UserSurveyResponse.find().sort({ submittedAt: -1 });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/user-survey", async (req, res) => {
  try {
    const response = new UserSurveyResponse(req.body);
    await response.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/user-survey", async (req, res) => {
  try {
    const { id } = req.query;
    const result = await UserSurveyResponse.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ success: false, message: "Response not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default app;
