import { Request, Response, NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers["x-api-key"];

    // Check if header exists
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: "API key missing",
        });
    }

    // Check if value matches
    if (apiKey !== "intern-access-123") {
        return res.status(403).json({
            success: false,
            message: "Invalid API key",
        });
    }

    // ✅ Valid → allow request
    next();
};

export default authMiddleware;