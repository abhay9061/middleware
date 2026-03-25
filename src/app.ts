import dotenv from "dotenv";
dotenv.config(); // 👈 SABSE PEHLE

import express, { Request, Response, NextFunction } from "express";

// ✅ V1 Routes
import studentRoutes from "./routes/student.routes";

// ✅ V2 Routes (new)
import studentV2Routes from "./v2/routes/student.routes";

const app = express();

// Middleware
app.use(express.json());

// =====================
// 🔹 V1 Routes
// =====================
app.use("/students", studentRoutes);

// =====================
// 🔹 V2 Routes (Queue Based)
// =====================
app.use("/v2/students", studentV2Routes);

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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running 🚀 on port ${port}`);
});

export default app;