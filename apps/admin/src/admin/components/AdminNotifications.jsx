import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_URL = '/api/notifications';

const AdminNotifications = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const [targetUserId, setTargetUserId] = useState('');
    const [sentNotifications, setSentNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSentNotifications();
    }, []);

    const fetchSentNotifications = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/sent`);
            if (!res.ok) throw new Error('Failed to fetch notifications');
            const data = await res.json();
            setSentNotifications(data);
        } catch (err) {
            console.error('Error fetching sent notifications:', err);
            toast.error('Failed to load notification history');
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!title || !message || !targetUserId) {
            toast('Please fill in all required fields', { icon: '⚠️' });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: targetUserId,
                    title,
                    message,
                    type
                })
            });

            if (!res.ok) throw new Error('Failed to send notification');

            toast.success('Notification sent successfully!');
            setTitle('');
            setMessage('');
            setTargetUserId('');
            fetchSentNotifications();
        } catch (err) {
            console.error('Error sending notification:', err);
            toast.error('Failed to send notification');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this notification record?')) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');

            setSentNotifications(prev => prev.filter(n => n.id !== id));
            toast.success('Notification record deleted');
        } catch (err) {
            console.error('Error deleting notification:', err);
            toast.error('Failed to delete record');
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight uppercase">Notification Management</h1>
                <p className="text-slate-500 text-xs lg:text-sm font-bold uppercase tracking-widest mt-1">Send system alerts and updates to users</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Send Notification Form */}
                <div className="lg:col-span-1 border border-white/5 bg-card-dark rounded-3xl p-6 lg:p-8 space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 blur-[50px] rounded-full -mr-16 -mt-16"></div>

                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-yellow-400">send</span>
                        Send Alert
                    </h2>

                    <form onSubmit={handleSend} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Target User ID</label>
                            <input
                                type="text"
                                value={targetUserId}
                                onChange={(e) => setTargetUserId(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-yellow-400/50 transition-all font-bold"
                                placeholder="Enter User ID (e.g. 1)"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-yellow-400/50 transition-all font-bold"
                                placeholder="Notification Title"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-yellow-400/50 transition-all min-h-[120px] font-bold"
                                placeholder="Alert content..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Alert Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['info', 'success', 'warning', 'error'].map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setType(t)}
                                        className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${type === t
                                            ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)]'
                                            : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-400 text-black font-black py-4 rounded-2xl shadow-xl shadow-yellow-400/20 hover:shadow-yellow-400/30 hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <div className="size-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <span className="material-symbols-outlined text-lg">campaign</span>
                            )}
                            Broadcast Message
                        </button>
                    </form>
                </div>

                {/* Sent History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-white flex items-center gap-3">
                            <span className="material-symbols-outlined text-yellow-400">history</span>
                            Recently Sent
                        </h2>
                        <span className="px-3 py-1 bg-white/5 text-slate-500 text-[9px] font-black rounded-lg border border-white/5 uppercase tracking-widest">
                            {sentNotifications.length} Records
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                        {sentNotifications.length === 0 ? (
                            <div className="p-20 text-center border border-dashed border-white/10 rounded-3xl text-slate-600 font-black uppercase tracking-widest">
                                No notification history found
                            </div>
                        ) : (
                            sentNotifications.map(notification => (
                                <div key={notification.id} className="bg-card-dark border border-white/5 rounded-2xl p-5 lg:p-6 flex flex-col lg:flex-row gap-5 hover:border-white/10 transition-all group">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${notification.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                        notification.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                            notification.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                                'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                        }`}>
                                        <span className="material-symbols-outlined">
                                            {notification.type === 'success' ? 'check_circle' :
                                                notification.type === 'error' ? 'error' :
                                                    notification.type === 'warning' ? 'warning' : 'info'}
                                        </span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-white font-bold tracking-tight text-lg truncate">
                                                {notification.title}
                                            </h3>
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                {new Date(notification.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[14px]">person</span>
                                                User ID: {notification.user_id}
                                            </span>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${notification.is_read ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-slate-500/10 text-slate-500 border-white/5'
                                                }`}>
                                                {notification.is_read ? 'Read' : 'Unread'}
                                            </span>
                                            <button
                                                onClick={() => handleDelete(notification.id)}
                                                className="ml-auto text-[9px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">delete</span>
                                                Delete Record
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
