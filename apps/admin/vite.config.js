import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5174,
        host: '127.0.0.1',
        allowedHosts: ['.csb.app', 'd3wqxd-5174.csb.app'],
        proxy: {
            '/api/v1': {
                target: process.env.VITE_API_URL || 'http://localhost:5000',
                changeOrigin: true,
            },
            '/api/notifications': {
                target: 'http://localhost:5001',
                changeOrigin: true,
            },
            '/api/tickets': {
                target: 'http://localhost:5001',
                changeOrigin: true,
            }
        }
    }
})
