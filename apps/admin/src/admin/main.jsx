import React from 'react'
import ReactDOM from 'react-dom/client'
import AdminDashboard from './AdminDashboard.jsx'
import './admin.css'

ReactDOM.createRoot(document.getElementById('admin-root')).render(
    <React.StrictMode>
        <AdminDashboard />
    </React.StrictMode>,
)
