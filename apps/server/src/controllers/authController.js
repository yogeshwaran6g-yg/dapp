import * as authService from '../services/authService.js';

export const getNonce = async (req, res) => {
    try {
        const { address } = req.query;
        if (!address) {
            return res.status(400).json({ message: 'Wallet address is required' });
        }

        const nonce = await authService.generateNonce(address);
        res.json({ nonce });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const verify = async (req, res) => {
    try {
        const { address, signature } = req.body;
        if (!address || !signature) {
            return res.status(400).json({ message: 'Address and signature are required' });
        }

        const origin = req.get('origin') || 'http://localhost:5173';
        const result = await authService.verifySignature(address, signature, origin);

        res.json(result);
    } catch (err) {
        if (err.message === 'User not found') {
            return res.status(404).json({ message: err.message });
        }
        if (err.message === 'Invalid signature') {
            return res.status(401).json({ message: err.message });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
