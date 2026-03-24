import { Request, Response, NextFunction } from "express";
import redisClient from "../../config/redis";
import { generateHashKey } from "../../utils/hash-url";

export const preCacheMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // ✅ Default flags
        res.locals.cachePolicy = {
            skipCacheRead: false,
            skipCacheWrite: false,
            cacheStatus: "MISS",
            cacheKey: ""
        };

        // ❌ Only GET
        if (req.method !== "GET") {
            res.locals.cachePolicy.skipCacheRead = true;
            res.locals.cachePolicy.skipCacheWrite = true;
            res.locals.cachePolicy.cacheStatus = "BYPASS";
            return next();
        }

        const cacheControl = String(req.headers["cache-control"] || "").toLowerCase();

        //  no-store
        if (cacheControl.includes("no-store")) {
            res.locals.cachePolicy.skipCacheRead = true;
            res.locals.cachePolicy.skipCacheWrite = true;
            res.locals.cachePolicy.cacheStatus = "BYPASS";
            return next();
        }

        //  no-cache
        if (cacheControl.includes("no-cache")) {
            res.locals.cachePolicy.skipCacheRead = true;
            res.locals.cachePolicy.cacheStatus = "BYPASS";
            return next();
        }

        // URL
        const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

        // private handling
        const isPrivate = cacheControl.includes("private");
        const userId = (req as any).user?.id || "guest";

        const keyBase = isPrivate ? `${fullUrl}-${userId}` : fullUrl;

        const cacheKey = generateHashKey(keyBase);

        res.locals.cachePolicy.cacheKey = cacheKey;

        //  skip read?
        if (res.locals.cachePolicy.skipCacheRead) {
            return next();
        }

        const cachedData = await redisClient.get(cacheKey);

        //  HIT
        if (cachedData) {
            res.locals.cachePolicy.cacheStatus = "HIT";
            res.setHeader("X-Cache", "HIT");

            return res.status(200).json(JSON.parse(cachedData));
        }

        //  MISS
        res.locals.cachePolicy.cacheStatus = "MISS";
        res.setHeader("X-Cache", "MISS");

        next();

    } catch (err) {
        next(err);
    }
};