// models/UserSurveyResponse.js
import mongoose from "mongoose"

const ratingSchema = new mongoose.Schema({
  importance: String,
  implementation: String,
});

const userSurveySchema = new mongoose.Schema({
  name: String,
  position: String,
  department: String, // ADD THIS FIELD
  dateJoined: String, 
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

export default mongoose.model("UserSurveyResponse", userSurveySchema);