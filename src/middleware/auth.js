import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401).json({ err: "No access token was received" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ err: "Access token could not be verified" });
        req.user = user
        next();
    });
}

export { authenticateToken };