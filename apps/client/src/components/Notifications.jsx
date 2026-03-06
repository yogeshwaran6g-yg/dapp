import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeading from './PageHeading';
import { toast } from 'react-toastify';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:5001/api/notifications';

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(`${API_URL}/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
            toast.success('Notification marked as read');
        } catch (error) {
            console.error('Error marking as read:', error);
            toast.error('Failed to update notification');
        }
    };

    const deleteNotification = async (id) => {
        if (!window.confirm('Are you sure you want to delete this notification?')) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
            toast.success('Notification deleted');
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Failed to delete notification');
        }
    };

    const getTypeStyles = (type) => {
        switch (type) {
            case 'success': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'warning': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'error': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'success': return 'check_circle';
            case 'warning': return 'warning';
            case 'error': return 'error';
            default: return 'info';
        }
    };

    return (
        <div className="space-y-6">
            <PageHeading
                highlight="USER"
                title="NOTIFICATIONS"
                subtitle="Stay updated with the latest activity and system alerts."
            />

            <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-accent-gold">notifications</span>
                        Recent Notifications
                    </h2>
                    <button
                        onClick={fetchNotifications}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
                        title="Refresh"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                    </button>
                </div>

                <div className="divide-y divide-white/5">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">
                            <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            Loading notifications...
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <span className="material-symbols-outlined text-4xl mb-2 block">notifications_off</span>
                            No notifications to display.
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-6 transition-all hover:bg-white/[0.02] flex gap-4 ${notification.is_read ? 'opacity-60' : 'bg-accent-gold/[0.02]'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${getTypeStyles(notification.type)}`}>
                                    <span className="material-symbols-outlined">{getTypeIcon(notification.type)}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`font-bold truncate ${notification.is_read ? 'text-gray-300' : 'text-white'}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-[10px] text-gray-500 whitespace-nowrap">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                                        {notification.message}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        {!notification.is_read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-xs font-bold text-accent-gold hover:underline flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-sm">done_all</span>
                                                Mark as Read
                                            </button>
                                        )}
                                        {notification.link && (
                                            <a
                                                href={notification.link}
                                                className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                                View Details
                                            </a>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className="text-xs font-bold text-red-400 hover:underline flex items-center gap-1 transition-colors hover:text-red-300"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                {!notification.is_read && (
                                    <div className="w-2 h-2 rounded-full bg-accent-gold mt-2 shrink-0 shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
