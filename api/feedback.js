// api/feedback.js 
import dbConnect from "../lib/dbConnect.js";
import Feedback from "../models/Feedback.js";
import { verifyAdmin } from "../lib/adminAuth.js";
import { enableCORS } from '../lib/cors.js';

async function handler(req, res) {
  await dbConnect();

  // POST endpoint to submit feedback (public, no admin auth needed)
  if (req.method === "POST") {
    try {
      const payload = {
        consultancyType: req.body.consultancyType?.trim() || "",
        consultancyDates: req.body.consultancyDates?.trim() || "",
        consultants: req.body.consultants?.trim() || "",
        clientCompany: req.body.clientCompany?.trim() || "",
        departments: req.body.departments?.trim() || "",
        picName: req.body.picName?.trim() || "",
        picPosition: req.body.picPosition?.trim() || "",
        email: req.body.email?.trim() || "",
        q1_1: req.body.q1_1,
        q1_2: req.body.q1_2,
        q1_3: req.body.q1_3,
        q2_1: req.body.q2_1,
        q2_2: req.body.q2_2,
        q2_3: req.body.q2_3,
        q2_4: req.body.q2_4,
        q3: req.body.q3,
        comments: req.body.comments?.trim() || "",
        consent: req.body.consent,
        submissionDate: req.body.submissionDate || new Date()
      };

      // Validate required fields
      const requiredFields = ['consultancyType', 'consultancyDates', 'consultants', 'clientCompany', 
                             'departments', 'picName', 'picPosition', 'email', 'consent'];
      const missingFields = requiredFields.filter(field => !payload[field] || payload[field] === '');
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        });
      }

      const response = new Feedback(payload);
      await response.save();

      return res.status(201).json({ 
        success: true, 
        message: "Feedback submitted successfully!",
        id: response._id 
      });
    } catch (err) {
      console.error('Error saving feedback:', err);
      return res.status(500).json({ 
        success: false, 
        error: err.message,
        message: "Failed to submit feedback. Please try again." 
      });
    }
  }

  // GET endpoint to retrieve all feedback (admin only)
  if (req.method === "GET") {
    const admin = verifyAdmin(req, res);
    if (!admin) return;

    try {
      const responses = await Feedback.find().sort({ submissionDate: -1 });
      
      // Add surveyType for consistency with other surveys in dashboard
      const normalized = responses.map(r => ({
        ...r.toObject(),
        surveyType: 'feedback'
      }));
      
      return res.status(200).json(normalized);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      return res.status(500).json({ 
        success: false, 
        error: err.message,
        message: "Failed to fetch feedback responses" 
      });
    }
  }

  // DELETE endpoint to delete a feedback response (admin only)
  if (req.method === "DELETE") {
    const admin = verifyAdmin(req, res);
    if (!admin) return;

    const { id } = req.query;
    if (!id) return res.status(400).json({ 
      success: false, 
      message: "Missing ID parameter" 
    });

    try {
      const result = await Feedback.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ 
        success: false, 
        message: "Feedback response not found" 
      });
      
      return res.status(200).json({ 
        success: true, 
        message: "Feedback deleted successfully" 
      });
    } catch (err) {
      console.error('Error deleting feedback:', err);
      return res.status(500).json({ 
        success: false, 
        error: err.message,
        message: "Failed to delete feedback response" 
      });
    }
  }

  // Handle OPTIONS requests for CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Method not allowed
  res.setHeader("Allow", ["GET", "POST", "DELETE", "OPTIONS"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

// Export with CORS enabled (same as management.js)
export default enableCORS(handler);