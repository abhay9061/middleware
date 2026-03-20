import express, { Request, Response } from "express";
import authMiddleware from "./middleware/auth";
// import studentRoutes from "./routes/students";
import studentsRoutes from "./routes/students";

const app = express();
app.use(express.json());

app.use("/api/students", studentsRoutes);
app.use("api/students/:id", studentsRoutes);

app.get("/health", authMiddleware, (req: Request, res: Response) => {
  res.send("Application is Running");
})



app.get("/api/protected-message", authMiddleware, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Auth Middleware is working correctly"
  });
});


const PORT: number = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});