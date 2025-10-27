// models/HRSelfAssessmentResponse.js
import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  importance: String,
  implementation: String,
});

const selfAssessmentSchema = new mongoose.Schema({
  name: String,
  position: String,
  dateJoined: String, // keep as string since user inputs DD/MM/YYYY
  assessmentDate: { type: Date, default: Date.now },
  hr1: [ratingSchema],
  hr2: [ratingSchema],
  hr3: [ratingSchema],
  hr4: [ratingSchema],
  hr5: [ratingSchema],
  hr6: [ratingSchema],
   obstacles: { type: String, default: "" },
  strengthsWeaknesses: { type: String, default: "" },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model("HRSelfAssessmentResponse", selfAssessmentSchema);
