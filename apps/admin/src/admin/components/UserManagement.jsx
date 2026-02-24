import React from 'react';

const UserManagement = () => {
    return (
        <div className="flex-1 overflow-y-auto bg-background-dark">
            {/* Header Section */}
            <header className="p-8 pb-0">
                <div className="flex flex-wrap justify-between items-end gap-4">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black tracking-tight">User Management</h2>
                        <p className="text-gray-400 text-sm">Monitor and moderate protocol participants and their earnings.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-semibold hover:bg-white/10 transition-all">
                            <span className="material-symbols-outlined text-lg">download</span>
                            Export CSV
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200 transition-all shadow-lg shadow-white/5">
                            <span className="material-symbols-outlined text-lg leading-none">person_add</span>
                            Add New User
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="glass-card p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Users</p>
                            <h3 className="text-2xl font-bold">12,842</h3>
                            <p className="text-[10px] text-green-400 font-semibold mt-1">+12% from last month</p>
                        </div>
                        <div className="size-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <span className="material-symbols-outlined text-3xl">groups</span>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Active NFTs</p>
                            <h3 className="text-2xl font-bold">8,420</h3>
                            <p className="text-[10px] text-indigo-400 font-semibold mt-1">65% Activation Rate</p>
                        </div>
                        <div className="size-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <span className="material-symbols-outlined text-3xl">token</span>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Protocol Earnings</p>
                            <h3 className="text-2xl font-bold">$1.2M</h3>
                            <p className="text-[10px] text-green-400 font-semibold mt-1">+18.5% ATH</p>
                        </div>
                        <div className="size-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                            <span className="material-symbols-outlined text-3xl">payments</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filters & Search Toolbar */}
            <section className="p-8">
                <div className="glass-card rounded-xl p-2 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96 flex items-center">
                        <span className="material-symbols-outlined absolute left-4 text-gray-500 pointer-events-none">search</span>
                        <input className="w-full bg-background-dark border border-white/5 focus:border-yellow-400/50 focus:ring-0 rounded-lg pl-12 py-2.5 text-sm text-gray-200 placeholder-gray-500" placeholder="Search by wallet address (0x...)" type="text" />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-background-dark border border-white/5 px-3 py-1.5 rounded-lg">
                            <span className="text-[10px] text-gray-500 font-bold uppercase">NFT Status</span>
                            <select className="bg-transparent border-none focus:ring-0 text-xs font-semibold p-0 cursor-pointer">
                                <option className="bg-background-dark">All Assets</option>
                                <option className="bg-background-dark">Active</option>
                                <option className="bg-background-dark">None</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 bg-background-dark border border-white/5 px-3 py-1.5 rounded-lg">
                            <span className="text-[10px] text-gray-500 font-bold uppercase">Account Status</span>
                            <select className="bg-transparent border-none focus:ring-0 text-xs font-semibold p-0 cursor-pointer">
                                <option className="bg-background-dark">Any</option>
                                <option className="bg-background-dark">Active</option>
                                <option className="bg-background-dark">Suspended</option>
                            </select>
                        </div>
                        <button className="size-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-gray-400">filter_list</span>
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="mt-6 glass-card rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white/[0.02] border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Wallet Address</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Active Slot</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">NFT Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total Earnings</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Registration</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { wallet: '0x71C...7401', level: 'Level 5', nft: 'Active', earnings: '$12,450.00', date: 'Oct 24, 2023', status: 'Active', color: 'green' },
                                    { wallet: '0x03A...11F2', level: 'Level 12', nft: 'Active', earnings: '$48,210.50', date: 'Nov 12, 2023', status: 'Active', color: 'green' },
                                    { wallet: '0xE82...98AA', level: 'Level 2', nft: 'None', earnings: '$120.00', date: 'Jan 05, 2024', status: 'Suspended', color: 'red' },
                                    { wallet: '0x4F1...22C0', level: 'Level 8', nft: 'Active', earnings: '$3,150.00', date: 'Jan 18, 2024', status: 'Active', color: 'green' },
                                    { wallet: '0xBC8...6331', level: 'Level 1', nft: 'None', earnings: '$0.00', date: 'Feb 02, 2024', status: 'Active', color: 'green' },
                                ].map((row, i) => (
                                    <tr key={i} className="table-row-hover transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 group">
                                                <span className={`font-mono text-sm ${row.color === 'red' ? 'text-gray-500' : 'text-gray-300'}`}>{row.wallet}</span>
                                                <button className="material-symbols-outlined text-xs text-gray-600 hover:text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">content_copy</button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-semibold ${row.color === 'red' ? 'text-gray-500' : 'text-yellow-400'}`}>{row.level}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-1.5 ${row.nft === 'None' ? 'text-gray-600' : ''}`}>
                                                <div className={`size-2 rounded-full ${row.nft === 'None' ? 'bg-gray-600' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`}></div>
                                                <span className="text-xs font-medium">{row.nft}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-bold ${row.color === 'red' ? 'text-gray-500' : ''}`}>{row.earnings}</span>
                                        </td>
                                        <td className={`px-6 py-4 text-sm ${row.color === 'red' ? 'text-gray-500' : 'text-gray-400'}`}>{row.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded border border-${row.color}-500/20 bg-${row.color}-500/10 text-${row.color}-400 text-[10px] font-bold uppercase`}>{row.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="material-symbols-outlined text-gray-500 hover:text-white transition-colors">more_vert</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 flex items-center justify-between bg-white/[0.01] border-t border-white/5">
                        <p className="text-xs text-gray-500 font-medium">Showing 1 to 5 of 12,842 users</p>
                        <div className="flex gap-2">
                            <button className="size-8 flex items-center justify-center rounded border border-white/5 bg-white/5 text-gray-500 hover:text-white transition-colors disabled:opacity-30" disabled>
                                <span className="material-symbols-outlined text-lg">chevron_left</span>
                            </button>
                            <div className="flex items-center gap-1">
                                <button className="size-8 rounded bg-yellow-400 text-xs font-bold text-black">1</button>
                                <button className="size-8 rounded hover:bg-white/5 text-xs font-bold text-gray-400 hover:text-white transition-all">2</button>
                                <button className="size-8 rounded hover:bg-white/5 text-xs font-bold text-gray-400 hover:text-white transition-all">3</button>
                                <span className="text-gray-600 px-1 text-xs">...</span>
                                <button className="size-8 rounded hover:bg-white/5 text-xs font-bold text-gray-400 hover:text-white transition-all">2568</button>
                            </div>
                            <button className="size-8 flex items-center justify-center rounded border border-white/5 bg-white/5 text-gray-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-lg">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Context Footer */}
            <footer className="mt-auto p-8 border-t border-white/5">
                <div className="flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-6">
                        <a className="text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">Terms of Service</a>
                        <a className="text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">Privacy Protocol</a>
                        <a className="text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">API Docs</a>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest">© 2024 Web3 Foundation Admin</p>
                </div>
            </footer>
        </div>
    );
};

export default UserManagement;
