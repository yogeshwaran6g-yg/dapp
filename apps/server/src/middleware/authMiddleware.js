import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/constants.js';

const authMiddleware = (req, res, next) => {
    const JWT_SECRET = JWT_CONFIG.JWT_SECRET;
    const token = req.header('Authorization')?.split(' ')[1];

    console.log(`[AuthMiddleware] Received token: "${token?.substring(0, 10)}..." (Length: ${token?.length})`);

    if (!token || token === 'undefined' || token === 'null') {
        console.error('[AuthMiddleware] No valid token found in request');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        console.log(`[AuthMiddleware] Verifying token with secret existence: ${!!JWT_SECRET}`);
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('[AuthMiddleware] Token verification failed:', err.message);
        if (err.name === 'TokenExpiredError') {
            console.error('[AuthMiddleware] Token expired at:', err.expiredAt);
        }
        res.status(401).json({ message: `Token is not valid: ${err.message}` });
    }
};

export default authMiddleware;
