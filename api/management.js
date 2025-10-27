// api/management.js
import dbConnect from "../lib/dbConnect.js";
import ManagementResponse from "../models/ManagementResponse.js";
import { verifyAdmin } from "../lib/adminAuth.js";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const payload = {
        managerName: req.body.managerName?.trim() || req.body.name?.trim() || "Anonymous",
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

      const response = new ManagementResponse(payload);
      await response.save();

      return res
        .status(201)
        .json({ success: true, message: "Management response saved!" });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === "GET") {
    const admin = verifyAdmin(req, res);
    if (!admin) return;

    try {
      const responses = await ManagementResponse.find().sort({ submittedAt: -1 });
      const normalized = responses.map(r => ({
      ...r.toObject(),
      feedback: [r.obstacles, r.strengthsWeaknesses].filter(Boolean).join("\n\n"),
    }));
      return res.status(200).json(normalized);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === "DELETE") {
    const admin = verifyAdmin(req, res);
    if (!admin) return;

    const { id } = req.query;
    if (!id) return res.status(400).json({ success: false, message: "Missing ID parameter" });

    try {
      const result = await ManagementResponse.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ success: false, message: "Response not found" });
      return res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
