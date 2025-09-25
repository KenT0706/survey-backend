// routes/managementResponses.js
import express from "express";
import mongoose from "mongoose";
import verifyToken from "../middleware/auth.js";
import { verifyAdmin } from "../lib/adminAuth.js"; // Add this import

const router = express.Router();

// Schema
const managementSchema = new mongoose.Schema({
  managerName: String,
  position: String,
  dateJoined: Date,
  assessmentDate: { type: Date, default: Date.now },
  answers: Array, // [{ question: String, importance: Number, implementation: Number }]
  obstacles: String,
  suggestions: String,
});

const ManagementResponse = mongoose.model("ManagementResponse", managementSchema);

// POST
router.post("/", async (req, res) => {
  try {
    const response = new ManagementResponse(req.body);
    await response.save();
    res.status(201).json(response);
  } catch (err) {
    console.error("Error saving management response:", err);
    res.status(500).json({ error: "Failed to save management response" });
  }
});

// GET - ADD ADMIN AUTHENTICATION
router.get("/", async (req, res) => {
  try {
    // Verify admin access
    const admin = verifyAdmin(req, res);
    if (!admin) return;

    const responses = await ManagementResponse.find();
    res.json(responses);
  } catch (err) {
    console.error("Error fetching management responses:", err);
    res.status(500).json({ error: "Failed to fetch management responses" });
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await ManagementResponse.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Response not found" });
    }
    res.json({ success: true, message: "Response deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;