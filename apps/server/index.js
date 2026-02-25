import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import userRoutes from './src/routes/userRoutes.js';
import errorHandler from './src/middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

app.use('/api/users', userRoutes);

// Error Handling Middleware (must be after routes)
app.use(errorHandler);

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    try {
        await pool.query('SELECT NOW()');
        console.log('✓ Database connected successfully');
    } catch (err) {
        console.error('✗ Database connection failed:', err.message);
    }
});
