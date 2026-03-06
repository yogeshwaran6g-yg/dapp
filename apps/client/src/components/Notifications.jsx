import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import PageHeading from './PageHeading';
import { toast } from 'react-toastify';

const PAGE_LIMIT = 5;
const API_URL = 'http://localhost:5001/api/notifications';

const Notifications = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [notifications, setNotifications] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);


    const sentinelRef = useRef(null);

    const fetchKeyRef = useRef(null);


    const fetchPage = useCallback(async (tab, pageNum, replace = false) => {
        const key = `${tab}-${pageNum}`;
        if (fetchKeyRef.current === key) return;
        fetchKeyRef.current = key;

        try {
            pageNum === 1 ? setLoading(true) : setLoadingMore(true);
            const res = await axios.get(API_URL, {
                params: { tab, page: pageNum, limit: PAGE_LIMIT },
            });
            const { data, hasMore: more, total } = res.data;

            setNotifications(prev => replace ? data : [...prev, ...data]);
            setHasMore(more);


            if (tab === 'all') setUnreadCount(total);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            toast.error('Failed to load notifications', { toastId: 'fetch-notifications-error' });
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);


    useEffect(() => {
        fetchKeyRef.current = null;
        setPage(1);
        setHasMore(true);
        setNotifications([]);
        fetchPage(activeTab, 1, true);
    }, [activeTab, fetchPage]);


    useEffect(() => {
        if (page === 1) return;
        fetchPage(activeTab, page, false);
    }, [page, activeTab, fetchPage]);


    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, loadingMore, loading]);


    const markAsRead = async (id) => {
        try {
            await axios.patch(`${API_URL}/${id}/read`);
            // Remove from 'all' list; if in 'read' list update locally
            if (activeTab === 'all') {
                setNotifications(prev => prev.filter(n => n.id !== id));
                setUnreadCount(prev => Math.max(0, prev - 1));
            } else {
                setNotifications(prev =>
                    prev.map(n => n.id === id ? { ...n, is_read: true } : n)
                );
            }
            toast.success('Notification marked as read');
        } catch (err) {
            console.error('Error marking as read:', err);
            toast.error('Failed to update notification');
        }
    };

    const deleteNotification = async (id) => {
        if (!window.confirm('Are you sure you want to delete this notification?')) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (activeTab === 'all') setUnreadCount(prev => Math.max(0, prev - 1));
            toast.success('Notification deleted');
        } catch (err) {
            console.error('Error deleting notification:', err);
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
                {/* ── Header ── */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-accent-gold">notifications</span>
                        Notifications
                    </h2>

                    {/* Refresh */}
                    <button
                        onClick={() => {
                            fetchKeyRef.current = null;
                            setPage(1);
                            setHasMore(true);
                            setNotifications([]);
                            fetchPage(activeTab, 1, true);
                        }}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
                        title="Refresh"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                    </button>
                </div>

                {/* ── Tabs ── */}
                <div className="flex border-b border-white/5">
                    {/* All (unread) tab */}
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2
                            ${activeTab === 'all'
                                ? 'text-accent-gold border-b-2 border-accent-gold bg-accent-gold/5'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined text-base">mark_email_unread</span>
                        All
                        {unreadCount > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-accent-gold text-black leading-none">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Read tab */}
                    <button
                        onClick={() => setActiveTab('read')}
                        className={`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2
                            ${activeTab === 'read'
                                ? 'text-accent-gold border-b-2 border-accent-gold bg-accent-gold/5'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined text-base">done_all</span>
                        Read
                    </button>
                </div>

                {/* ── List ── */}
                <div className="divide-y divide-white/5 max-h-[520px] overflow-y-auto">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">
                            <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            Loading notifications…
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <span className="material-symbols-outlined text-4xl mb-2 block">
                                {activeTab === 'all' ? 'notifications_off' : 'drafts'}
                            </span>
                            {activeTab === 'all'
                                ? 'No unread notifications — you\'re all caught up!'
                                : 'No read notifications yet.'}
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-6 transition-all hover:bg-white/[0.02] flex gap-4
                                    ${activeTab === 'all' ? 'bg-accent-gold/[0.02]' : 'opacity-70'}`}
                            >
                                {/* Icon */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${getTypeStyles(notification.type)}`}>
                                    <span className="material-symbols-outlined">{getTypeIcon(notification.type)}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`font-bold truncate ${activeTab === 'read' ? 'text-gray-300' : 'text-white'}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-[10px] text-gray-500 whitespace-nowrap ml-3">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Scrollable description */}
                                    <div className="w-1/2 max-h-10 overflow-y-auto pr-1 mb-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                        <p className="text-sm text-gray-400 leading-relaxed break-words">
                                            {notification.message}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-4">
                                        {activeTab === 'all' && (
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
                                            className="text-xs font-bold text-red-400 hover:underline flex items-center gap-1 hover:text-red-300 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Unread dot */}
                                {activeTab === 'all' && (
                                    <div className="w-2 h-2 rounded-full bg-accent-gold mt-2 shrink-0 shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                                )}
                            </div>
                        ))
                    )}

                    {/* ── Load-more sentinel ── */}
                    <div ref={sentinelRef} className="h-4" />

                    {/* Loading spinner for subsequent pages */}
                    {loadingMore && (
                        <div className="p-6 text-center text-gray-500">
                            <div className="w-6 h-6 border-2 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto" />
                        </div>
                    )}

                    {/* End-of-list message */}
                    {!hasMore && !loading && notifications.length > 0 && (
                        <div className="p-4 text-center text-xs text-gray-600">
                            You've reached the end.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
