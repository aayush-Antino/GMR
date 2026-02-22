import React from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { executiveDummyData } from '../data/executiveDummyData';
import { findKPIOrigin } from '../utils/dashboardUtils';
import { AlertCircle, ArrowRight, Activity, AlertTriangle, ShieldAlert, MapPin } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const Home = () => {
    const navigate = useNavigate();
    const { departments } = executiveDummyData;

    const handleKPIClick = (kpi, deptName) => {
        const origin = findKPIOrigin(kpi.kpiName, deptName);
        if (origin) {
            navigate(`/dashboard/${origin.dashKey}/kpi/${encodeURIComponent(kpi.kpiName)}`);
        } else {
            console.warn('Origin not found for KPI:', kpi.kpiName);
        }
    };

    return (
        <div className="min-h-screen font-sans bg-slate-50 text-slate-700 pb-20">
            <Topbar />
            <div className="pt-24 px-4 md:px-8 max-w-[1600px] mx-auto">

                <div className="mb-10 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Systemic Action Center</h1>
                        </div>
                        <p className="text-slate-500 text-sm font-medium max-w-2xl">
                            Consolidated view of all active <span className="text-red-600 font-bold items-center inline-flex gap-1"><AlertTriangle size={14} /> Critical</span> and <span className="text-orange-500 font-bold items-center inline-flex gap-1"><AlertCircle size={14} /> Watchlist</span> infrastructure anomalies requiring immediate intervention across all departments.
                        </p>
                    </div>
                    <div className="flex bg-slate-100 rounded-xl p-2 gap-2">
                        <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col items-center">
                            <span className="text-2xl font-black text-red-600">
                                {departments.reduce((acc, dept) => acc + (dept.kpiList?.filter(k => k.status === 'Critical').length || 0), 0)}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Critical</span>
                        </div>
                        <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col items-center">
                            <span className="text-2xl font-black text-orange-500">
                                {departments.reduce((acc, dept) => acc + (dept.kpiList?.filter(k => k.status === 'Watchlist').length || 0), 0)}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Watchlist</span>
                        </div>
                    </div>
                </div>

                {/* Regional Severity Tracker */}
                <div className="mb-10 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col lg:flex-row gap-8 items-center">
                    <div className="w-full lg:w-1/3 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><MapPin size={20} /></div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Severe Areas Tracker</h2>
                        </div>
                        <p className="text-sm font-medium text-slate-500 mb-4">Live Anomaly Heatmap identifying regional hotspots requiring priority dispatch.</p>

                        <div className="flex gap-3">
                            <div className="flex-1 p-3 bg-red-50 rounded-xl border border-red-100 flex flex-col justify-center">
                                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-0.5">Critical Sector</span>
                                <span className="text-xl font-black text-red-700">Kashi</span>
                            </div>
                            <div className="w-24 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-center items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Alerts</span>
                                <span className="text-xl font-black text-slate-800">142</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:flex-1 h-32 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={[
                                { name: 'Kashi', critical: 142 },
                                { name: 'Triveni', critical: 64 },
                                { name: 'Agra', critical: 28 }
                            ]} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} width={60} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} />
                                <Bar dataKey="critical" radius={[0, 4, 4, 0]} barSize={16}>
                                    {
                                        [
                                            { name: 'Kashi', critical: 142 },
                                            { name: 'Triveni', critical: 64 },
                                            { name: 'Agra', critical: 28 }
                                        ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.critical > 100 ? '#ef4444' : entry.critical > 50 ? '#f97316' : '#3b82f6'} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {departments.map((dept, index) => {
                        // Gather critical and watchlist
                        const criticalKPIs = dept.kpiList?.filter(k => k.status === 'Critical') || [];
                        const watchlistKPIs = dept.kpiList?.filter(k => k.status === 'Watchlist') || [];

                        // Combine them (Critical first)
                        const severeKPIs = [...criticalKPIs, ...watchlistKPIs];

                        // Don't render the department card at all if it has no severe KPIs (though dummy data ensures they do)
                        if (severeKPIs.length === 0) return null;

                        // To avoid infinite lists, let's limit to the top 6 most actionable per department visually
                        const displayedKPIs = severeKPIs.slice(0, 6);
                        const hiddenCount = severeKPIs.length - displayedKPIs.length;

                        return (
                            <div key={dept.id} className="bg-white rounded-3xl border border-slate-200 p-1 lg:p-2 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col">
                                <div className="p-6 pb-4 border-b border-slate-100 flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                            {dept.name}
                                        </h2>
                                        <p className="text-xs font-bold text-slate-400 capitalize mt-1.5 flex gap-3">
                                            <span className="text-red-500 flex items-center gap-1"><AlertTriangle size={12} /> {criticalKPIs.length} Critical</span>
                                            <span className="text-orange-400 flex items-center gap-1"><AlertCircle size={12} /> {watchlistKPIs.length} Warning</span>
                                        </p>
                                    </div>
                                    <div className="p-3 bg-slate-50 text-slate-600 rounded-xl border border-slate-200">
                                        <ShieldAlert size={20} />
                                    </div>
                                </div>

                                <div className="p-4 flex flex-col gap-2.5 flex-1 bg-slate-50/50 rounded-b-[22px]">
                                    {displayedKPIs.map(kpi => (
                                        <div
                                            key={kpi.kpiName}
                                            onClick={() => handleKPIClick(kpi, dept.name)}
                                            className="group flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                                        >
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${kpi.status === 'Critical' ? 'bg-red-500' : 'bg-orange-400'}`}></div>

                                            <div className="flex items-start gap-4 flex-1 pl-2">
                                                <div className="flex flex-col">
                                                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors pr-4">{kpi.kpiName}</h3>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest mt-1.5 w-max px-2 py-0.5 rounded ${kpi.status === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                                                        {kpi.status} Alert
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-3 sm:mt-0 sm:ml-4 flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pl-2 sm:pl-0 border-t border-slate-100 sm:border-0 pt-3 sm:pt-0">
                                                <div className="flex flex-col items-start sm:items-end">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Current Value</span>
                                                    <span className="text-lg font-black text-slate-900">{kpi.value}</span>
                                                </div>
                                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    <ArrowRight size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {hiddenCount > 0 && (
                                        <div className="text-center py-2">
                                            <span className="text-xs font-bold text-slate-400">+{hiddenCount} more alerts active in {dept.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Home;
