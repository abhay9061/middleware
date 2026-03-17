// middleware/auth.js

const authMiddleware = (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    // Check if header exists and is correct
    if (apiKey && apiKey === 'intern-access-123') {
      next(); // allow request
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

module.exports = authMiddleware;