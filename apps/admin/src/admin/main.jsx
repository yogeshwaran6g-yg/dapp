import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AdminDashboard from './AdminDashboard.jsx'
import './admin.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('admin-root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AdminDashboard />
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
