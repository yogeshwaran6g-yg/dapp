import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import './index.css'

import { Web3Provider } from './components/Web3Provider'
import { AuthProvider } from './context/AuthContext'
import { WalletProvider } from './context/WalletContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Web3Provider>
            <AuthProvider>
                <WalletProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </WalletProvider>
            </AuthProvider>
        </Web3Provider>
    </React.StrictMode>,
)

