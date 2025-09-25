// api/health.js
import dbConnect from "../lib/dbConnect.js";

export default async function handler(req, res) {
  try {
    await dbConnect();
    return res.json({ status: "OK", db: "connected" });
  } catch (err) {
    return res.status(500).json({ status: "FAIL", error: err.message });
  }
}
