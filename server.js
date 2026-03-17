// server.js

const express = require('express');
const authMiddleware = require('./middleware/auth');
const studentRoutes = require('./routes/students');

const app = express(); // ✅ FIRST create app

app.use(express.json()); // middleware

// Public route
app.get('/health', (req, res) => {
  res.json({ message: "Server is running" });
});

// Dummy protected route
app.get('/api/protected-message', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Auth middleware is working correctly"
  });
});

// ✅ NOW use routes
app.use('/api/students', studentRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});