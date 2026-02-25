import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// Get Profile
app.get('/api/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update Profile
app.put('/api/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phone_number, dob, city } = req.body;

        await pool.query(
            'UPDATE users SET username = $1, email = $2, phone_number = $3, dob = $4, city = $5 WHERE id = $6',
            [username, email, phone_number, dob, city, id]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Example route for user management
app.get('/api/users', async (req, res) => {
    try {
        const allUsers = await pool.query('SELECT * FROM users');
        res.json(allUsers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    try {
        await pool.query('SELECT NOW()');
        console.log('✓ Database connected successfully');
    } catch (err) {
        console.error('✗ Database connection failed:', err.message);
    }
});
