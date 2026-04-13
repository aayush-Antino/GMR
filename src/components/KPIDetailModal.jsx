import React, { useState, useRef, useEffect } from 'react';
import { X, CheckCircle, AlertOctagon, AlertTriangle, Activity, MapPin, ChevronDown, RefreshCw, Briefcase, Maximize2, Minimize2 } from 'lucide-react';
import SmartChart from './charts/SmartChart';
import { getRegionChartData, REGIONS } from '../utils/regionUtils';
import { useSmartMeterKPI } from '../hooks/useSmartMeterKPI';
import { getDateRange, fillDateGaps, getPeriodFromRange } from '../utils/dateUtils';

const STATUS_CFG = {
    Critical: { color: '#ef4444', light: '#fff1f1', border: '#fecaca', label: 'Critical', shadow: 'rgba(239, 68, 68, 0.15)' },
    Warning: { color: '#f97316', light: '#fff4ed', border: '#fed7aa', label: 'Warning', shadow: 'rgba(249, 115, 22, 0.15)' },
    Stable: { color: '#3b82f6', light: '#eff6ff', border: '#bfdbfe', label: 'Stable', shadow: 'rgba(59, 130, 246, 0.15)' },
    Ready: { color: '#8b5cf6', light: '#f5f3ff', border: '#ddd6fe', label: 'Ready', shadow: 'rgba(139, 92, 246, 0.15)' },
    'On Track': { color: '#10b981', light: '#f0fdf4', border: '#a7f3d0', label: 'On Track', shadow: 'rgba(16, 185, 129, 0.15)' },
    Good: { color: '#10b981', light: '#f0fdf4', border: '#a7f3d0', label: 'Good', shadow: 'rgba(16, 185, 129, 0.15)' },
};

const cfgOf = s => STATUS_CFG[s] || { color: '#9ca3af', light: '#f9fafb', border: '#e5e7eb', label: s, shadow: 'rgba(156, 163, 175, 0.1)' };

const CHART_TYPES = [
    { id: null, label: 'Auto Detect' },
    { id: 'area', label: 'Area Chart' },
    { id: 'multi-area', label: 'Multi Area' },
    { id: 'multi-line', label: 'Multi Line' },
    { id: 'bar', label: 'Bar' },
    { id: 'hbar', label: 'Horizontal Bar' },
    { id: 'donut', label: 'Donut / Pie' },
    { id: 'gauge', label: 'Gauge' },
    { id: 'boxplot', label: 'Box Plot' },
    { id: 'funnel', label: 'Funnel' },
    { id: 'pareto', label: 'Pareto' },
    { id: 'dual-axis', label: 'Dual Axis' },
];

// ── Chart Skeleton ────────────────────────────────────────────────────────────
const ChartSkeleton = () => (
    <div className="h-full w-full flex flex-col items-center justify-center gap-3 animate-pulse">
        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Activity size={20} className="text-slate-300" />
        </div>
        <div className="space-y-2 w-2/3">
            <div className="h-2 bg-slate-100 rounded-full" />
            <div className="h-2 bg-slate-100 rounded-full w-4/5 mx-auto" />
        </div>
        <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-widest">Fetching live data…</p>
    </div>
);

