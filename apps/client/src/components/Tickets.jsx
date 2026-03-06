import React, { useState, useEffect } from 'react';
import PageHeading from './PageHeading';
import { toast } from 'react-toastify';

const Tickets = () => {
    const [formData, setFormData] = useState({
        category: 'Technical Issue',
        subject: '',
        description: '',
        priority: 'Medium'
    });

    const categories = ['Technical Issue', 'Account Access', 'Payment Problem', 'Feature Request', 'Other'];
    const priorities = ['Low', 'Medium', 'High',];

    const [tickets, setTickets] = useState([]);
    const API_URL = 'http://localhost:5001/api/tickets';

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setTickets(data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
            toast.error('Failed to load tickets');
        }
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
                setTickets([newTicket, ...tickets]);
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
                            <select
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-gold/50 transition-colors appearance-none"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold ml-1">Subject</label>
                            <input
                                type="text"
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-gold/50 transition-colors"
                                placeholder="Brief summary of the issue"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold ml-1">Description</label>
                            <textarea
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-gold/50 transition-colors min-h-[120px]"
                                placeholder="Please provide details about the problem..."
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
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{tickets.length} Total</span>
                    </div>

                    <div className="space-y-4">
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="glass-panel p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all group flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${ticket.status === 'Resolved' ? 'bg-green-500/10 text-green-500' : 'bg-accent-gold/10 text-accent-gold'
                                        }`}>
                                        {ticket.id.split('-')[1]}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white group-hover:text-accent-gold transition-colors">{ticket.subject}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">{ticket.id}</span>
                                            <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">{ticket.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${ticket.priority === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                        ticket.priority === 'Medium' ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20' :
                                            'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                        }`}>
                                        {ticket.priority}
                                    </span>
                                    <span className={`text-[10px] font-bold ${ticket.status === 'Resolved' ? 'text-green-500' : 'text-accent-gold animate-pulse'
                                        }`}>
                                        {ticket.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Tickets;
