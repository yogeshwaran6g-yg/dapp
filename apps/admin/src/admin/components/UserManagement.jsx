import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';

const UserManagement = () => {
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
            const response = await fetch(`/api/v1/admin/users?${params}`);
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            return data.data;
        }
    });

    const [activeReferrer, setActiveReferrer] = useState(null);
    const [searchQuery, setSearchQuery] = useState(effectiveSearch);
    const [userStatusFilter, setUserStatusFilter] = useState('All');
    const [accountFilter, setAccountFilter] = useState('Any');
    const [statusSort, setStatusSort] = useState(null); // null | 'blocked-first' | 'active-first'

    const popoverRef = useRef(null);

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

    const handleBlockUser = async (userId, currentlyBlocked) => {
        try {
            const response = await fetch(`/api/v1/admin/users/${userId}/block`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blocked: !currentlyBlocked })
            });
            if (response.ok) {
                queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
                setActiveReferrer(null);
                import('react-hot-toast').then(({ toast }) => {
                    toast.success(currentlyBlocked ? 'User unblocked' : 'User blocked');
                });
            } else {
                import('react-hot-toast').then(({ toast }) => {
                    toast.error('Failed to update user status');
                });
            }
        } catch (err) {
            console.error(err);
            import('react-hot-toast').then(({ toast }) => {
                toast.error('Network error, please try again');
            });
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setActiveReferrer(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                <div className="glass-card rounded-xl p-2 flex flex-col md:flex-row gap-4 items-center justify-between">
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

                {/* Table Section */}
                <div className="mt-6 glass-card rounded-xl overflow-hidden min-h-[400px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="bg-white/[0.02] border-b border-white/5">
                                <tr>
                                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-wider">User ID</th>
                                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-wider">Address</th>
                                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-wider">Username</th>
                                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-wider">Slot</th>
                                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-wider">XP</th>
                                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-wider">Reg Date</th>
                                    <th
                                        className="px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:text-white transition-colors"
                                        onClick={handleStatusSortToggle}
                                        title="Sort by blocked status"
                                    >
                                        <span className="flex items-center gap-1">
                                            Status
                                            <span className="material-symbols-outlined text-sm">
                                                {statusSort === 'blocked-first' ? 'arrow_downward' : statusSort === 'active-first' ? 'arrow_upward' : 'unfold_more'}
                                            </span>
                                        </span>
                                    </th>
                                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="size-8 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin"></div>
                                                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Loading Users...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-20 text-center">
                                            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">No Users Found</p>
                                        </td>
                                    </tr>
                                ) : filteredAndSortedUsers.map((user) => (
                                    <tr key={user.id} className="table-row-hover transition-colors">
                                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                                            <div className="flex items-center gap-2 group">
                                                <span className="font-mono text-xs lg:text-sm text-gray-500 select-all" title={user.id}>
                                                    {user.id}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                                            <div className="flex items-center gap-2 group">
                                                <span className={`font-mono text-xs lg:text-sm ${user.is_blocked ? 'text-gray-500' : 'text-gray-300'}`}>
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
                                        </td>
                                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                                            <span className="text-xs lg:text-sm text-gray-400">{user.username || 'Anon User'}</span>
                                        </td>
                                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                                            <span className={`text-xs lg:text-sm font-semibold ${user.is_blocked ? 'text-gray-500' : 'text-yellow-400'}`}>Level {user.level || 1}</span>
                                        </td>
                                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                                            <span className={`text-xs lg:text-sm font-bold ${user.is_blocked ? 'text-gray-500' : 'text-gray-300'}`}>{(user.total_xp || 0).toLocaleString()} XP</span>
                                        </td>
                                        <td className={`px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-sm ${user.is_blocked ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                        </td>
                                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                                            {user.is_blocked ? (
                                                <span className="px-2 py-0.5 lg:px-2.5 lg:py-1 rounded border border-red-500/20 bg-red-500/10 text-red-400 text-[8px] lg:text-[10px] font-bold uppercase">Blocked</span>
                                            ) : (
                                                <span className="px-2 py-0.5 lg:px-2.5 lg:py-1 rounded border border-green-500/20 bg-green-500/10 text-green-400 text-[8px] lg:text-[10px] font-bold uppercase">Active</span>
                                            )}
                                        </td>
                                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-right relative">
                                            <button
                                                onClick={() => setActiveReferrer(activeReferrer === user.id ? null : user.id)}
                                                className="material-symbols-outlined text-gray-500 hover:text-white transition-colors text-lg lg:text-2xl"
                                            >
                                                more_vert
                                            </button>

                                            {activeReferrer === user.id && (
                                                <div
                                                    ref={popoverRef}
                                                    className="absolute right-0 mt-2 w-64 bg-[#1a1c23] border border-white/20 rounded-xl p-4 shadow-2xl z-50 text-left animate-in fade-in zoom-in duration-200"
                                                >
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3">Referral Details</p>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <p className="text-[10px] text-gray-500 mb-1.5 font-bold uppercase tracking-tighter">Referred By</p>
                                                            {user.referred_by_address ? (
                                                                <div className="flex items-center justify-between gap-2 bg-black/40 p-2.5 rounded-lg border border-white/10">
                                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                                        <span className="material-symbols-outlined text-yellow-400 text-sm flex-shrink-0">link</span>
                                                                        <span className="font-mono text-[10px] text-gray-200 truncate">
                                                                            {user.referred_by_address}
                                                                        </span>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleCopy(user.referred_by_address)}
                                                                        className="p-1 hover:bg-white/5 rounded text-gray-500 hover:text-yellow-400 transition-colors"
                                                                    >
                                                                        <span className="material-symbols-outlined text-xs">content_copy</span>
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <p className="text-xs text-gray-500 italic px-2">Organic Participant</p>
                                                            )}
                                                        </div>
                                                        <div className="pt-3 border-t border-white/10 space-y-2">
                                                            <button className="w-full py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center justify-center gap-2 border border-white/5">
                                                                <span className="material-symbols-outlined text-sm">visibility</span>
                                                                View
                                                            </button>
                                                            <button
                                                                onClick={() => handleBlockUser(user.id, user.is_blocked)}
                                                                className={`w-full py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all flex items-center justify-center gap-2 border ${user.is_blocked ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'}`}
                                                            >
                                                                <span className="material-symbols-outlined text-sm">{user.is_blocked ? 'check_circle' : 'block'}</span>
                                                                {user.is_blocked ? 'Unblock User' : 'Block User'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-4 lg:px-6 py-3 lg:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 bg-white/[0.01] border-t border-white/5">
                        <p className="text-[10px] lg:text-xs text-gray-500 font-medium">Showing {users.length} of {totalUsers} users</p>
                        <div className="flex gap-1 lg:gap-2">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                className="size-7 lg:size-8 flex items-center justify-center rounded border border-white/5 bg-white/5 text-gray-500 hover:text-white transition-colors disabled:opacity-30"
                                disabled={page <= 1}
                            >
                                <span className="material-symbols-outlined text-base lg:text-lg">chevron_left</span>
                            </button>
                            <div className="flex items-center gap-0.5 lg:gap-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`size-7 lg:size-8 rounded text-[10px] lg:text-xs font-bold transition-all ${page === i + 1 ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                className="size-7 lg:size-8 flex items-center justify-center rounded border border-white/5 bg-white/5 text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                                disabled={page >= totalPages}
                            >
                                <span className="material-symbols-outlined text-base lg:text-lg">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
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
