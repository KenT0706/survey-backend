// routes/hrSelfAssessment.js
import express from "express";
import mongoose from "mongoose";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

const hrResponseSchema = new mongoose.Schema({
  name: { type: String, default: "Anonymous" },
  position: { type: String, default: "" },
  dateJoined: { type: String, default: "" }, // you're saving DD/MM/YYYY string in frontend
  assessmentDate: { type: Date, default: Date.now },
  hr1: { type: Array, default: [] },
  hr2: { type: Array, default: [] },
  hr3: { type: Array, default: [] },
  hr4: { type: Array, default: [] },
  hr5: { type: Array, default: [] },
  hr6: { type: Array, default: [] },
  obstacles: { type: String, default: "" },
  strengthsWeaknesses: { type: String, default: "" },
  submittedAt: { type: Date, default: Date.now }
});

// routes/hrSelfAssessment.js
const HRResponse =
  mongoose.models.HRResponse ||
  mongoose.model("HRResponse", hrResponseSchema, "hrselfassessmentresponses");


// POST create (optional if you already have one elsewhere)
router.post("/", async (req, res) => {
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
      strengthsWeaknesses: req.body.strengthsWeaknesses || ""
    };
    const doc = new HRResponse(payload);
    await doc.save();
    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    console.error("Error saving HR self-assessment:", err);
    return res.status(500).json({ success: false, message: "Failed to save HR self-assessment" });
  }
});

router.get("/", adminAuth, async (req, res) => {
  try {
    const docs = await HRResponse.find().sort({ submittedAt: -1 });
    res.status(200).json(docs);
  } catch (err) {
    console.error("Error fetching HR self-assessments:", err);
    res.status(500).json({ success: false, message: "Failed to fetch HR self-assessments" });
  }
});

// DELETE by id (admin protected)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const deleted = await HRResponse.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Response not found" });
    }
    res.json({ success: true, message: "Response deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: "Server error deleting response" });
  }
});

export default router;