import React from 'react';
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from './components/AdminLayout';
import UserManagement from './components/UserManagement';
import Treasury from './components/Treasury';
import StakeHistory from './components/StakeHistory';

const DashboardHome = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;

    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ['adminStats', page],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString()
            });
            const response = await fetch(`/api/v1/admin/stats?${params}`);
            if (!response.ok) throw new Error('Failed to fetch stats');
            const data = await response.json();
            return data.data;
        }
    });

    const stats = dashboardData?.stats || {};
    const recentActivities = dashboardData?.recentActivities || [];
    const totalActivities = dashboardData?.totalActivities || 0;
    const totalPages = Math.ceil(totalActivities / limit);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setSearchParams(prev => {
                const params = new URLSearchParams(prev);
                params.set('page', newPage.toString());
                return params;
            });
        }
    };

    const statCards = [
        { label: 'Total Users', value: Number(stats.total_users || 0).toLocaleString(), trend: `+${stats.users_24h || 0} last 24h`, icon: 'group' },
        { label: 'Active Users', value: Number(stats.active_users || 0).toLocaleString(), trend: `${(Number(stats.total_users) > 0 ? (Number(stats.active_users) / Number(stats.total_users) * 100).toFixed(1) : 0)}% rate`, icon: 'token' },
        { label: 'Total XP', value: Number(stats.total_xp || 0).toLocaleString(), trend: 'Global Progress', icon: 'workspace_premium' },
        { label: 'Blocked Users', value: Number(stats.blocked_users || 0).toLocaleString(), trend: 'Safety Monitoring', icon: 'block', down: true },
        { label: 'Growth rate', value: Number(stats.users_24h || 0).toLocaleString(), trend: 'New Registrations', icon: 'trending_up' },
    ].slice(0, 5); // Matching the grid layout

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        import('react-hot-toast').then(({ toast }) => {
            toast.success('Address copied!');
        });
    };

    return (
        <div className="flex-1 overflow-y-auto p-3 lg:p-6 space-y-4 lg:space-y-6">
            {/* Row 1: Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                {isLoading ? (
                    <div className="col-span-full h-32 flex items-center justify-center glass-card rounded-2xl border border-white/5">
                        <div className="size-6 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin"></div>
                    </div>
                ) : (
                    statCards.map((stat, i) => (
                        <div key={i} className="bg-card-dark rounded-2xl lg:rounded-3xl p-4 lg:p-7 flex flex-col gap-3 lg:gap-6 border border-white/5 relative overflow-hidden group hover:border-yellow-400/20 transition-all">
                            <div className="flex justify-between items-start">
                                <span className="text-[9px] lg:text-[11px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                                <span className="material-symbols-outlined text-yellow-400 text-xl lg:text-2xl">{stat.icon}</span>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xl lg:text-3xl font-black text-white tracking-tight">{stat.value}</h3>
                                <div className="flex items-center gap-1.5 mt-0.5 lg:mt-1">
                                    <span className={`material-symbols-outlined text-[10px] lg:text-sm ${stat.down ? 'text-red-500' : 'text-green-500'}`}>
                                        {stat.down ? 'trending_down' : 'trending_up'}
                                    </span>
                                    <span className={`text-[10px] lg:text-[12px] font-bold ${stat.down ? 'text-red-500' : 'text-green-500'}`}>{stat.trend}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Row 2: Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                {/* User Growth */}
                <div className="bg-card-dark rounded-2xl lg:rounded-3xl p-4 lg:p-6 flex flex-col gap-4 lg:gap-6 border border-white/5">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg lg:text-xl font-black text-white tracking-tight">User Growth</h4>
                        <div className="flex gap-2">
                            <button className="px-5 py-2 text-[10px] font-black uppercase bg-yellow-400/20 text-yellow-400 rounded-lg border border-yellow-400/20">7 Days</button>
                            <button className="px-5 py-2 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">30 Days</button>
                        </div>
                    </div>
                    <div className="h-72 w-full relative">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 200">
                            <defs>
                                <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#facc15" stopOpacity="0.4"></stop>
                                    <stop offset="100%" stopColor="#facc15" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                            <path d="M0,150 Q50,140 100,160 T200,120 T300,80 T400,100 T500,40 V200 H0 Z" fill="url(#areaGradient)"></path>
                            <path d="M0,150 Q50,140 100,160 T200,120 T300,80 T400,100 T500,40" fill="none" stroke="#facc15" strokeLinecap="round" strokeWidth="5" className="filter drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]"></path>
                        </svg>
                        <div className="absolute bottom-0 left-0 w-full flex justify-between text-[11px] font-black text-slate-600 px-6 py-2 border-t border-white/5 mt-4">
                            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                        </div>
                    </div>
                </div>

                {/* Revenue vs Payouts */}
                <div className="bg-card-dark rounded-2xl lg:rounded-3xl p-4 lg:p-6 flex flex-col gap-4 lg:gap-6 border border-white/5">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg lg:text-xl font-black text-white tracking-tight">System Revenue</h4>
                        <div className="flex items-center gap-4 lg:gap-8">
                            <div className="flex items-center gap-2.5">
                                <span className="size-2.5 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"></span>
                                <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Revenue</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className="size-2.5 rounded-full bg-slate-600"></span>
                                <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Payouts</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-72 w-full relative">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 200">
                            <path d="M0,100 L50,80 L100,110 L150,70 L200,90 L250,50 L300,60 L350,40 L400,55 L450,20 L500,30" fill="none" stroke="#facc15" strokeWidth="4" className="filter drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]"></path>
                            <path d="M0,150 L50,140 L100,160 L150,130 L200,145 L250,120 L300,135 L350,110 L400,125 L450,100 L500,115" fill="none" stroke="#4a5568" strokeDasharray="10" strokeWidth="2" className="opacity-60"></path>
                        </svg>
                        <div className="absolute bottom-0 left-0 w-full flex justify-between text-[11px] font-black text-slate-600 px-6 py-2 border-t border-white/5 mt-4">
                            <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3: Management Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Activities */}
                <div className="lg:col-span-2 bg-card-dark rounded-2xl lg:rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                    <div className="p-4 lg:p-6 border-b border-white/5 flex items-center justify-between">
                        <h4 className="text-lg lg:text-xl font-black text-white tracking-tight">Recent Activities</h4>
                        <button className="text-[10px] lg:text-[11px] font-black text-yellow-400 hover:text-yellow-500 uppercase tracking-[0.2em] transition-colors">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02] text-[11px] uppercase text-slate-500 font-black tracking-widest">
                                <tr>
                                    <th className="px-10 py-6">Wallet Address</th>
                                    <th className="px-10 py-6">Action</th>
                                    <th className="px-10 py-6">Timestamp</th>
                                    <th className="px-10 py-6 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm border-t border-white/5">
                                {isLoading ? (
                                    <tr><td colSpan="4" className="py-20 text-center text-slate-500 font-black uppercase tracking-widest">Loading...</td></tr>
                                ) : recentActivities.length === 0 ? (
                                    <tr><td colSpan="4" className="py-20 text-center text-slate-500 font-black uppercase tracking-widest">No activities recorded</td></tr>
                                ) : (
                                    recentActivities.map((row, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-10 py-6 font-mono text-yellow-400 font-black tracking-widest flex items-center gap-3">
                                                <span>{row.wallet_address.slice(0, 7)}...{row.wallet_address.slice(-6)}</span>
                                                <button
                                                    onClick={() => handleCopy(row.wallet_address)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/5 rounded"
                                                >
                                                    <span className="material-symbols-outlined text-[16px] text-yellow-400">content_copy</span>
                                                </button>
                                            </td>
                                            <td className="px-10 py-6 text-slate-200 font-bold tracking-wide">{row.action}</td>
                                            <td className="px-10 py-6 text-slate-500 text-[12px] font-black tracking-tight">
                                                {new Date(row.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <span className={`px-4 py-2 rounded-lg bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-[0.1em] border border-green-500/20`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Activity Pagination */}
                    <div className="p-4 bg-background-dark/30 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            Showing {recentActivities.length} of {totalActivities} entries
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                className="size-8 flex items-center justify-center rounded border border-white/5 bg-white/5 text-gray-500 hover:text-white transition-colors disabled:opacity-30"
                                disabled={page <= 1}
                            >
                                <span className="material-symbols-outlined text-lg">chevron_left</span>
                            </button>
                            <div className="flex items-center gap-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`size-8 rounded text-[10px] font-bold transition-all ${page === i + 1 ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                className="size-8 flex items-center justify-center rounded border border-white/5 bg-white/5 text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                                disabled={page >= totalPages}
                            >
                                <span className="material-symbols-outlined text-lg">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Active Proposals */}
                <div className="bg-card-dark rounded-2xl lg:rounded-3xl p-4 lg:p-6 flex flex-col gap-6 lg:gap-8 border border-white/5">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg lg:text-xl font-black text-white tracking-tight">Active Proposals</h4>
                        <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 text-[9px] font-black rounded-lg border border-yellow-400/20 uppercase tracking-[0.1em]">4 Active</span>
                    </div>
                    <div className="space-y-6 lg:space-y-8">
                        {[
                            { title: '#42: Increase Rewards', time: '2d Left', progress: 68 },
                            { title: '#41: New Asset Listing', time: '4d Left', progress: 92 },
                            { title: '#40: Treasury Diversify', time: '5h Left', progress: 45 },
                        ].map((prop, i) => (
                            <div key={i} className="space-y-3 lg:space-y-4">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-bold text-white leading-tight max-w-[80%]">{prop.title}</p>
                                    <span className="text-[9px] text-slate-500 font-black tracking-tight uppercase">{prop.time}</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 lg:h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                                    <div className="bg-yellow-400 h-full rounded-full shadow-[0_0_10px_rgba(250,204,21,0.6)]" style={{ width: `${prop.progress}%` }}></div>
                                </div>
                                <div className="flex justify-between text-[9px] font-black tracking-widest uppercase">
                                    <span className="text-yellow-400">{prop.progress}% FOR</span>
                                    <span className="text-slate-600">{100 - prop.progress}% AGAINST</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="users/:query" element={<UserManagement />} />
                <Route path="treasury" element={<Treasury />} />
                <Route path="staking" element={<StakeHistory />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
};

export default AdminDashboard;
