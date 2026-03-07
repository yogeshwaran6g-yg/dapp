import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DataTable from './common/DataTable';

const UserManagement = () => {
    const { token } = useAuth();
    const { query: pathQuery } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const page = parseInt(searchParams.get('page') || '1');
    const urlSearch = searchParams.get('search') || '';
    const limit = 10;

    const effectiveSearch = pathQuery || urlSearch;

    const { data: usersData, isLoading, error } = useQuery({
        queryKey: ['adminUsers', effectiveSearch, page],
        queryFn: async () => {
            const params = new URLSearchParams({
                search: effectiveSearch,
                page: page.toString(),
                limit: limit.toString()
            });
            const response = await fetch(`/api/v1/admin/users?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            return data.data;
        },
        enabled: !!token
    });


    const [searchQuery, setSearchQuery] = useState(effectiveSearch);
    const [userStatusFilter, setUserStatusFilter] = useState('All');
    const [accountFilter, setAccountFilter] = useState('Any');
    const [statusSort, setStatusSort] = useState(null); // null | 'blocked-first' | 'active-first'


    const users = usersData?.users || [];
    const totalUsers = usersData?.total || 0;
    const totalPages = Math.ceil(totalUsers / limit);

    const filteredAndSortedUsers = [...users]
        .filter(u => {
            if (userStatusFilter === 'Blocked') return u.is_blocked;
            if (userStatusFilter === 'Not Blocked') return !u.is_blocked;
            return true;
        })
        .sort((a, b) => {
            if (statusSort === 'blocked-first') return (b.is_blocked ? 1 : 0) - (a.is_blocked ? 1 : 0);
            if (statusSort === 'active-first') return (a.is_blocked ? 1 : 0) - (b.is_blocked ? 1 : 0);
            return 0;
        });

    const handleStatusSortToggle = () => {
        setStatusSort(prev =>
            prev === null ? 'blocked-first' :
                prev === 'blocked-first' ? 'active-first' : null
        );
    };

    useEffect(() => {
        setSearchQuery(effectiveSearch);
    }, [effectiveSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== effectiveSearch) {
                setSearchParams(prev => {
                    const params = new URLSearchParams(prev);
                    if (searchQuery) params.set('search', searchQuery);
                    else params.delete('search');
                    params.set('page', '1');
                    return params;
                });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, effectiveSearch, setSearchParams]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setSearchParams(prev => {
                const params = new URLSearchParams(prev);
                params.set('page', newPage.toString());
                return params;
            });
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        import('react-hot-toast').then(({ toast }) => {
            toast.success('Address copied!');
        });
    };



    const columns = [
        {
            header: "User ID",
            render: (user) => (
                <div className="flex items-center gap-2 group">
                    <span className="font-mono text-xs lg:text-sm text-gray-500 select-all" title={user.id}>
                        {user.id}
                    </span>
                </div>
            )
        },
        {
            header: "Address",
            render: (user) => (
                <div className="flex items-center gap-2 group">
                    <span className={`font-mono text-xs lg:text-sm ${user.is_blocked ? 'text-gray-50' : 'text-gray-300'}`}>
                        {user.wallet_address.slice(0, 6)}...{user.wallet_address.slice(-4)}
                    </span>
                    <button
                        onClick={() => handleCopy(user.wallet_address)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/5 rounded"
                        title="Copy Address"
                    >
                        <span className="material-symbols-outlined text-xs text-gray-500 hover:text-yellow-400">content_copy</span>
                    </button>
                </div>
            )
        },
        {
            header: "Username",
            render: (user) => <span className="text-xs lg:text-sm text-gray-400">{user.username || 'Anon User'}</span>
        },
        {
            header: "Slot",
            render: (user) => <span className={`text-xs lg:text-sm font-semibold ${user.is_blocked ? 'text-gray-500' : 'text-yellow-400'}`}>Level {user.level || 1}</span>
        },
        {
            header: "XP",
            render: (user) => <span className={`text-xs lg:text-sm font-bold ${user.is_blocked ? 'text-gray-500' : 'text-gray-300'}`}>{(user.total_xp || 0).toLocaleString()} XP</span>
        },
        {
            header: "Reg Date",
            render: (user) => (
                <span className={`text-[10px] lg:text-sm ${user.is_blocked ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                </span>
            )
        },
        {
            header: "Status",
            onHeaderClick: handleStatusSortToggle,
            headerIcon: statusSort === 'blocked-first' ? 'arrow_downward' : statusSort === 'active-first' ? 'arrow_upward' : 'unfold_more',
            headerClassName: "cursor-pointer select-none hover:text-white transition-colors",
            render: (user) => (
                user.is_blocked ? (
                    <span className="px-2 py-0.5 lg:px-2.5 lg:py-1 rounded border border-red-500/20 bg-red-500/10 text-red-400 text-[8px] lg:text-[10px] font-bold uppercase">Blocked</span>
                ) : (
                    <span className="px-2 py-0.5 lg:px-2.5 lg:py-1 rounded border border-green-500/20 bg-green-500/10 text-green-400 text-[8px] lg:text-[10px] font-bold uppercase">Active</span>
                )
            )
        },
        {
            header: "Action",
            className: "text-right relative overflow-visible",
            render: (user) => (
                <div className="text-right">
                    <Link
                        to={`/users/detail/${user.id}`}
                        className="material-symbols-outlined text-gray-500 hover:text-yellow-400 transition-colors text-lg lg:text-2xl"
                        title="View User Details"
                    >
                        visibility
                    </Link>
                </div>
            )
        }
    ];

    return (
        <div className="flex-1 overflow-y-auto bg-background-dark">
            {/* Header Section */}
            <header className="p-4 lg:p-8 pb-0">
                <div className="flex flex-wrap justify-between items-end gap-3 lg:gap-4">
                    <div className="space-y-0.5 lg:space-y-1">
                        <h2 className="text-xl lg:text-3xl font-black tracking-tight">Users</h2>
                        <p className="text-gray-400 text-[10px] lg:text-sm">Monitor protocol participants.</p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-4 lg:mt-8">
                    <div className="glass-card p-4 lg:p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-[9px] lg:text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5 lg:mb-1">Total Users</p>
                            <h3 className="text-lg lg:text-2xl font-bold">{totalUsers.toLocaleString()}</h3>
                            <p className="text-[9px] lg:text-[10px] text-green-400 font-semibold mt-0.5 lg:mt-1">+100% (New System)</p>
                        </div>
                        <div className="size-10 lg:size-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <span className="material-symbols-outlined text-2xl lg:text-3xl">groups</span>
                        </div>
                    </div>
                    <div className="glass-card p-4 lg:p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-[9px] lg:text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5 lg:mb-1">Active Users</p>
                            <h3 className="text-lg lg:text-2xl font-bold">{users.filter(u => u.is_active).length.toLocaleString()}</h3>
                            <p className="text-[9px] lg:text-[10px] text-indigo-400 font-semibold mt-0.5 lg:mt-1">{(users.length > 0 ? (users.filter(u => u.is_active).length / users.length * 100).toFixed(1) : 0)}% Activation Rate</p>
                        </div>
                        <div className="size-10 lg:size-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <span className="material-symbols-outlined text-2xl lg:text-3xl">token</span>
                        </div>
                    </div>
                    <div className="glass-card p-4 lg:p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-[9px] lg:text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5 lg:mb-1">Blocked Users</p>
                            <h3 className="text-lg lg:text-2xl font-bold">{users.filter(u => u.is_blocked).length.toLocaleString()}</h3>
                            <p className="text-[9px] lg:text-[10px] text-red-400 font-semibold mt-0.5 lg:mt-1">Safety First</p>
                        </div>
                        <div className="size-10 lg:size-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                            <span className="material-symbols-outlined text-2xl lg:text-3xl">block</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filters & Search Toolbar */}
            <section className="p-4 lg:p-6">
                <div className="glass-card rounded-xl p-2 flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                    <div className="relative w-full md:w-96 flex items-center">
                        <span className="material-symbols-outlined absolute left-4 text-gray-500 pointer-events-none">search</span>
                        <input
                            className="w-full bg-background-dark border border-white/5 focus:border-yellow-400/50 focus:ring-0 rounded-lg pl-12 py-2.5 text-sm text-gray-200 placeholder-gray-500"
                            placeholder="Search by wallet address or username"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-background-dark border border-white/5 px-3 py-1.5 rounded-lg">
                            <span className="text-[10px] text-gray-500 font-bold uppercase">user status</span>
                            <select
                                className="bg-transparent border-none focus:ring-0 text-xs font-semibold p-0 cursor-pointer"
                                value={userStatusFilter}
                                onChange={(e) => setUserStatusFilter(e.target.value)}
                            >
                                <option className="bg-background-dark">All</option>
                                <option className="bg-background-dark">Blocked</option>
                                <option className="bg-background-dark">Not Blocked</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 bg-background-dark border border-white/5 px-3 py-1.5 rounded-lg">
                            <span className="text-[10px] text-gray-500 font-bold uppercase">Account Status</span>
                            <select
                                className="bg-transparent border-none focus:ring-0 text-xs font-semibold p-0 cursor-pointer"
                                value={accountFilter}
                                onChange={(e) => setAccountFilter(e.target.value)}
                            >
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

                <DataTable
                    columns={columns}
                    data={filteredAndSortedUsers}
                    isLoading={isLoading}
                    loadingMessage="Syncing user database..."
                    emptyMessage="No protocol participants found"
                    pagination={{
                        page,
                        totalPages,
                        totalCount: totalUsers,
                        onPageChange: handlePageChange
                    }}
                />
            </section>

            {/* Context Footer */}
            <footer className="mt-auto p-4 lg:p-6 border-t border-white/5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 opacity-50">
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
                        <a className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">Terms of Service</a>
                        <a className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">Privacy Protocol</a>
                        <a className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">API Docs</a>
                    </div>
                    <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">© 2024 Web3 Foundation Admin</p>
                </div>
            </footer>
        </div>
    );
};

export default UserManagement;
