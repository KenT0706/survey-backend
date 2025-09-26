// lib/cors.js
export function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}

export function handlePreflight(req, res) {
  if (req.method === 'OPTIONS') {
    setCORSHeaders(res);
    res.status(200).end();
    return true;
  }
  return false;
}

// Add a comprehensive CORS handler
export function enableCORS(handler) {
  return async (req, res) => {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      setCORSHeaders(res);
      res.status(200).end();
      return;
    }
    
    // Set CORS headers for actual requests
    setCORSHeaders(res);
    
    // Call the actual handler
    return handler(req, res);
  };
}