// api/index.js
const app = require("../server");
module.exports = app;

module.exports = (req, res) => {
  res.status(200).json({ message: "Survey Backend API is running!" });
};