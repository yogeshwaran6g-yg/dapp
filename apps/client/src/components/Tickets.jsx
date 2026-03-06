import React, { useState, useEffect, useRef, useCallback } from 'react';
import PageHeading from './PageHeading';
import { toast } from 'react-toastify';

const Tickets = () => {
    const [formData, setFormData] = useState({
        category: 'Technical Issue',
        subject: '',
        description: '',
        priority: 'Medium'
    });

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryRef = useRef(null);

    const categories = ['Technical Issue', 'Account Access', 'Payment Problem', 'Feature Request', 'Other'];
    const priorities = ['Low', 'Medium', 'High',];

    const [tickets, setTickets] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const sentinelRef = useRef(null);
    const API_URL = 'http://localhost:5001/api/tickets';
    const PAGE_LIMIT = 5;

    const fetchTickets = useCallback(async (pageNum, replace = false) => {
        try {
            pageNum === 1 ? setLoading(true) : setLoadingMore(true);
            const response = await fetch(`${API_URL}?page=${pageNum}&limit=${PAGE_LIMIT}`);
            const data = await response.json();

            setTickets(prev => replace ? data.data : [...prev, ...data.data]);
            setHasMore(data.hasMore);
            setTotalCount(data.total);
        } catch (error) {
            console.error('Error fetching tickets:', error);
            toast.error('Failed to load tickets', { toastId: 'fetch-tickets-error' });
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchTickets(1, true);
    }, [fetchTickets]);

    useEffect(() => {
        if (page === 1) return;
        fetchTickets(page, false);
    }, [page, fetchTickets]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const truncateWords = (text, limit) => {
        if (!text) return '';
        const words = text.split(' ');
        if (words.length <= limit) return text;
        return words.slice(0, limit).join(' ') + '...';
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.subject || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const newTicket = await response.json();
                setTickets([newTicket, ...tickets.slice(0, tickets.length >= PAGE_LIMIT ? tickets.length - 1 : tickets.length)]);
                setTotalCount(prev => prev + 1);
                setFormData({ ...formData, subject: '', description: '' });
                toast.success('Ticket submitted successfully!');
            } else {
                toast.error('Failed to submit ticket');
            }
        } catch (error) {
            console.error('Error submitting ticket:', error);
            toast.error('Network error');
        }
    };


    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeading
                highlight="SUPPORT"
                title="TICKETS"
                subtitle="Submit a ticket for any problems or inquiries you have regarding the protocol."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Submit Ticket Form */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 blur-[50px] rounded-full -mr-16 -mt-16 transition-all group-hover:bg-accent-gold/10"></div>

                    <h2 className="text-xl font-display font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                        <span className="material-symbols-outlined text-accent-gold">add_circle</span>
                        Submit New Ticket
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold ml-1">Category</label>
                            <div className="relative" ref={categoryRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-gold/50 transition-all flex items-center justify-between group/btn"
                                >
                                    <span>{formData.category}</span>
                                    <span className={`material-symbols-outlined text-gray-500 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180 text-accent-gold' : ''}`}>
                                        expand_more
                                    </span>
                                </button>

                                {isCategoryOpen && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                                        <div className="py-1">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, category: cat });
                                                        setIsCategoryOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-accent-gold/10 hover:text-accent-gold flex items-center justify-between
                                                        ${formData.category === cat ? 'bg-accent-gold/5 text-accent-gold' : 'text-gray-400'}`}
                                                >
                                                    {cat}
                                                    {formData.category === cat && (
                                                        <span className="material-symbols-outlined text-xs">check</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold ml-1">Subject</label>
                                <span className={`text-[9px] font-bold ${formData.subject.length >= 100 ? 'text-red-500' : 'text-gray-500'}`}>
                                    {formData.subject.length}/100
                                </span>
                            </div>
                            <input
                                type="text"
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-gold/50 transition-colors"
                                placeholder="Brief summary of the issue"
                                maxLength={100}
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold ml-1">Description</label>
                                <span className={`text-[9px] font-bold ${formData.description.length >= 1000 ? 'text-red-500' : 'text-gray-500'}`}>
                                    {formData.description.length}/1000
                                </span>
                            </div>
                            <textarea
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-gold/50 transition-colors min-h-[120px]"
                                placeholder="Please provide details about the problem..."
                                maxLength={1000}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full action-gradient-gold text-primary font-bold py-4 rounded-xl shadow-lg shadow-accent-gold/20 hover:shadow-accent-gold/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                        >
                            <span className="material-symbols-outlined text-sm">send</span>
                            Submit Ticket
                        </button>
                    </form>
                </div>

                {/* Recent Tickets Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-accent-gold">history</span>
                            Recent Tickets
                        </h2>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{totalCount} Total</span>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {loading && tickets.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                Loading tickets…
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                No tickets found.
                            </div>
                        ) : (
                            tickets.map((ticket) => (
                                <div key={ticket.id} className="glass-panel p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all group flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${ticket.status === 'Resolved' ? 'bg-green-500/10 text-green-500' : 'bg-accent-gold/10 text-accent-gold'
                                            }`}>
                                            {ticket.id.toString().slice(-3)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-white group-hover:text-accent-gold transition-colors truncate">{ticket.subject}</h3>
                                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                {truncateWords(ticket.description, 15)}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">ID: {ticket.id}</span>
                                                <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">{new Date(ticket.created_at || ticket.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
                                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${ticket.priority === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                            ticket.priority === 'Medium' ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20' :
                                                'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                            }`}>
                                            {ticket.priority}
                                        </span>
                                        <span className={`text-[10px] font-bold ${ticket.status === 'Resolved' ? 'text-green-500' : 'text-accent-gold animate-pulse'
                                            }`}>
                                            {ticket.status || 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Load-more sentinel */}
                        <div ref={sentinelRef} className="h-4" />

                        {loadingMore && (
                            <div className="p-4 text-center">
                                <div className="w-6 h-6 border-2 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto" />
                            </div>
                        )}

                        {!hasMore && tickets.length > 0 && (
                            <div className="p-4 text-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                All tickets loaded
                            </div>
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Tickets;
