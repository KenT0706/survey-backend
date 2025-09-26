import { setCORSHeaders, handlePreflight } from '../lib/cors.js';

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  setCORSHeaders(res);

  return res.json({
    environment: {
      JWT_SECRET: process.env.JWT_SECRET ? "✓ Set" : "✗ Missing",
      MONGODB_URI: process.env.MONGODB_URI ? "✓ Set" : "✗ Missing",
      NODE_ENV: process.env.NODE_ENV || "not set"
    }
  });
}