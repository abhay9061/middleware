import { Request, Response, NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const apiKey = req.headers["x-api-key"];

    // Check if header exists and is correct
    if (apiKey && apiKey === "intern-access-123") {
      next();
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export default authMiddleware;