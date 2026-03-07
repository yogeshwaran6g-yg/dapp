import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
    server: {
        port: 3000,
        host: true,
        hmr: true,
        allowedHosts: 'all',
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    resolve: {
        alias: {
            react: 'react',
            'react-dom': 'react-dom'
        }
    }
})

