//api/hr-self-assessment.js
import dbConnect from "../lib/dbConnect.js";
import HRSelfAssessmentResponse from "../models/HRSelfAssessmentResponse.js";
import { verifyAdmin } from "../lib/adminAuth.js";
import Cors from 'cors';

// Initialize CORS middleware
const cors = Cors({
  origin: '*', // or specify your frontend URL: 'http://localhost:3000'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Run CORS middleware
  await runMiddleware(req, res, cors);
  await dbConnect();

  if (req.method === "POST") {
    try {
      const payload = {
        name: req.body.name || "Anonymous",
        position: req.body.position || "",
        dateJoined: req.body.dateJoined || "",
        assessmentDate: req.body.assessmentDate || new Date(),
        hr1: req.body.hr1 || [],
        hr2: req.body.hr2 || [],
        hr3: req.body.hr3 || [],
        hr4: req.body.hr4 || [],
        hr5: req.body.hr5 || [],
        hr6: req.body.hr6 || [],
        obstacles: req.body.obstacles || "",
        strengthsWeaknesses: req.body.strengthsWeaknesses || "",
      };
      const response = new HRSelfAssessmentResponse(payload);
      await response.save();
      return res.status(201).json({ success: true, message: "HR self-assessment saved!" });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === "GET") {
    if (!verifyAdmin(req, res)) return;
    try {
      const responses = await HRSelfAssessmentResponse.find().sort({ submittedAt: -1 });
      return res.status(200).json(responses);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === "DELETE") {
    if (!verifyAdmin(req, res)) return;
    const { id } = req.query;
    if (!id) return res.status(400).json({ success: false, message: "Missing ID parameter" });

    try {
      const result = await HRSelfAssessmentResponse.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ success: false, message: "Response not found" });
      return res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
