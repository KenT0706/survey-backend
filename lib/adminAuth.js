// lib/adminAuth.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export function verifyAdmin(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ success: false, message: "No token provided" });
    return false;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      res.status(403).json({ success: false, message: "Access denied" });
      return false;
    }

    req.user = decoded;
    return true; // ✅ Must return true if admin is valid
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
    return false;
  }
}
