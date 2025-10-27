// routes/debug.js
import express from "express";
const router = express.Router();

// Test all the routes
router.get("/test-routes", (req, res) => {
  res.json({
    message: "Debug route working",
    availableRoutes: [
      "/api/auth/login",
      "/api/auth/register", 
      "/api/management-responses",
      "/api/hr-self-assessment",
      "/api/user-survey"
    ],
    timestamp: new Date()
  });
});

// Test specific routes
router.get("/test-management", (req, res) => {
  res.json({ message: "Management route test", working: true });
});

router.get("/test-hr", (req, res) => {
  res.json({ message: "HR route test", working: true });
});

router.get("/test-user", (req, res) => {
  res.json({ message: "User survey route test", working: true });
});

export default router;