import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5001/api/tickets';

const AdminTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTickets, setTotalTickets] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        fetchTickets(1);
    }, [filterStatus]);

    const loadMore = async () => {
        if (loadingMore || loading || page >= totalPages) return;

        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            const res = await fetch(`${API_URL}/admin/all?status=${filterStatus}&page=${nextPage}&limit=10`);
            if (!res.ok) throw new Error('Failed to fetch tickets');
            const data = await res.json();

            setTickets(prev => [...prev, ...data.data]);
            setTotalPages(data.pages);
            setPage(nextPage);
        } catch (err) {
            console.error('Error fetching more tickets:', err);
            toast.error('Failed to load more tickets');
        } finally {
            setLoadingMore(false);
        }
    };

    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight * 1.5) {
            loadMore();
        }
    };

    const fetchTickets = async (pageNum = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/all?status=${filterStatus}&page=${pageNum}&limit=10`);
            if (!res.ok) throw new Error('Failed to fetch tickets');
            const data = await res.json();
            setTickets(data.data);
            setTotalPages(data.pages);
            setTotalTickets(data.total);
            setPage(pageNum);
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

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'In Progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'Closed': return 'bg-slate-500/10 text-slate-500 border-white/5';
            default: return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20';
        }
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden animate-in fade-in duration-500">
            {/* Ticket List */}
            <div className={`w-full flex flex-col h-full overflow-hidden bg-background-dark/30 ${selectedTicket ? 'hidden' : 'flex'}`}>
                <div className="p-6 border-b border-white/5 space-y-4 shrink-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Support Tickets</h2>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{totalTickets} Total</span>
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

                <div className="max-h-[600px] overflow-y-scroll min-h-0 custom-scrollbar relative" onScroll={handleScroll}>
                    {loading && tickets.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center gap-4">
                            <div className="size-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Loading Tickets</span>
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="py-20 text-center text-slate-600 font-black uppercase tracking-widest text-xs">
                            No tickets found
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead className="sticky top-0 bg-background-dark/95 backdrop-blur-sm z-10 border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-24">ID</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Subject</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-32">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right w-32">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.map(ticket => (
                                        <tr
                                            key={ticket.id}
                                            onClick={() => handleSelectTicket(ticket)}
                                            className={`cursor-pointer transition-all hover:bg-white/[0.02] group border-b border-white/5 last:border-0 ${selectedTicket?.id === ticket.id
                                                ? 'bg-yellow-400/5'
                                                : ''
                                                }`}
                                        >
                                            <td className="px-6 py-4 text-[10px] font-mono text-slate-400 tracking-tighter w-24">
                                                #{ticket.id}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-white group-hover:text-yellow-400 transition-colors">
                                                {ticket.subject}
                                            </td>
                                            <td className="px-6 py-4 w-32">
                                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border inline-block whitespace-nowrap ${getStatusStyles(ticket.status)}`}>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-[10px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap w-32">
                                                {new Date(ticket.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {loadingMore && (
                    <div className="py-4 text-center flex flex-col items-center gap-2 shrink-0 border-t border-white/5 bg-background-dark/50">
                        <div className="size-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* Ticket Content */}
            <div className={`flex-1 w-full flex-col h-full overflow-hidden bg-black/40 relative ${!selectedTicket ? 'hidden' : 'flex'}`}>
                {selectedTicket && (
                    <>
                        {/* Detail Header */}
                        <div className="p-6 lg:p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-start justify-between gap-6 bg-card-dark/20 backdrop-blur-xl">
                            <div className="space-y-4">
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="flex items-center gap-2 text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-2"
                                >
                                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                                    Back to List
                                </button>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="text-2xl font-black text-white tracking-tight">{selectedTicket.subject}</span>
                                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${getStatusStyles(selectedTicket.status)}`}>
                                            {selectedTicket.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-x-4 gap-y-2 text-[10px] font-black text-slate-500 uppercase tracking-widest flex-wrap">
                                        <span className="flex items-center gap-1">User: <span className="text-yellow-400 font-mono tracking-tighter break-all">{selectedTicket.user_id}</span></span>
                                        <span className="hidden sm:inline-block size-1 rounded-full bg-slate-700"></span>
                                        <span>Cat: {selectedTicket.category}</span>
                                        <span className="hidden sm:inline-block size-1 rounded-full bg-slate-700"></span>
                                        <span>Priority: <span className={selectedTicket.priority === 'High' ? 'text-red-500' : 'text-blue-400'}>{selectedTicket.priority}</span></span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                {['In Progress', 'Resolved', 'Closed'].map(status => (
                                    status !== selectedTicket.status && (
                                        <button
                                            key={status}
                                            onClick={() => handleUpdateStatus(selectedTicket.id, status)}
                                            className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all flex-1 sm:flex-none"
                                        >
                                            {status}
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
                                            <span className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">{selectedTicket.user_id}</span>
                                        </span>
                                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
                                            {new Date(selectedTicket.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 p-5 rounded-2xl rounded-tl-none">
                                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap break-words">{selectedTicket.description}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminTickets;
