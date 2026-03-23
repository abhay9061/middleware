import { Request, Response, NextFunction } from "express";

export const apiKeyMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const apiKey = req.headers["x-api-key"];

        // ✅ Check
        if (apiKey !== "intern-access-123") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // ✅ Allowed
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};