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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
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
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-white hover:shadow-md rounded-xl transition-all border border-gray-100">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">

                    {/* Status Badge Row */}
                    <div className="flex gap-3 flex-wrap">
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

                    {/* Detailed Analysis / Specifications */}
                    {(kpi.analysisItems || kpi.qualityDescription) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {kpi.analysisItems && (
                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                    <h4 className="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-2">Analysis Details</h4>
                                    <ul className="space-y-2 text-sm text-indigo-900">
                                        {kpi.analysisItems.map((item, idx) => (
                                            <li key={idx} className="flex justify-between">
                                                <span>{item.label}:</span>
                                                <span className="font-semibold text-right">{item.value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {kpi.qualityDescription && (
                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                    <h4 className="text-sm font-bold text-purple-800 uppercase tracking-wider mb-2">{kpi.qualityHeader || 'Quality Metrics'}</h4>
                                    <p className="text-sm text-purple-900 leading-relaxed font-medium">
                                        {kpi.qualityDescription}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Objective Analysis */}
                    <div className="relative p-8 rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                            <Activity size={120} className="text-primary" />
                        </div>
                        <div className="relative flex flex-col gap-4">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Business Objective</h4>
                            <p className="text-xl font-bold text-slate-800 leading-relaxed italic max-w-2xl">
                                "{kpi.description}"
                            </p>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div>
                        {/* Section header: title + region pill toggles */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Activity size={15} />
                                Analytics Charts
                            </h3>

                            {/* Region Pill Toggle */}
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

                        {/* Chart grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Trend Chart */}
                            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                                    {activeChartData?.trendTitle || 'Performance Trend'}
                                </h3>
                                <div className="h-60">
                                    <SmartChart data={activeChartData?.trend} />
                                </div>
                            </div>

                            {/* Distribution Chart */}
                            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                                    {activeChartData?.distTitle || 'Distribution'}
                                </h3>
                                <div className="h-60">
                                    <SmartChart data={activeChartData?.distribution} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommendation */}
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                        <h4 className="font-semibold text-amber-800 mb-1 flex items-center gap-2">
                            <AlertTriangle size={16} /> Recommended Action
                        </h4>
                        <p className="text-amber-700 text-sm">
                            Initiate a root cause analysis for the {kpi.department} department regarding {kpi.name}. Review recent changes in operational procedures.
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 z-10">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 font-medium transition-colors">
                        Close
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-medium transition-colors shadow-sm">
                        Download Full Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KPIDetailModal;
