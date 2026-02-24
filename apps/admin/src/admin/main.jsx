import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import AdminDashboard from './AdminDashboard.jsx'
import './admin.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('admin-root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AdminDashboard />
            <Toaster position="top-right" />
        </QueryClientProvider>
    </React.StrictMode>,
)
