// api/_cors.js
const DEFAULT_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",");

export default function withCors(handler, opts = {}) {
  const allowedOrigins = opts.allowedOrigins || DEFAULT_ORIGINS;
  const allowCredentials = opts.allowCredentials ?? true;

  return async (req, res) => {
    const origin = req.headers.origin;

    // If request origin matches whitelist, echo it. Otherwise use the first allowed origin (or '*').
    const isAllowed = origin && allowedOrigins.includes(origin);
    const safeOrigin = isAllowed ? origin : (allowedOrigins[0] || "*");

    res.setHeader("Access-Control-Allow-Origin", safeOrigin);
    if (allowCredentials) res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Authorization"
    );

    // Handle preflight quickly
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // Call the original handler
    return handler(req, res);
  };
}
