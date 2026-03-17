function authMiddleware(req, res, next) {

    const apiKey = req.get('x-api-key');

    if (apiKey === "intern-access-123") {
        next();
    }
    else {
        return res.status(401).json({
            status: false,
            message: "Unauthorized"
        });
    }
}

module.exports = authMiddleware;