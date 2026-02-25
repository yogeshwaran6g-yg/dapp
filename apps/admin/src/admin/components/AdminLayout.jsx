import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="bg-background-dark font-sans text-slate-100 antialiased min-h-screen">
            <div className="flex h-screen overflow-hidden">
                <AdminSidebar
                    isOpen={isSidebarOpen}
                    onClose={closeSidebar}
                />
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative transition-all duration-300">
                    <AdminHeader onMenuClick={toggleSidebar} />
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-[1600px] mx-auto w-full">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#0f172a',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.05)',
                    },
                }}
            />
        </div>
    );
};

export default AdminLayout;
