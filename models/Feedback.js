// models/Feedback.js 
import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  // Basic Information
  consultancyType: {
    type: String,
    required: [true, 'Consultancy type is required']
  },
  consultancyDates: {
    type: String,
    required: [true, 'Consultancy dates/duration is required']
  },
  consultants: {
    type: String,
    required: [true, 'Consultants involved is required']
  },
  clientCompany: {
    type: String,
    required: [true, 'Client/Company is required']
  },
  departments: {
    type: String,
    required: [true, 'Departments involved is required']
  },
  picName: {
    type: String,
    required: [true, 'PIC name is required']
  },
  picPosition: {
    type: String,
    required: [true, 'PIC position is required']
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    trim: true,
    lowercase: true
  },
  
  // Section 1: Consultancy Services (1-5 ratings)
  q1_1: {
    type: Number,
    required: [true, 'Rating for Q1.1 is required'],
    min: 1,
    max: 5
  },
  q1_2: {
    type: Number,
    required: [true, 'Rating for Q1.2 is required'],
    min: 1,
    max: 5
  },
  q1_3: {
    type: Number,
    required: [true, 'Rating for Q1.3 is required'],
    min: 1,
    max: 5
  },
  
  // Section 2: Consultant (1-5 ratings)
  q2_1: {
    type: Number,
    required: [true, 'Rating for Q2.1 is required'],
    min: 1,
    max: 5
  },
  q2_2: {
    type: Number,
    required: [true, 'Rating for Q2.2 is required'],
    min: 1,
    max: 5
  },
  q2_3: {
    type: Number,
    required: [true, 'Rating for Q2.3 is required'],
    min: 1,
    max: 5
  },
  q2_4: {
    type: Number,
    required: [true, 'Rating for Q2.4 is required'],
    min: 1,
    max: 5
  },
  
  // Section 3: Recommendation
  q3: {
    type: String,
    required: [true, 'Recommendation is required'],
    enum: ['disagree', 'agree', 'strongly-agree']
  },
  
  // Section 4: Comments
  comments: {
    type: String,
    maxlength: [2000, 'Comments cannot exceed 2000 characters'],
    default: ''
  },
  
  // Section 5: Consent
  consent: {
    type: String,
    required: [true, 'Consent is required'],
    enum: ['yes', 'no']
  },
  
  // Metadata
  submissionDate: {
    type: Date,
    default: Date.now
  },
  
  // For tracking purposes
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Create index for efficient queries (moved outside schema)
feedbackSchema.index({ clientCompany: 1, submissionDate: -1 });
feedbackSchema.index({ email: 1 });
feedbackSchema.index({ submissionDate: -1 });

// MATCH THE EXACT PATTERN FROM ManagementResponse.js
export default mongoose.models.Feedback ||
  mongoose.model("Feedback", feedbackSchema);