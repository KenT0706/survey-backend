// api/auth.js
console.log("🔄 Auth API called:", req.method, req.url);

import dbConnect from "../lib/dbConnect.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export default async function handler(req, res) {
  // Always set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*"); // you can restrict to http://localhost:5173 if you prefer
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Authorization"
  );

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  await dbConnect();

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { action } = req.query;
  const { username, password } = req.body;

  try {
    if (action === "register") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin)
        return res.status(400).json({ success: false, message: "Admin exists" });

      const existingUser = await User.findOne({ username });
      if (existingUser)
        return res.status(400).json({ success: false, message: "Username exists" });

      const user = new User({ username, password, role: "admin" });
      await user.save();
      return res.json({ success: true, message: "Admin registered" });
    }

    if (action === "login") {
      const user = await User.findOne({ username });
      if (!user)
        return res.status(400).json({ success: false, message: "Invalid username" });

      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return res.status(400).json({ success: false, message: "Invalid password" });

      const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        success: true,
        token,
        username: user.username,
        role: user.role
      });
    }

    return res.status(400).json({ success: false, message: "Invalid action" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
