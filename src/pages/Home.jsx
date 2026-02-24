import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { executiveDummyData } from '../data/executiveDummyData';
import { findKPIOrigin } from '../utils/dashboardUtils';
import { getRegionForKPI } from '../utils/regionUtils';
import { AlertCircle, ArrowRight, Activity, AlertTriangle, ShieldAlert, MapPin, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import SmartChart from '../components/charts/SmartChart';

const Home = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('department');
    const [feedRegion, setFeedRegion] = useState('All'); // New state for feed filter
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
                <div className="flex flex-col gap-6 w-full">
                    {/* Top Row: Summary & Chart */}
                    <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full">
                        {/* Component 1: Summary */}
                        <div className="w-full lg:w-1/3 flex flex-col justify-center bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-red-50 text-red-600 rounded-lg"><MapPin size={24} /></div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Severe Areas Tracker</h2>
                            </div>
                            <p className="text-base font-medium text-slate-500 mb-8">Live Anomaly Headmap identifying regional hotspots requiring priority dispatch.</p>

                            <div className="flex gap-4 mt-auto">
                                <div className="flex-1 p-4 bg-red-50 rounded-2xl border border-red-100 flex flex-col justify-center">
                                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Critical Sector</span>
                                    <span className="text-3xl font-black text-red-700">
                                        {(function () {
                                            const counts = { Kashi: 0, Agra: 0, Triveni: 0 };
                                            departments.forEach(dept => {
                                                dept.kpiList?.forEach(kpi => {
                                                    if (kpi.status === 'Critical' || kpi.status === 'Watchlist') {
                                                        counts[getRegionForKPI(kpi.id)]++;
                                                    }
                                                });
                                            });
                                            return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
                                        })()}
                                    </span>
                                </div>
                                <div className="w-32 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-center items-center shadow-sm">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Alerts</span>
                                    <span className="text-3xl font-black text-slate-800">
                                        {(function () {
                                            let total = 0;
                                            departments.forEach(dept => {
                                                dept.kpiList?.forEach(kpi => {
                                                    if (kpi.status === 'Critical' || kpi.status === 'Watchlist') total++;
                                                });
                                            });
                                            return total;
                                        })()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Component 2: Chart */}
                        <div className="w-full lg:w-2/3 min-h-[350px] relative bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 pl-2">Alerts by Region</h3>
                            <div className="flex-1 min-h-[300px]">
                                {(function () {
                                    const counts = { Kashi: 0, Triveni: 0, Agra: 0 };
                                    departments.forEach(dept => {
                                        dept.kpiList?.forEach(kpi => {
                                            if (kpi.status === 'Critical' || kpi.status === 'Watchlist') {
                                                counts[getRegionForKPI(kpi.id)]++;
                                            }
                                        });
                                    });

                                    const chartData = [
                                        { name: 'Kashi', Alerts: counts.Kashi },
                                        { name: 'Triveni', Alerts: counts.Triveni },
                                        { name: 'Agra', Alerts: counts.Agra }
                                    ];

                                    return (
                                        <SmartChart data={chartData} hint="bar" />
                                    );
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Component 3: Feed */}
                    <div className="w-full h-[500px] relative bg-white rounded-3xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex flex-row justify-between items-center">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-black text-slate-800">Critical Alerts Feed</h3>
                                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">Top 10</span>
                            </div>
                            <div className="flex gap-2">
                                {['All', 'Kashi', 'Triveni', 'Agra'].map(region => (
                                    <button
                                        key={region}
                                        onClick={() => setFeedRegion(region)}
                                        className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${feedRegion === region ? 'bg-white text-blue-600 shadow-md border border-blue-100' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800'}`}
                                    >
                                        {region}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                            {(function () {
                                const severeKPIs = [];
                                departments.forEach(dept => {
                                    dept.kpiList?.forEach(kpi => {
                                        if (kpi.status === 'Critical' || kpi.status === 'Watchlist') {
                                            const region = getRegionForKPI(kpi.id);
                                            if (feedRegion === 'All' || feedRegion === region) {
                                                severeKPIs.push({ ...kpi, deptName: dept.name, region: region });
                                            }
                                        }
                                    });
                                });
                                // sort Critical first
                                severeKPIs.sort((a, b) => {
                                    if (a.status === 'Critical' && b.status !== 'Critical') return -1;
                                    if (a.status !== 'Critical' && b.status === 'Critical') return 1;
                                    return 0;
                                });

                                if (severeKPIs.length === 0) {
                                    return (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                                <Activity size={24} className="text-slate-300" />
                                            </div>
                                            <span className="text-base font-medium">No severe alerts in this region</span>
                                        </div>
                                    );
                                }

                                return severeKPIs.slice(0, 10).map((kpi, idx) => (
                                    <div key={idx}
                                        onClick={() => handleKPIClick(kpi, kpi.deptName)}
                                        className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md cursor-pointer transition-all group bg-white">
                                        <div className="flex flex-col gap-2 overflow-hidden">
                                            <span className="text-base font-black text-slate-800 truncate group-hover:text-blue-600 transition-colors">{kpi.kpiName}</span>
                                            <div className="flex gap-3 items-center">
                                                <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm ${kpi.status === 'Critical' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                                                    {kpi.status} Alert
                                                </span>
                                                <div className="h-4 w-px bg-slate-200"></div>
                                                <span className="text-xs text-slate-500 font-bold uppercase tracking-wide truncate flex gap-2">
                                                    <span className="text-slate-700">{kpi.region} Region</span> • {kpi.deptName}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="pl-4 flex items-center gap-6">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Value</span>
                                                <span className="text-xl font-black text-slate-900">{kpi.value}</span>
                                            </div>
                                            <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                <ArrowRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
