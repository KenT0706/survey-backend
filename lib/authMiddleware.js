//lib/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function verifyUser(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("username role");
    return user; // return the user object
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return null;
  }
}