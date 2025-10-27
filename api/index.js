// api/index.js
export default function handler(req, res) {
  res.status(200).json({ message: "Survey Backend API is running!" });
}