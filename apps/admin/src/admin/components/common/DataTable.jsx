import React from 'react';

/**
 * Reusable DataTable component for the Admin dashboard.
 * 
 * @param {Object[]} columns - Column definitions [{ header, key, render, className }]
 * @param {Object[]} data - Array of data objects
 * @param {boolean} isLoading - Loading state
 * @param {string} emptyMessage - Message shown when data is empty
 * @param {string} loadingMessage - Message shown during loading
 * @param {Object} pagination - Pagination info { page, totalPages, onPageChange, totalCount }
 */
const DataTable = ({ 
    columns, 
    data = [], 
    isLoading = false, 
    emptyMessage = "No records found", 
    loadingMessage = "Syncing protocol records...",
    pagination = null
}) => {
    return (
        <div className="bg-card-dark rounded-3xl border border-white/5 flex flex-col shadow-2xl overflow-visible">
            <div className="overflow-x-auto overflow-visible">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-white/[0.02] border-b border-white/5">
                        <tr>
                            {columns.map((col, idx) => (
                                <th 
                                    key={idx} 
                                    className={`px-4 lg:px-8 py-4 lg:py-6 text-[10px] lg:text-xs font-black text-gray-400 uppercase tracking-widest ${col.headerClassName || ''}`}
                                    onClick={col.onHeaderClick}
                                    style={col.onHeaderClick ? { cursor: 'pointer' } : {}}
                                >
                                    <span className="flex items-center gap-1">
                                        {col.header}
                                        {col.headerIcon && (
                                            <span className="material-symbols-outlined text-sm">{col.headerIcon}</span>
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-20 lg:py-24 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="size-6 lg:size-8 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin"></div>
                                        <p className="text-[10px] lg:text-sm text-gray-500 font-black uppercase tracking-widest">{loadingMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-20 lg:py-24 text-center">
                                    <p className="text-[10px] lg:text-sm text-gray-500 font-black uppercase tracking-widest">{emptyMessage}</p>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIdx) => (
                                <tr key={row.id || rowIdx} className="hover:bg-white/[0.02] transition-colors group">
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className={`px-4 lg:px-8 py-3 lg:py-5 ${col.className || ''}`}>
                                            {col.render ? col.render(row) : (row[col.key] || '-')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Section */}
            {pagination && (
                <div className="p-4 lg:p-8 bg-white/[0.01] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 lg:gap-6">
                    <p className="text-[10px] lg:text-xs text-gray-500 font-black uppercase tracking-widest">
                        {pagination.totalCount !== undefined 
                            ? `Total ${pagination.totalCount.toLocaleString()} activities recorded` 
                            : `Page ${pagination.page} of ${pagination.totalPages}`
                        }
                    </p>
                    
                    <div className="flex gap-2 lg:gap-3 items-center">
                        <button
                            onClick={() => pagination.onPageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="h-10 lg:h-12 px-3 lg:px-5 flex items-center justify-center rounded-xl lg:rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:text-white disabled:opacity-30 transition-all font-bold group"
                        >
                            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform text-sm lg:text-base">chevron_left</span>
                            <span className="ml-2 text-[9px] lg:text-[10px] uppercase tracking-widest hidden xs:inline">Prev</span>
                        </button>

                        <div className="h-10 lg:h-12 px-4 lg:px-6 flex items-center bg-white/5 border border-white/5 rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm text-yellow-400">
                            {pagination.page} <span className="mx-2 text-slate-600">/</span> {pagination.totalPages || 1}
                        </div>

                        <button
                            onClick={() => pagination.onPageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                            className="h-10 lg:h-12 px-3 lg:px-5 flex items-center justify-center rounded-xl lg:rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:text-white disabled:opacity-30 transition-all font-bold group"
                        >
                            <span className="mr-2 text-[9px] lg:text-[10px] uppercase tracking-widest hidden xs:inline">Next</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-sm lg:text-base">chevron_right</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
