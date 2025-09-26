// lib/cors.js
export function setCORSHeaders(res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*"); // Or specify your frontend URL: "http://localhost:3000"
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );
}

export function handlePreflight(req, res) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }
  return false;
}