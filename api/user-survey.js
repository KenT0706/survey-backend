<<<<<<< HEAD
//api/user-survey.js
=======
>>>>>>> e7133960979c72122969b6f163b68653db7c55ff
import dbConnect from "../lib/dbConnect.js";
import UserSurveyResponse from "../models/UserSurveyResponse.js";
import { verifyAdmin } from "../lib/adminAuth.js";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const payload = {
        name: req.body.name || "Anonymous",
        position: req.body.position || "",
        department: req.body.department || "",
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
      const response = new UserSurveyResponse(payload);
      await response.save();
      return res.status(201).json({ success: true, message: "User survey saved!" });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === "GET") {
    if (!verifyAdmin(req, res)) return;
    try {
      const responses = await UserSurveyResponse.find().sort({ submittedAt: -1 });
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
      const result = await UserSurveyResponse.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ success: false, message: "Response not found" });
      return res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
