import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/constants.js';

const JWT_SECRET = JWT_CONFIG.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export default authMiddleware;
