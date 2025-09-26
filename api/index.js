// api/index.js
import withCors from "./_cors.js";

function handler(req, res) {
  res.status(200).json({ message: "Survey Backend API is running!" });
}

export default withCors(handler);
