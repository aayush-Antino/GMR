import React, { useState } from 'react';
import { X, CheckCircle, AlertOctagon, AlertTriangle, Activity, MapPin } from 'lucide-react';
import SmartChart from './charts/SmartChart';
import { getRegionChartData, REGIONS } from '../utils/regionUtils';

const STATUS_CFG = {
    Critical: { color: '#ef4444', light: '#fff1f1', border: '#fecaca', label: 'Critical', shadow: 'rgba(239, 68, 68, 0.15)' },
    Warning: { color: '#f97316', light: '#fff4ed', border: '#fed7aa', label: 'Warning', shadow: 'rgba(249, 115, 22, 0.15)' },
    Stable: { color: '#3b82f6', light: '#eff6ff', border: '#bfdbfe', label: 'Stable', shadow: 'rgba(59, 130, 246, 0.15)' },
    Ready: { color: '#8b5cf6', light: '#f5f3ff', border: '#ddd6fe', label: 'Ready', shadow: 'rgba(139, 92, 246, 0.15)' },
    'On Track': { color: '#10b981', light: '#f0fdf4', border: '#a7f3d0', label: 'On Track', shadow: 'rgba(16, 185, 129, 0.15)' },
    Good: { color: '#10b981', light: '#f0fdf4', border: '#a7f3d0', label: 'Good', shadow: 'rgba(16, 185, 129, 0.15)' },
};

const cfgOf = s => STATUS_CFG[s] || { color: '#9ca3af', light: '#f9fafb', border: '#e5e7eb', label: s, shadow: 'rgba(156, 163, 175, 0.1)' };

const KPIDetailModal = ({ isOpen, onClose, kpi }) => {
    const [selectedRegion, setSelectedRegion] = useState('All');
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
        <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto animate-in fade-in duration-200">
            <div className="min-h-full flex flex-col">

                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-10 shadow-sm">
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

                    {/* Status Badge Row */}
                    <div className="flex gap-3 flex-wrap mb-8">
                        {(() => {
                            const sc = getStatusColor(kpi.status);
                            return (
                                <div
                                    className="px-4 py-2 rounded-full border text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                                    style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}
                                >
                                    <div className="w-2 h-2 rounded-full" style={{ background: sc.text }} />
                                    {kpi.status} Status
                                </div>
                            );
                        })()}
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
                            <div className="relative p-6 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden group">
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
                                <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm">
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
                                <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm">
                                    <h4 className="text-sm font-bold text-purple-800 uppercase tracking-wider mb-3">{kpi.qualityHeader || 'Quality Metrics'}</h4>
                                    <p className="text-sm text-purple-900 leading-relaxed font-medium whitespace-pre-line">
                                        {kpi.qualityDescription}
                                    </p>
                                </div>
                            )}

                            {/* Recommendation */}
                            <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 shadow-sm">
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
                            {/* Section header + region filter */}
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <Activity size={15} />
                                    Analytics Charts
                                </h3>
                                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                                    <MapPin size={13} className="text-gray-400 ml-2 flex-shrink-0" />
                                    {REGIONS.map(r => (
                                        <button
                                            key={r}
                                            onClick={() => setSelectedRegion(r)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap
                                                ${selectedRegion === r
                                                    ? 'bg-primary text-white shadow-md shadow-primary/30 scale-105'
                                                    : 'text-gray-500 hover:text-gray-800 hover:bg-white/70'
                                                }`}
                                        >
                                            {r === 'All' ? 'All Regions' : r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Chart grid - full width, stacked */}
                            <div className="flex flex-col gap-6">
                                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">
                                        {activeChartData?.trendTitle || 'Performance Trend'}
                                    </h3>
                                    <div className="h-96">
                                        <SmartChart data={activeChartData?.trend} />
                                    </div>
                                </div>

                                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">
                                        {activeChartData?.distTitle || 'Distribution'}
                                    </h3>
                                    <div className="h-96">
                                        <SmartChart data={activeChartData?.distribution} />
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
