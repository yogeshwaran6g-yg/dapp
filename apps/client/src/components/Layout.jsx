import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex min-h-screen bg-background-dark font-sans text-white selection:bg-accent-gold/30">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <main className="flex-1 lg:ml-64 min-h-screen flex flex-col transition-all duration-300">
                <Header onMenuClick={toggleSidebar} />
                <div className="p-3 sm:p-6 lg:p-8 space-y-3 sm:space-y-4 max-w-[1600px] mx-auto w-full">
                    <Outlet />
                </div>
            </main>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#1a1a2e',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)',
                    },
                }}
            />
        </div>
    );
};

export default Layout;
