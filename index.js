// index.js
export default function handler(req, res) {
  res.status(200).json({
    message: "Survey Backend API is running!",
    routes: [
      "/api/auth?action=login",
      "/api/auth?action=register",
      "/api/hr-self-assessment",
      "/api/management",
      "/api/user-survey"
    ]
  });
}