// ── Error Banner ───────────────────────────────────────────────────────────────
const ErrorBanner = ({ message, onRetry }) => {
    const isTimeout = message?.includes('504');
    return (
        <div className="h-full w-full flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertOctagon size={20} className={isTimeout ? "text-orange-400" : "text-red-400"} />
            </div>
            <p className="text-[12px] font-bold text-red-500 text-center px-4 max-w-xs">
                {isTimeout 
                    ? 'The request timed out. This specific filter combination might be too heavy for the server. Try adjusting the level or range.' 
                    : (message || 'Failed to load data')}
            </p>
            <button
                onClick={onRetry}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-xl hover:bg-primary transition-colors"
            >
                <RefreshCw size={12} /> {isTimeout ? 'Try Again' : 'Retry'}
            </button>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
const KPIDetailModal = ({ isOpen, onClose, kpi }) => {
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [duration, setDuration] = useState(kpi?.chartData?.allowedDurations?.[0] || 'Daily');
    const [category, setCategory] = useState('Total');
    const [level, setLevel] = useState('Discom');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [isCustomDate, setIsCustomDate] = useState(false);
    const [selectedProject, setSelectedProject] = useState('All');

    const isBusiness = kpi?.department === 'Business';

    // Params for the API – map UI state to API param names
    const levelToParam = (l) => ({
        Discom: 'discom', Zone: 'zone', Circle: 'circle',
        Division: 'division', SubDivision: 'subdivision',
    }[l] || 'discom');

    const apiParams = isBusiness ? {
        period: isCustomDate ? getPeriodFromRange(fromDate, toDate) : duration.toLowerCase(),
        level_by: levelToParam(level),
        ...(category !== 'Total' ? { meter_category: category.toLowerCase() } : {}),
        ...(isCustomDate && fromDate ? { from_date: fromDate } : {}),
        ...(isCustomDate && toDate ? { to_date: toDate } : {}),
        ...(selectedProject !== 'All' ? { project: selectedProject } : {}),
    } : {};

    const [debouncedParams, setDebouncedParams] = useState(apiParams);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedParams(apiParams);
        }, 300);
        return () => clearTimeout(handler);
    }, [JSON.stringify(apiParams)]);

    const {
        trendData: liveTrend,
        distData: liveDist,
        loading: apiLoading,
        error: apiError,
        refetch,
    } = useSmartMeterKPI(kpi?.name, debouncedParams, isBusiness && isOpen);
    
    const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
    const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
    const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
    const [expandedChart, setExpandedChart] = useState(null); // 'trend' | 'dist'
    
    // Chart type overrides (Business only)
    const [trendType, setTrendType] = useState(null);
    const [distType, setDistType] = useState(null);
    const [isTrendTypeOpen, setIsTrendTypeOpen] = useState(false);
    const [isDistTypeOpen, setIsDistTypeOpen] = useState(false);
    
    const dropdownRef = useRef(null);
    const durationRef = useRef(null);
    const levelRef = useRef(null);
    const categoryRef = useRef(null);
    const projectRef = useRef(null);
    const trendTypeRef = useRef(null);
    const distTypeRef = useRef(null);

    useEffect(() => {
        if (kpi) {
            const initialDur = kpi.chartData?.allowedDurations?.[0] || 'Daily';
            const { from, to } = getDateRange(initialDur);
            setDuration(initialDur);
            setFromDate(from);
            setToDate(to);
            setIsCustomDate(false);
            setCategory('Total');
            setLevel('Discom');
            setSelectedProject('All');
            setTrendType(kpi.chartData?.isTimeSeries === false ? 'bar' : null);
            setDistType('hbar');
        }
    }, [kpi?.name, isOpen]); // Add isOpen so it resets when modal re-opens

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsRegionDropdownOpen(false);
            }
            if (durationRef.current && !durationRef.current.contains(event.target)) {
                setIsDurationDropdownOpen(false);
            }
            if (levelRef.current && !levelRef.current.contains(event.target)) {
                setIsLevelDropdownOpen(false);
            }
            if (projectRef.current && !projectRef.current.contains(event.target)) {
                setIsProjectDropdownOpen(false);
            }
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
            }
            if (trendTypeRef.current && !trendTypeRef.current.contains(event.target)) {
                setIsTrendTypeOpen(false);
            }
            if (distTypeRef.current && !distTypeRef.current.contains(event.target)) {
                setIsDistTypeOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen || !kpi) return null;

    // Derive region-specific chart data (falls back to global data when 'All')
    const activeChartData = getRegionChartData(kpi.chartData, selectedRegion);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Critical': return <AlertOctagon size={24} className="text-red-500" />;
            case 'Warning': return <AlertTriangle size={24} className="text-yellow-500" />;
            case 'Stable': return <CheckCircle size={24} className="text-green-500" />;
            default: return <Activity size={24} className="text-blue-500" />;
        }
    };

    const getStatusColor = (status) => {
        const c = cfgOf(status);
        return {
            bg: c.light,
            text: c.color,
            border: c.border,
            shadow: c.shadow
        };
    };


    return (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f1f5f9 100%)' }}>
            <div className="min-h-full flex flex-col">

                {/* Header */}
                <div className="px-5 py-2 border-b border-white/20 flex justify-between items-center bg-white/40 backdrop-blur-xl sticky top-0 z-10 shadow-sm transition-all duration-300">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                            <Activity size={18} className="text-blue-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0">
                                <div className="flex items-center gap-1">
                                    <div className="w-0.5 h-2 bg-primary rounded-full" />
                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{kpi.department}</p>
                                </div>
                                <div className="flex gap-1.5">
                                    {kpi.department === 'Business' && (
                                        <div className="px-1.5 py-0 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-100 text-[7px] font-black uppercase tracking-tighter shadow-sm flex items-center gap-1 animate-pulse">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                            Live
                                        </div>
                                    )}
                                    {/* <div className="px-1.5 py-0 rounded-full border bg-slate-900 text-white border-slate-800 text-[7px] font-black uppercase tracking-tighter shadow-md flex items-center gap-1">
                                        <CheckCircle size={7} />
                                        Verified
                                    </div> */}
                                </div>
                            </div>
                            <h2 className="text-base font-black text-slate-900 leading-tight tracking-tight">{kpi.name}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-2.5 py-1 rounded-lg bg-primary text-white hover:bg-primary/90 font-medium transition-colors shadow-sm text-[10px]">
                            Report
                        </button>
                        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-white hover:shadow-md rounded-lg transition-all border border-gray-200">
                            <X size={14} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-4 max-w-screen-2xl mx-auto w-full">

                    {/* Main Content Layout: Stacked for clarity and focus */}
                    <div className="flex flex-col gap-4">
                        
                        {/* 1. Charts Section: Full Width Priority */}
                        <div className="space-y-8">
                            {/* Section header + filters */}
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Activity size={12} />
                                        Analytics
                                    </h3>

                                    {kpi.department === 'Business' ? (
                                        <div className="flex flex-wrap items-center gap-3">
                                            {/* Duration Filter */}
                                            <div className="relative" ref={durationRef}>
                                                <button
                                                    onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 rounded-lg shadow-sm transition-all duration-200"
                                                >
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Duration:</span>
                                                    <span className="text-[11px] font-bold text-slate-800">{duration}</span>
                                                    <ChevronDown size={12} className={`text-slate-400 transition-transform ${isDurationDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {isDurationDropdownOpen && (
                                                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                                                        {(kpi.chartData?.allowedDurations || ['Daily', 'Weekly', 'Monthly']).map(d => (
                                                            <button
                                                                key={d}
                                                                onClick={() => { 
                                                                    const { from, to } = getDateRange(d);
                                                                    setDuration(d); 
                                                                    setFromDate(from);
                                                                    setToDate(to);
                                                                    setIsCustomDate(false);
                                                                    setIsDurationDropdownOpen(false); 
                                                                }}
                                                                className={`w-full text-left px-4 py-2 text-[11px] font-bold ${(!isCustomDate && duration === d) ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-gray-50'}`}
                                                            >
                                                                {d}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Category Filter */}
                                            <div className="relative" ref={categoryRef}>
                                                <button
                                                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 rounded-lg shadow-sm transition-all duration-200"
                                                >
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Category:</span>
                                                    <span className="text-[11px] font-bold text-slate-800">{category}</span>
                                                    <ChevronDown size={12} className={`text-slate-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {isCategoryDropdownOpen && (
                                                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                                                        {['Feeder', 'Dt', 'Consumer', 'Total'].map(c => (
                                                            <button
                                                                key={c}
                                                                onClick={() => { setCategory(c); setIsCategoryDropdownOpen(false); }}
                                                                className={`w-full text-left px-4 py-2 text-[11px] font-bold ${category === c ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-gray-50'}`}
                                                            >
                                                                {c}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Level Filter */}
                                            <div className="relative" ref={levelRef}>
                                                <button
                                                    onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 rounded-lg shadow-sm transition-all duration-200"
                                                >
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Level:</span>
                                                    <span className="text-[11px] font-bold text-slate-800">{level}</span>
                                                    <ChevronDown size={12} className={`text-slate-400 transition-transform ${isLevelDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {isLevelDropdownOpen && (
                                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto">
                                                        {['Discom', 'Zone', 'Circle', 'Division', 'SubDivision'].map(l => (
                                                            <button
                                                                key={l}
                                                                onClick={() => { setLevel(l); setIsLevelDropdownOpen(false); }}
                                                                className={`w-full text-left px-4 py-2 text-[11px] font-bold ${level === l ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-gray-50'}`}
                                                            >
                                                                {l}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Project Filter */}
                                            <div className="relative" ref={projectRef}>
                                                <button
                                                    onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 rounded-lg shadow-sm transition-all duration-200"
                                                >
                                                    <Briefcase size={12} className="text-primary/60" />
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Project:</span>
                                                    <span className="text-[11px] font-bold text-slate-800">
                                                        {['All', 'kashi', 'triveni', 'agra'].find(p => p === selectedProject)?.replace(/^\w/, c => c.toUpperCase()) || selectedProject}
                                                    </span>
                                                    <ChevronDown size={12} className={`text-slate-400 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {isProjectDropdownOpen && (
                                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 shadow-indigo-100/40">
                                                        {['All', 'kashi', 'triveni', 'agra'].map(proj => (
                                                            <button
                                                                key={proj}
                                                                onClick={() => { setSelectedProject(proj); setIsProjectDropdownOpen(false); }}
                                                                className={`w-full text-left px-4 py-2 text-[11px] font-bold transition-colors ${selectedProject === proj ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-gray-50'}`}
                                                            >
                                                                {proj === 'All' ? 'All Projects' : proj.replace(/^\w/, c => c.toUpperCase())}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Date Range Filter */}
                                            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm transition-all duration-200">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Range:</span>
                                                <input 
                                                    type={kpi.chartData?.isMonthlyOnly ? "month" : "date"} 
                                                    value={kpi.chartData?.isMonthlyOnly ? fromDate.slice(0, 7) : fromDate}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        setFromDate(kpi.chartData?.isMonthlyOnly ? `${val}-01` : val);
                                                        setIsCustomDate(true);
                                                    }}
                                                    className="text-[11px] font-bold text-slate-800 focus:outline-none bg-transparent w-auto"
                                                />
                                                <span className="text-gray-300">-</span>
                                                <input 
                                                    type={kpi.chartData?.isMonthlyOnly ? "month" : "date"} 
                                                    value={kpi.chartData?.isMonthlyOnly ? toDate.slice(0, 7) : toDate}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        setToDate(kpi.chartData?.isMonthlyOnly ? `${val}-01` : val);
                                                        setIsCustomDate(true);
                                                    }}
                                                    className="text-[11px] font-bold text-slate-800 focus:outline-none bg-transparent w-auto"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        /* Default Region Filter for other departments */
                                        <div className="relative" ref={dropdownRef}>
                                            <button
                                                onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-xl shadow-[0_4px_12px_rgba(15,39,68,0.25)] transition-all duration-200"
                                            >
                                                <MapPin size={14} className="text-white/80" />
                                                <span className="text-xs font-bold">{selectedRegion === 'All' ? 'All Regions' : selectedRegion}</span>
                                                <ChevronDown size={14} className={`text-white/80 transition-transform ${isRegionDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            {isRegionDropdownOpen && (
                                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                                                    {REGIONS.map(r => (
                                                        <button
                                                            key={r}
                                                            onClick={() => { setSelectedRegion(r); setIsRegionDropdownOpen(false); }}
                                                            className={`w-full text-left px-4 py-2 text-xs font-bold ${selectedRegion === r ? 'bg-primary/5 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                                                        >
                                                            {r === 'All' ? 'All Regions' : r}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Chart Grid: Now occupies full width with responsive stacking */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Primary Trend Chart */}
                                    <div className="p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white shadow-[0_8px_32px_rgba(15,39,68,0.05)]">
                                        <div className="flex items-center justify-between mb-5">
                                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                                                {activeChartData?.trendTitle || 'Performance Trend'}
                                            </h3>
                                            
                                            <div className="flex items-center gap-2">
                                                {kpi.department === 'Business' && (
                                                    <div className="relative" ref={trendTypeRef}>
                                                        <button 
                                                            onClick={() => setIsTrendTypeOpen(!isTrendTypeOpen)}
                                                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-gray-100 transition-colors"
                                                        >
                                                            <Activity size={12} className="text-gray-400" />
                                                            {CHART_TYPES.find(t => t.id === trendType)?.label || 'Auto'}
                                                            <ChevronDown size={12} className={`transition-transform ${isTrendTypeOpen ? 'rotate-180' : ''}`} />
                                                        </button>
                                                        {isTrendTypeOpen && (
                                                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in slide-in-from-top-2 duration-200">
                                                                <div className="max-h-60 overflow-y-auto scrollbar-thin">
                                                                    {CHART_TYPES.filter(t => !t.id || (kpi.chartData?.allowedTrendTypes || []).includes(t.id)).map(type => (
                                                                        <button
                                                                            key={type.label}
                                                                            onClick={() => { setTrendType(type.id); setIsTrendTypeOpen(false); }}
                                                                            className={`w-full text-left px-4 py-2 text-[10px] font-bold transition-colors ${trendType === type.id ? 'bg-primary/5 text-primary' : 'text-slate-600 hover:bg-gray-50'}`}
                                                                        >
                                                                            {type.label}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <button 
                                                    onClick={() => setExpandedChart('trend')}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all shadow-sm border border-indigo-100 group"
                                                    title="Expand Chart"
                                                >
                                                    <Maximize2 size={12} className="group-hover:scale-110 transition-transform" />
                                                    <span className="text-[10px] font-black uppercase tracking-tight">Enlarge</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="h-[340px] relative">
                                            {isBusiness && (
                                                <div className="absolute top-0 right-0 flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md z-10 opacity-60">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Real-time</span>
                                                </div>
                                            )}
                                            {(() => {
                                                const effectivePeriod = isCustomDate ? getPeriodFromRange(fromDate, toDate) : duration.toLowerCase();
                                                
                                                return isBusiness && apiLoading ? (
                                                    <ChartSkeleton />
                                                ) : isBusiness && apiError ? (
                                                    <ErrorBanner message={apiError} onRetry={refetch} />
                                                ) : (
                                                    <SmartChart
                                                        data={isBusiness 
                                                            ? (kpi.chartData?.isTimeSeries === false ? liveTrend : fillDateGaps(liveTrend, fromDate, toDate, effectivePeriod))
                                                            : activeChartData?.trend}
                                                        name={kpi.name}
                                                        hint={trendType === 'Auto Detect' ? undefined : trendType}
                                                    />
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* Distribution Chart */}
                                    <div className="p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white shadow-[0_8px_32px_rgba(15,39,68,0.05)]">
                                        <div className="flex items-center justify-between mb-5">
                                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                                                {isBusiness ? (
                                                    selectedProject === 'All' ? 'Comparison by Cluster' :
                                                    level === 'Discom' ? 'Comparison by Zone' :
                                                    level === 'Zone' ? 'Comparison by Circle' :
                                                    'Comparison by Level'
                                                ) : (activeChartData?.distTitle || 'Distribution')}
                                            </h3>

                                            <div className="flex items-center gap-2">
                                                {kpi.department === 'Business' && (
                                                    <div className="relative" ref={distTypeRef}>
                                                        <button 
                                                            onClick={() => setIsDistTypeOpen(!isDistTypeOpen)}
                                                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-gray-100 transition-colors"
                                                        >
                                                            <Activity size={12} className="text-gray-400" />
                                                            {CHART_TYPES.find(t => t.id === distType)?.label || 'Auto'}
                                                            <ChevronDown size={12} className={`transition-transform ${isDistTypeOpen ? 'rotate-180' : ''}`} />
                                                        </button>
                                                        {isDistTypeOpen && (
                                                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in slide-in-from-top-2 duration-200">
                                                                <div className="max-h-60 overflow-y-auto scrollbar-thin">
                                                                    {CHART_TYPES.filter(t => !t.id || (kpi.chartData?.allowedDistTypes || []).includes(t.id)).map(type => (
                                                                        <button
                                                                            key={type.label}
                                                                            onClick={() => { setDistType(type.id); setIsDistTypeOpen(false); }}
                                                                            className={`w-full text-left px-4 py-2 text-[10px] font-bold transition-colors ${distType === type.id ? 'bg-primary/5 text-primary' : 'text-slate-600 hover:bg-gray-50'}`}
                                                                        >
                                                                            {type.label}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <button 
                                                    onClick={() => setExpandedChart('dist')}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all shadow-sm border border-indigo-100 group"
                                                    title="Expand Chart"
                                                >
                                                    <Maximize2 size={12} className="group-hover:scale-110 transition-transform" />
                                                    <span className="text-[10px] font-black uppercase tracking-tight">Enlarge</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="h-[340px]">
                                            {isBusiness && apiLoading ? (
                                                <ChartSkeleton />
                                            ) : isBusiness && apiError ? (
                                                <ErrorBanner message={apiError} onRetry={refetch} />
                                            ) : (
                                                <SmartChart
                                                    data={isBusiness ? liveDist : activeChartData?.distribution}
                                                    name={kpi.name}
                                                    hint={distType === 'Auto Detect' ? undefined : distType}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Info Cards Section: Now at the bottom in a clean grid */}
                        {/* 
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pb-3">
                            
                            Objective
                            <div className="relative p-3 rounded-lg bg-white/60 backdrop-blur-md border border-white shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-md">
                                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                    <Activity size={50} className="text-primary" />
                                </div>
                                <div className="relative flex flex-col gap-1.5">
                                    <h4 className="text-[8px] font-black text-primary uppercase tracking-wider">Objective</h4>
                                    <p className="text-[10px] font-bold text-slate-800 leading-snug italic">
                                        "{kpi.description}"
                                    </p>
                                </div>
                            </div>

                            Detailed Analysis
                            {kpi.analysisItems && (
                                <div className="bg-white/60 backdrop-blur-md p-3 rounded-lg border border-white shadow-sm">
                                    <h4 className="text-[8px] font-bold text-indigo-800 uppercase tracking-wider mb-1.5">Analysis</h4>
                                    <ul className="space-y-1 text-[9px] text-indigo-900">
                                        {kpi.analysisItems.map((item, idx) => (
                                            <li key={idx} className="flex justify-between gap-2 border-b border-indigo-50 pb-1 last:border-0">
                                                <span className="text-indigo-600 font-medium">{item.label}</span>
                                                <span className="font-semibold text-right">{item.value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            Calculation Logic
                            {kpi.qualityDescription && (
                                <div className="bg-white/60 backdrop-blur-md p-3 rounded-lg border border-white shadow-sm">
                                    <h4 className="text-[8px] font-bold text-purple-800 uppercase tracking-wider mb-1.5">{kpi.qualityHeader || 'Logic'}</h4>
                                    <p className="text-[9px] text-purple-900 leading-snug font-medium whitespace-pre-line">
                                        {kpi.qualityDescription}
                                    </p>
                                </div>
                            )}

                            Recommendation
                            <div className="p-3 rounded-lg border border-amber-100 shadow-sm" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' }}>
                                <h4 className="font-bold text-amber-800 mb-1 flex items-center gap-1 text-[8px] uppercase tracking-wider">
                                    <AlertTriangle size={10} /> Action
                                </h4>
                                <p className="text-amber-700 text-[9px] leading-snug">
                                    Review root cause for {kpi.department} regarding {kpi.name}.
                                </p>
                            </div>
                        </div>
                        */}
                    </div>
                </div>
            </div>

            {/* ── Fullscreen Chart Overlay ─────────────────────────────────────── */}
            {expandedChart && (
                <div className="fixed inset-0 z-[100] bg-white animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                    {/* Overlay Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-xl">
                                <Activity size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                                    {expandedChart === 'trend' ? (activeChartData?.trendTitle || 'Detailed Trend Analysis') : (activeChartData?.distTitle || 'Detailed Distribution')}
                                </h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{kpi.name} • Full Details</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setExpandedChart(null)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                        >
                            <Minimize2 size={16} />
                            <span className="text-xs font-bold">Back to Dashboard</span>
                        </button>
                    </div>

                    {/* Expanded Content */}
                    <div className="flex-1 p-8 overflow-hidden bg-slate-50/50">
                        <div className="h-full w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white p-8 relative">
                            {isBusiness && (
                                <div className="absolute top-6 right-8 flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full z-10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Live Data Active</span>
                                </div>
                            )}
                            
                            {(() => {
                                const chartData = expandedChart === 'trend' 
                                    ? (isBusiness 
                                        ? (kpi.chartData?.isTimeSeries === false ? liveTrend : fillDateGaps(liveTrend, fromDate, toDate, getPeriodFromRange(fromDate, toDate)))
                                        : activeChartData?.trend)
                                    : (isBusiness ? liveDist : activeChartData?.distribution);

                                return (
                                    <SmartChart
                                        data={chartData}
                                        name={kpi.name}
                                        hint={expandedChart === 'trend' ? trendType : distType}
                                        isDetailed={true}
                                    />
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KPIDetailModal;
