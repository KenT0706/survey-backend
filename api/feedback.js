const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback'); // We'll create this model

// POST endpoint to submit feedback
router.post('/', async (req, res) => {
  try {
    console.log('Received feedback submission:', req.body);

    // Create new feedback document
    const newFeedback = new Feedback({
      consultancyType: req.body.consultancyType,
      consultancyDates: req.body.consultancyDates,
      consultants: req.body.consultants,
      clientCompany: req.body.clientCompany,
      departments: req.body.departments,
      picName: req.body.picName,
      picPosition: req.body.picPosition,
      email: req.body.email,
      q1_1: req.body.q1_1,
      q1_2: req.body.q1_2,
      q1_3: req.body.q1_3,
      q2_1: req.body.q2_1,
      q2_2: req.body.q2_2,
      q2_3: req.body.q2_3,
      q2_4: req.body.q2_4,
      q3: req.body.q3,
      comments: req.body.comments,
      consent: req.body.consent,
      submissionDate: new Date()
    });

    // Save to database
    const savedFeedback = await newFeedback.save();
    
    console.log('Feedback saved successfully:', savedFeedback._id);
    
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      id: savedFeedback._id
    });
    
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
});

// GET endpoint to retrieve all feedback (for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ submissionDate: -1 });
    
    // Add surveyType for consistency with other surveys in dashboard
    const feedbacksWithType = feedbacks.map(feedback => ({
      ...feedback._doc,
      surveyType: 'feedback'
    }));
    
    res.json(feedbacksWithType);
    
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedbacks',
      error: error.message
    });
  }
});

// DELETE endpoint to delete a feedback response
router.delete('/', async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Feedback ID is required'
      });
    }

    const deletedFeedback = await Feedback.findByIdAndDelete(id);
    
    if (!deletedFeedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback',
      error: error.message
    });
  }
});

// GET endpoint to get a single feedback by ID
router.get('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    res.json(feedback);
    
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
});

// GET endpoint for feedback statistics (optional, for future use)
router.get('/stats/summary', async (req, res) => {
  try {
    const totalFeedbacks = await Feedback.countDocuments();
    
    // Average ratings for each question
    const averageRatings = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avg_q1_1: { $avg: "$q1_1" },
          avg_q1_2: { $avg: "$q1_2" },
          avg_q1_3: { $avg: "$q1_3" },
          avg_q2_1: { $avg: "$q2_1" },
          avg_q2_2: { $avg: "$q2_2" },
          avg_q2_3: { $avg: "$q2_3" },
          avg_q2_4: { $avg: "$q2_4" }
        }
      }
    ]);
    
    // Consent statistics
    const consentStats = await Feedback.aggregate([
      {
        $group: {
          _id: "$consent",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Recommendation statistics
    const recommendationStats = await Feedback.aggregate([
      {
        $group: {
          _id: "$q3",
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        totalFeedbacks,
        averageRatings: averageRatings[0] || {},
        consentStats,
        recommendationStats
      }
    });
    
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback statistics',
      error: error.message
    });
  }
});

module.exports = router;