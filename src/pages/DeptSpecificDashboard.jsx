import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import KPIDetailModal from '../components/KPIDetailModal';
import { dashboardData } from '../data/dashboardData';
import { executiveDummyData } from '../data/executiveDummyData';
import { dashboardMeta } from '../utils/dashboardUtils';
import { ArrowLeft, Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const STATUS_CFG = {
    Critical: { color: '#ef4444', light: '#fff1f1', border: '#fecaca', label: 'Critical', shadow: 'rgba(239, 68, 68, 0.15)' },
    Warning: { color: '#f97316', light: '#fff4ed', border: '#fed7aa', label: 'Warning', shadow: 'rgba(249, 115, 22, 0.15)' },
    Stable: { color: '#3b82f6', light: '#eff6ff', border: '#bfdbfe', label: 'Stable', shadow: 'rgba(59, 130, 246, 0.15)' },
    Ready: { color: '#8b5cf6', light: '#f5f3ff', border: '#ddd6fe', label: 'Ready', shadow: 'rgba(139, 92, 246, 0.15)' },
    'On Track': { color: '#10b981', light: '#f0fdf4', border: '#a7f3d0', label: 'On Track', shadow: 'rgba(16, 185, 129, 0.15)' },
    Good: { color: '#10b981', light: '#f0fdf4', border: '#a7f3d0', label: 'Good', shadow: 'rgba(16, 185, 129, 0.15)' },
};

const cfgOf = s => STATUS_CFG[s] || { color: '#9ca3af', light: '#f9fafb', border: '#e5e7eb', label: s, shadow: 'rgba(156, 163, 175, 0.1)' };
const STATUS_RANK = { Critical: 0, Warning: 1, 'On Track': 2, Stable: 3, Ready: 4, Good: 5 };

const Sparkline = ({ color }) => (
    <svg width="60" height="24" viewBox="0 0 60 24" fill="none" className="opacity-60">
        <path
            d="M2 18C8 16 12 6 18 10C24 14 30 4 36 8C42 12 48 2 54 6"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const KPICard = ({ kpi, idx, onClick }) => {
    const c = cfgOf(kpi.status);
    const isPositive = kpi.status === 'Good' || kpi.status === 'On Track' || kpi.status === 'Stable';

    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-2xl p-5 cursor-pointer border border-gray-100/50 hover:border-transparent transition-all duration-300 relative flex flex-col overflow-hidden"
            style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = `0 20px 25px -5px ${c.shadow}, 0 10px 10px -5px ${c.shadow}`;
                e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            {/* Left Accent Bar */}
            <div className="absolute top-4 bottom-4 left-0 w-1 rounded-r-lg transition-all duration-300 group-hover:w-1.5"
                style={{ background: c.color }} />

            <div className="flex items-start justify-between mb-4 pl-1">
                <div className="flex flex-col gap-1">
                    <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest self-start"
                        style={{ background: c.light, color: c.color }}
                    >
                        {c.label}
                    </span>
                </div>
                <Sparkline color={c.color} />
            </div>

            <h3 className="text-[14px] font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight mb-2 pl-1 line-clamp-2">
                {kpi.name}
            </h3>

            <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed mb-4 pl-1">
                {kpi.description || 'Monitoring operational excellence and performance metrics.'}
            </p>

            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between pl-1">
                <div className="flex items-center gap-2">
                    {isPositive ? (
                        <TrendingUp size={14} className="text-green-500" />
                    ) : kpi.status === 'Warning' ? (
                        <Minus size={14} className="text-orange-500" />
                    ) : (
                        <TrendingDown size={14} className="text-red-500" />
                    )}
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Active</span>
                </div>
                <div className="text-[10px] font-black text-gray-200 group-hover:text-primary/20 transition-colors uppercase tracking-widest">
                    #{String(idx + 1).padStart(2, '0')}
                </div>
            </div>
        </div>
    );
};

const DeptSpecificDashboard = () => {
    const { deptId, dashKey, kpiName } = useParams();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const dept = executiveDummyData.departments.find(d => d.id === deptId);
    const allItems = dashboardData[dashKey] || [];
    const meta = dashboardMeta[dashKey] || { title: 'Dashboard', description: '' };

    const deptItems = allItems.filter(item => item.department === dept?.name);

    const statuses = ['All', ...Object.keys(
        deptItems.reduce((acc, k) => { acc[k.status] = true; return acc; }, {})
    ).sort((a, b) => (STATUS_RANK[a] ?? 99) - (STATUS_RANK[b] ?? 99))];

    const items = deptItems.filter(item =>
        (activeFilter === 'All' || item.status === activeFilter) &&
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedKPI = kpiName ? deptItems.find(k => k.name.toLowerCase().trim() === kpiName.toLowerCase().trim()) : null;

    const handleKPIClick = (kpi) => {
        navigate(`/departments/${deptId}/dashboard/${dashKey}/kpi/${encodeURIComponent(kpi.name)}`);
    };

    const handleCloseModal = () => {
        navigate(`/departments/${deptId}/dashboard/${dashKey}`);
    };

    if (!dept) return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Topbar />
            <div className="pt-12 flex items-center justify-center min-h-screen">
                <p className="text-gray-400">Department not found.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen font-sans pt-16" style={{ background: '#f8fafc' }}>
            <Topbar />

            {/* ── Premium Header (Light Theme) ── */}
            <div className="sticky top-16 z-30 bg-white border-b" style={{ boxShadow: '0 4px 24px rgba(15,39,68,0.07)', borderBottomColor: '#e8edf4' }}>
                {/* Top row */}
                <div className="max-w-screen-2xl mx-auto px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {/* Left accent bar */}
                        <div className="hidden sm:block w-1 self-stretch rounded-full" style={{ background: 'linear-gradient(180deg, #F4A300 0%, #0f2744 100%)', minHeight: '48px' }} />
                        <button
                            onClick={() => navigate(`/departments/${deptId}`)}
                            className="w-9 h-9 flex items-center justify-center rounded-xl border transition-all flex-shrink-0"
                            style={{ borderColor: '#e2e8f0', color: '#64748b', background: '#f8fafc' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#0f2744'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0f2744'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-1" style={{ color: '#F4A300' }}>{dept.name}</p>
                            <h1 className="text-2xl font-black leading-tight" style={{ color: '#0f2744' }}>{meta.title}</h1>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative flex-shrink-0">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search across metrics..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-72 pl-10 pr-4 py-2.5 text-sm rounded-xl focus:outline-none text-slate-700 transition-all"
                            style={{ background: '#f1f5f9', border: '1.5px solid #e2e8f0' }}
                            onFocus={e => { e.currentTarget.style.borderColor = '#0f2744'; e.currentTarget.style.background = '#fff'; }}
                            onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f1f5f9'; }}
                        />
                    </div>
                </div>

                {/* Filter pills */}
                <div className="max-w-screen-2xl mx-auto px-8 pb-4 flex items-center gap-2 overflow-x-auto no-scrollbar" style={{ borderTop: '1px solid #f1f5f9' }}>
                    <div className="flex items-center gap-2 pt-3">
                        {statuses.map(s => {
                            const c = s === 'All' ? null : cfgOf(s);
                            const isActive = activeFilter === s;
                            const count = s === 'All' ? deptItems.length : deptItems.filter(i => i.status === s).length;
                            return (
                                <button
                                    key={s}
                                    onClick={() => setActiveFilter(s)}
                                    className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-bold rounded-full transition-all duration-200 whitespace-nowrap"
                                    style={isActive ? {
                                        background: '#0f2744',
                                        color: '#fff',
                                        border: '1.5px solid #0f2744',
                                        boxShadow: '0 4px 12px rgba(15,39,68,0.2)',
                                        transform: 'scale(1.05)',
                                    } : {
                                        background: '#f8fafc',
                                        color: '#64748b',
                                        border: '1.5px solid #e2e8f0',
                                    }}
                                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = '#0f2744'; e.currentTarget.style.color = '#0f2744'; } }}
                                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; } }}
                                >
                                    {c && <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />}
                                    {s}
                                    <span className="opacity-50">({count})</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Dashboard Content ── */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {items.map((kpi, idx) => (
                            <KPICard
                                key={idx}
                                kpi={kpi}
                                idx={idx}
                                onClick={() => handleKPIClick(kpi)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                            <Search size={32} className="text-gray-200" />
                        </div>
                        <p className="text-sm font-bold text-slate-500">No parameters found matching your search</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or search terms</p>
                        <button
                            onClick={() => { setSearch(''); setActiveFilter('All'); }}
                            className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-primary transition-all shadow-sm"
                        >
                            Reset Dashboard
                        </button>
                    </div>
                )}
            </div>

            <KPIDetailModal isOpen={!!selectedKPI} onClose={handleCloseModal} kpi={selectedKPI} />
        </div>
    );
};

export default DeptSpecificDashboard;

