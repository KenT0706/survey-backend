// api/index.js
module.exports = (req, res) => {
  res.status(200).json({ message: "Survey Backend API is running!" });
};