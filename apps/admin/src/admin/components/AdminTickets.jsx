import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_URL = '/api/tickets';

const AdminTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [replyLoading, setReplyLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        fetchTickets();
    }, [filterStatus]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/all?status=${filterStatus}`);
            if (!res.ok) throw new Error('Failed to fetch tickets');
            const data = await res.json();
            setTickets(data.data);
        } catch (err) {
            console.error('Error fetching tickets:', err);
            toast.error('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTicket = async (ticket) => {
        try {
            const res = await fetch(`${API_URL}/${ticket.id}`);
            if (!res.ok) throw new Error('Failed to fetch ticket details');
            const data = await res.json();
            setSelectedTicket(data);
        } catch (err) {
            console.error('Error fetching ticket details:', err);
            toast.error('Failed to load ticket details');
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error('Failed to update status');

            toast.success(`Status updated to ${newStatus}`);
            setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
            if (selectedTicket?.id === id) {
                setSelectedTicket(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            console.error('Error updating status:', err);
            toast.error('Failed to update status');
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;

        setReplyLoading(true);
        try {
            const res = await fetch(`${API_URL}/${selectedTicket.id}/replies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: replyMessage,
                    isAdminReply: true
                })
            });

            if (!res.ok) throw new Error('Failed to send reply');
            const data = await res.json();

            toast.success('Reply sent');
            setSelectedTicket(prev => ({
                ...prev,
                replies: [...prev.replies, data]
            }));
            setReplyMessage('');
        } catch (err) {
            console.error('Error sending reply:', err);
            toast.error('Failed to send reply');
        } finally {
            setReplyLoading(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'In Progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'Closed': return 'bg-slate-500/10 text-slate-500 border-white/5';
            default: return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20';
        }
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden animate-in fade-in duration-500">
            {/* Ticket List Sidebar */}
            <div className="w-full lg:w-96 border-r border-white/5 flex flex-col h-full bg-background-dark/30">
                <div className="p-6 border-b border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Support Tickets</h2>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{tickets.length} Total</span>
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-yellow-400/50 transition-all font-bold uppercase tracking-widest"
                    >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    {loading ? (
                        <div className="py-20 text-center flex flex-col items-center gap-4">
                            <div className="size-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Loading Tickets</span>
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="py-20 text-center text-slate-600 font-black uppercase tracking-widest text-xs">
                            No tickets found
                        </div>
                    ) : (
                        tickets.map(ticket => (
                            <button
                                key={ticket.id}
                                onClick={() => handleSelectTicket(ticket)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all hover:bg-white/[0.02] flex flex-col gap-3 group ${selectedTicket?.id === ticket.id
                                    ? 'bg-yellow-400/5 border-yellow-400/20'
                                    : 'border-transparent'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-1">{ticket.subject}</h3>
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border shrink-0 ${getStatusStyles(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-mono text-slate-500 tracking-tighter">
                                        ID: {ticket.id}
                                    </span>
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Ticket Content */}
            <div className="flex-1 flex flex-col h-full bg-black/40 relative">
                {!selectedTicket ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                        <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-4xl text-slate-700">confirmation_number</span>
                        </div>
                        <h3 className="text-xl font-black text-white tracking-widest uppercase">Select a Ticket</h3>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 max-w-xs">Click on a ticket from the list to view its conversation history and take action.</p>
                    </div>
                ) : (
                    <>
                        {/* Detail Header */}
                        <div className="p-6 lg:p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-card-dark/20 backdrop-blur-xl">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-black text-white tracking-tight">{selectedTicket.subject}</span>
                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${getStatusStyles(selectedTicket.status)}`}>
                                        {selectedTicket.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <span>User: <span className="text-yellow-400 font-mono tracking-tighter">{selectedTicket.wallet_address}</span></span>
                                    <span className="size-1 rounded-full bg-slate-700"></span>
                                    <span>Cat: {selectedTicket.category}</span>
                                    <span className="size-1 rounded-full bg-slate-700"></span>
                                    <span>Priority: <span className={selectedTicket.priority === 'High' ? 'text-red-500' : 'text-blue-400'}>{selectedTicket.priority}</span></span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {['In Progress', 'Resolved', 'Closed'].map(status => (
                                    status !== selectedTicket.status && (
                                        <button
                                            key={status}
                                            onClick={() => handleUpdateStatus(selectedTicket.id, status)}
                                            className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                        >
                                            Mark as {status}
                                        </button>
                                    )
                                ))}
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 custom-scrollbar">
                            {/* Original Issue */}
                            <div className="flex gap-4 group">
                                <div className="size-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-slate-500">person</span>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            User
                                            <span className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">{selectedTicket.wallet_address}</span>
                                        </span>
                                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
                                            {new Date(selectedTicket.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 p-5 rounded-2xl rounded-tl-none">
                                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedTicket.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Replies */}
                            {selectedTicket.replies?.map(reply => (
                                <div key={reply.id} className={`flex gap-4 group ${reply.is_admin_reply ? 'flex-row-reverse' : ''}`}>
                                    <div className={`size-10 rounded-2xl shrink-0 border flex items-center justify-center ${reply.is_admin_reply
                                        ? 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400'
                                        : 'bg-white/5 border-white/5 text-slate-500'
                                        }`}>
                                        <span className="material-symbols-outlined">
                                            {reply.is_admin_reply ? 'support_agent' : 'person'}
                                        </span>
                                    </div>
                                    <div className={`flex-1 space-y-2 ${reply.is_admin_reply ? 'text-right' : ''}`}>
                                        <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest ${reply.is_admin_reply ? 'justify-end' : ''}`}>
                                            <span className={reply.is_admin_reply ? 'text-yellow-400' : 'text-slate-500'}>
                                                {reply.is_admin_reply ? 'Admin Support' : 'User'}
                                            </span>
                                            <span className="text-[9px] text-slate-700">
                                                {new Date(reply.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className={`p-5 rounded-2xl border ${reply.is_admin_reply
                                            ? 'bg-yellow-400/5 border-yellow-400/10 text-slate-200 rounded-tr-none'
                                            : 'bg-white/5 border-white/5 text-slate-300 rounded-tl-none'
                                            }`}>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Input */}
                        <div className="p-6 lg:p-8 bg-card-dark/40 border-t border-white/5">
                            <form onSubmit={handleReply} className="flex gap-4 items-end">
                                <div className="flex-1 relative">
                                    <textarea
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        placeholder="Type your response..."
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 pr-16 text-sm text-white focus:outline-none focus:border-yellow-400/50 transition-all min-h-[100px] resize-none font-bold"
                                    />
                                    <div className="absolute top-4 right-4 text-[9px] font-black text-slate-700 uppercase tracking-widest pointer-events-none">
                                        Support Reply
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={replyLoading || !replyMessage.trim()}
                                    className="bg-yellow-400 text-black size-14 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-400/20 hover:scale-105 active:scale-95 transition-all shrink-0 hover:bg-yellow-500"
                                >
                                    {replyLoading ? (
                                        <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <span className="material-symbols-outlined">send</span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminTickets;
