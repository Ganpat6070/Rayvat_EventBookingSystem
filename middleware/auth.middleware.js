const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer '))
            return res.status(401).json({ success: 0, msg: 'Unauthorized: No token provided' });

        const token = authHeader.slice(7);
        if (!token) return res.status(401).json({ success: 0, msg: 'Unauthorized: No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError')
            return res.status(401).json({ success: 0, msg: 'Session expired. Please login again' });
        if (error.name === 'JsonWebTokenError')
            return res.status(403).json({ success: 0, msg: 'Invalid token' });
        return res.status(500).json({ success: 0, msg: 'Internal server error' });
    }
};

const adminMiddleware = async (req, res, next) => {
    try {
        if (req.user.role !== 1)
            return res.status(403).json({ success: 0, msg: 'Access denied. Admins only' });
        next();
    } catch (error) {
        return res.status(500).json({ success: 0, msg: 'Internal server error' });
    }
};

module.exports = { authMiddleware, adminMiddleware };
