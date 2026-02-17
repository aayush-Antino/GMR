import React from 'react';
import { X, CheckCircle, AlertOctagon, AlertTriangle, Activity } from 'lucide-react';
import LineChartComponent from './charts/LineChartComponent';
import BarChartComponent from './charts/BarChartComponent';

const KPIDetailModal = ({ isOpen, onClose, kpi }) => {
    if (!isOpen || !kpi) return null;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Critical': return <AlertOctagon size={24} className="text-red-500" />;
            case 'Warning': return <AlertTriangle size={24} className="text-yellow-500" />;
            case 'Stable': return <CheckCircle size={24} className="text-green-500" />;
            default: return <Activity size={24} className="text-blue-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Critical': return 'bg-red-50 text-red-700 border-red-200';
            case 'Warning': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'Stable': return 'bg-green-50 text-green-700 border-green-200';
            default: return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    };

    // Mock Data for Charts (since we don't have it in the CSV currently)
    const trendData = [
        { name: 'Week 1', value: Math.floor(Math.random() * 20) + 70 },
        { name: 'Week 2', value: Math.floor(Math.random() * 20) + 75 },
        { name: 'Week 3', value: Math.floor(Math.random() * 20) + 72 },
        { name: 'Week 4', value: Math.floor(Math.random() * 20) + 80 },
        { name: 'Week 5', value: Math.floor(Math.random() * 20) + 82 },
        { name: 'Current', value: Math.floor(Math.random() * 20) + 85 },
    ];

    const targetData = [
        { name: 'Current', value: 85 },
        { name: 'Target', value: 98 },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        {getStatusIcon(kpi.status)}
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{kpi.name}</h2>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{kpi.department} Department</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">

                    {/* Status Badge Row */}
                    <div className="flex gap-4 flex-wrap">
                        <div className={`px-4 py-2 rounded-lg border font-semibold flex items-center gap-2 ${getStatusColor(kpi.status)}`}>
                            <span>Status: {kpi.status}</span>
                        </div>
                        <div className="px-4 py-2 rounded-lg border bg-blue-50 text-primary border-blue-100 font-semibold shadow-sm">
                            <div className="flex items-center gap-2">
                                <Activity size={16} />
                                <span>Verified Metric</span>
                            </div>
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
                                    <h4 className="text-sm font-bold text-purple-800 uppercase tracking-wider mb-2">Quality Metrics</h4>
                                    <p className="text-sm text-purple-900 leading-relaxed font-medium">
                                        {kpi.qualityDescription}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Text Analysis */}
                    <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 text-gray-700 shadow-sm">
                        <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Business Objective</h4>
                        <p className="text-lg leading-relaxed text-gray-800 italic">
                            "{kpi.description}"
                        </p>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Trend Chart */}
                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                                {kpi.chartData?.trendTitle || 'Performance Trend'}
                            </h3>
                            <div className="h-64">
                                <LineChartComponent data={kpi.chartData?.trend || trendData} />
                            </div>
                        </div>

                        {/* Target/Distribution Chart */}
                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                                {kpi.chartData?.distTitle || 'Target vs Actual'}
                            </h3>
                            <div className="h-64">
                                <BarChartComponent data={kpi.chartData?.distribution || targetData} />
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
