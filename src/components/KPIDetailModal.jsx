import React, { useState, useRef, useEffect } from 'react';
import { X, CheckCircle, AlertOctagon, AlertTriangle, Activity, MapPin, ChevronDown, RefreshCw } from 'lucide-react';
import SmartChart from './charts/SmartChart';
import { getRegionChartData, REGIONS } from '../utils/regionUtils';
import { useSmartMeterKPI } from '../hooks/useSmartMeterKPI';

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
const ErrorBanner = ({ message, onRetry }) => (
    <div className="h-full w-full flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertOctagon size={20} className="text-red-400" />
        </div>
        <p className="text-[12px] font-bold text-red-500 text-center px-4">{message || 'Failed to load data'}</p>
        <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-xl hover:bg-primary transition-colors"
        >
            <RefreshCw size={12} /> Retry
        </button>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
const KPIDetailModal = ({ isOpen, onClose, kpi }) => {
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [duration, setDuration] = useState(kpi?.chartData?.allowedDurations?.[0] || 'Daily');
    const [category, setCategory] = useState('Total');
    const [level, setLevel] = useState('Discom');

    const isBusiness = kpi?.department === 'Business';

    // Params for the API – map UI state to API param names
    const levelToParam = (l) => ({
        Discom: 'discom', Zone: 'zone', Circle: 'circle',
        Division: 'division', SubDivision: 'subdivision', SubStation: 'substation',
    }[l] || 'discom');

    const apiParams = isBusiness ? {
        period: duration.toLowerCase(),
        ...(category !== 'Total' ? { meter_category: category } : {}),
    } : {};

    const {
        trendData: liveTrend,
        distData: liveDist,
        loading: apiLoading,
        error: apiError,
        refetch,
    } = useSmartMeterKPI(kpi?.name, apiParams, isBusiness && isOpen);
    
    const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
    const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
    const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    
    // Chart type overrides (Business only)
    const [trendType, setTrendType] = useState(null);
    const [distType, setDistType] = useState(null);
    const [isTrendTypeOpen, setIsTrendTypeOpen] = useState(false);
    const [isDistTypeOpen, setIsDistTypeOpen] = useState(false);
    
    const dropdownRef = useRef(null);
    const durationRef = useRef(null);
    const levelRef = useRef(null);
    const categoryRef = useRef(null);
    const trendTypeRef = useRef(null);
    const distTypeRef = useRef(null);

    useEffect(() => {
        if (kpi) {
            setDuration(kpi.chartData?.allowedDurations?.[0] || 'Daily');
            setCategory('Total');
            setLevel('Discom');
            setTrendType(null);
            setDistType(null);
        }
    }, [kpi?.name]);

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
                <div className="px-8 py-5 border-b border-white/20 flex justify-between items-center bg-white/40 backdrop-blur-xl sticky top-0 z-10 shadow-sm transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                            {getStatusIcon(kpi.status)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-1 h-3 bg-primary rounded-full" />
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{kpi.department}</p>
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{kpi.name}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-medium transition-colors shadow-sm text-sm">
                            Download Full Report
                        </button>
                        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-white hover:shadow-md rounded-xl transition-all border border-gray-200">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-8 max-w-screen-2xl mx-auto w-full">

                    <div className="flex gap-3 flex-wrap mb-8">
                        {kpi.department === 'Business' ? (
                            <div className="px-4 py-2 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-100 text-[11px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 animate-pulse">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                Live API Feed
                            </div>
                        ) : (
                            kpi.status && (
                                (() => {
                                    const sc = getStatusColor(kpi.status);
                                    return (
                                        <div
                                            className="px-4 py-2 rounded-full border text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                                            style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}
                                        >
                                            <div className="flex-shrink-0 w-2 h-2 rounded-full" style={{ background: sc.text }} />
                                            {kpi.status} Status
                                        </div>
                                    );
                                })()
                            )
                        )}
                        <div className="px-4 py-2 rounded-full border bg-slate-900 text-white border-slate-800 text-[11px] font-bold uppercase tracking-wider shadow-md flex items-center gap-2">
                            <Activity size={12} />
                            Verified Parameter
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                        {/* Left Column: KPI Details */}
                        <div className="xl:col-span-1 space-y-6">

                            {/* Objective */}
                            <div className="relative p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white shadow-[0_8px_32px_rgba(15,39,68,0.05)] overflow-hidden group transition-all duration-300 hover:shadow-[0_12px_48px_rgba(15,39,68,0.08)]">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                    <Activity size={100} className="text-primary" />
                                </div>
                                <div className="relative flex flex-col gap-3">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Business Objective</h4>
                                    <p className="text-base font-bold text-slate-800 leading-relaxed italic">
                                        "{kpi.description}"
                                    </p>
                                </div>
                            </div>

                            {/* Detailed Analysis */}
                            {kpi.analysisItems && (
                                <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white shadow-[0_8px_32px_rgba(15,39,68,0.05)]">
                                    <h4 className="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-3">Analysis Details</h4>
                                    <ul className="space-y-2.5 text-sm text-indigo-900">
                                        {kpi.analysisItems.map((item, idx) => (
                                            <li key={idx} className="flex justify-between gap-4 border-b border-indigo-50 pb-2 last:border-0">
                                                <span className="text-indigo-600 font-medium">{item.label}</span>
                                                <span className="font-semibold text-right">{item.value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Calculation Logic */}
                            {kpi.qualityDescription && (
                                <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white shadow-[0_8px_32px_rgba(15,39,68,0.05)]">
                                    <h4 className="text-sm font-bold text-purple-800 uppercase tracking-wider mb-3">{kpi.qualityHeader || 'Quality Metrics'}</h4>
                                    <p className="text-sm text-purple-900 leading-relaxed font-medium whitespace-pre-line">
                                        {kpi.qualityDescription}
                                    </p>
                                </div>
                            )}

                            {/* Recommendation */}
                            <div className="p-5 rounded-2xl border border-amber-100 shadow-sm" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' }}>
                                <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2 text-sm">
                                    <AlertTriangle size={16} /> Recommended Action
                                </h4>
                                <p className="text-amber-700 text-sm leading-relaxed">
                                    Initiate a root cause analysis for the {kpi.department} department regarding {kpi.name}. Review recent changes in operational procedures.
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Charts */}
                        <div className="xl:col-span-2 space-y-6">
                            {/* Section header + filters */}
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Activity size={15} />
                                        Analytics Charts
                                    </h3>

                                    {kpi.department === 'Business' ? (
                                        <div className="flex flex-wrap items-center gap-3">
                                            {/* Duration Filter */}
                                            <div className="relative" ref={durationRef}>
                                                <button
                                                    onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 rounded-xl shadow-sm transition-all duration-200"
                                                >
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Duration:</span>
                                                    <span className="text-xs font-bold text-slate-800">{duration}</span>
                                                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDurationDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {isDurationDropdownOpen && (
                                                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                                                        {(kpi.chartData?.allowedDurations || ['Daily', 'Weekly', 'Monthly']).map(d => (
                                                            <button
                                                                key={d}
                                                                onClick={() => { setDuration(d); setIsDurationDropdownOpen(false); }}
                                                                className={`w-full text-left px-4 py-2 text-xs font-bold ${duration === d ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-gray-50'}`}
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
                                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 rounded-xl shadow-sm transition-all duration-200"
                                                >
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Category:</span>
                                                    <span className="text-xs font-bold text-slate-800">{category}</span>
                                                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {isCategoryDropdownOpen && (
                                                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                                                        {['Feeder', 'Dt', 'Consumer', 'Total'].map(c => (
                                                            <button
                                                                key={c}
                                                                onClick={() => { setCategory(c); setIsCategoryDropdownOpen(false); }}
                                                                className={`w-full text-left px-4 py-2 text-xs font-bold ${category === c ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-gray-50'}`}
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
                                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 rounded-xl shadow-sm transition-all duration-200"
                                                >
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Level:</span>
                                                    <span className="text-xs font-bold text-slate-800">{level}</span>
                                                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${isLevelDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {isLevelDropdownOpen && (
                                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto">
                                                        {['Discom', 'Zone', 'Circle', 'Division', 'SubDivision', 'SubStation'].map(l => (
                                                            <button
                                                                key={l}
                                                                onClick={() => { setLevel(l); setIsLevelDropdownOpen(false); }}
                                                                className={`w-full text-left px-4 py-2 text-xs font-bold ${level === l ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-gray-50'}`}
                                                            >
                                                                {l}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
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
                            </div>

                            {/* Chart grid - full width, stacked */}
                            <div className="flex flex-col gap-6">
                                <div className="p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white shadow-[0_8px_32px_rgba(15,39,68,0.05)]">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                                            {activeChartData?.trendTitle || 'Performance Trend'}
                                        </h3>
                                        
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
                                    </div>
                                    <div className="h-96 relative">
                                        {isBusiness && (
                                            <div className="absolute top-0 right-0 flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md z-10 opacity-60">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Real-time</span>
                                            </div>
                                        )}
                                        {isBusiness && apiLoading ? (
                                            <ChartSkeleton />
                                        ) : isBusiness && apiError ? (
                                            <ErrorBanner message={apiError} onRetry={refetch} />
                                        ) : (
                                            <SmartChart
                                                data={isBusiness ? liveTrend : activeChartData?.trend}
                                                name={kpi.name}
                                                hint={trendType}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white shadow-[0_8px_32px_rgba(15,39,68,0.05)]">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                                            {activeChartData?.distTitle || 'Distribution'}
                                        </h3>

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
                                    </div>
                                    <div className="h-96">
                                        {isBusiness && apiLoading ? (
                                            <ChartSkeleton />
                                        ) : isBusiness && apiError ? (
                                            <ErrorBanner message={apiError} onRetry={refetch} />
                                        ) : (
                                            <SmartChart
                                                data={isBusiness ? liveDist : activeChartData?.distribution}
                                                name={kpi.name}
                                                hint={distType}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KPIDetailModal;
