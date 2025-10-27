// models/ManagementResponse.js
import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  importance: String,
  implementation: String,
});

const managementSchema = new mongoose.Schema({
  managerName: String,
  team: String,
  assessmentDate: Date,

  // Match all your formData sections
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

export default mongoose.models.ManagementResponse ||
  mongoose.model("ManagementResponse", managementSchema);