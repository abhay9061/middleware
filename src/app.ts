import dotenv from "dotenv";
dotenv.config(); // 👈 SABSE PEHLE

import express, { Request, Response, NextFunction } from "express";
import studentRoutes from "./routes/student.routes";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/students", studentRoutes);

// Health Check
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "API is running 🚀",
  });
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server running 🚀 ${port}`);
});

export default app;