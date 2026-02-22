import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { executiveDummyData } from '../data/executiveDummyData';
import { findKPIOrigin } from '../utils/dashboardUtils';
import { Activity, AlertTriangle, TrendingUp, CheckCircle, ArrowRight, ShieldAlert, DollarSign, Database, Server, Clock, Zap, Wifi, Layers, Shield, Box, Crosshair, Network } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

const Home = () => {
    const navigate = useNavigate();
    const { departments } = executiveDummyData;

    // Helper to extract a specific KPI by its exact name across all departments
    const getKPI = (nameToFind) => {
        for (let dept of departments) {
            if (dept.kpiList) {
                const found = dept.kpiList.find(k => k.kpiName === nameToFind);
                if (found) return { ...found, dept: dept.name, deptId: dept.id };
            }
        }
        return { value: 'N/A', status: 'Unknown', kpiName: nameToFind, dept: 'System' };
    };

    // Helper to get array of all Security/Tamper alerts ignoring priority
    const getAllSecurityAlerts = () => {
        let alerts = [];
        departments.forEach(dept => {
            if (dept.kpiList) {
                const threats = dept.kpiList.filter(k =>
                    k.kpiName.toLowerCase().includes('tamper') ||
                    k.kpiName.toLowerCase().includes('theft') ||
                    k.kpiName.toLowerCase().includes('anomaly')
                ).map(k => ({ ...k, dept: dept.name, deptId: dept.id }));
                alerts = [...alerts, ...threats];
            }
        });
        return alerts;
    };

    // Metric Extraction for Category Nodes
    // Node 1: Finance & Energy Accounting
    const atcLoss = getKPI('AT&C Loss (%)');
    const billingEff = getKPI('Billing Efficiency (%)');
    const collectEff = getKPI('Collection Efficiency (%)');

    // Node 2: Grid Operations (Reliability)
    const saidi = getKPI('SAIDI');
    const saifi = getKPI('SAIFI');
    const voltageDev = getKPI('Voltage Deviation Index (VDI)');

    // Node 3: Security & Intelligence (Anomalies)
    const allSecurityNodes = useMemo(() => getAllSecurityAlerts(), []);
    const securityCount = allSecurityNodes.length;
    const coverOpen = getKPI('Number of Tamper Alerts (Cover Open)');
    const theftDiversion = getKPI('Theft / Load diversion');

    // Node 4: Network Asset Tracking
    const overloadedFeeders = getKPI('Top Overloaded DTs / Feeders');
    const dtPeakLoading = getKPI('% DT Peak Loading');
    const dtFailure = getKPI('DT Failure Rate (%)');

    const handleKPIClick = (kpi) => {
        if (!kpi.deptId) return;
        const origin = findKPIOrigin(kpi.kpiName, kpi.dept);
        if (origin) {
            navigate(`/dashboard/${origin.dashKey}/kpi/${encodeURIComponent(kpi.kpiName)}`);
        } else {
            console.warn('Origin not found for KPI:', kpi.kpiName);
        }
    };

    // Charts Dummy Data
    const efficiencyData = [
        { name: 'Q1', Billing: 85, Collection: 88, Loss: 15 },
        { name: 'Q2', Billing: 82, Collection: 85, Loss: 18 },
        { name: 'Q3', Billing: 88, Collection: 89, Loss: 12 },
        { name: 'Q4', Billing: parseInt(billingEff.value) || 82, Collection: parseInt(collectEff.value) || 90, Loss: parseInt(atcLoss.value) || 10 },
    ];

    const reliabilityData = [
        { name: 'W1', SAIDI: 45, SAIFI: 12 },
        { name: 'W2', SAIDI: 50, SAIFI: 15 },
        { name: 'W3', SAIDI: 35, SAIFI: 8 },
        { name: 'W4', SAIDI: 42, SAIFI: 10 },
        { name: 'W5', SAIDI: parseInt(saidi.value) || 40, SAIFI: parseInt(saifi.value) || 11 },
    ];

    const anomalyData = [
        { name: 'North', size: 120 }, { name: 'South', size: 85 }, { name: 'East', size: 210 }, { name: 'West', size: 60 }
    ];

    return (
        <div className="min-h-screen font-sans bg-slate-50 text-slate-700 selection:bg-primary/20 pb-20">
            <Topbar />

            <div className="pt-24 px-4 md:px-8 max-w-[1600px] mx-auto">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Telemetry Matrix</h1>
                        <p className="text-slate-500 text-lg mt-1 font-medium">Categorical aggregate of 105 active grid parameters.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-5 py-2 rounded-lg bg-white border border-slate-200 shadow-sm text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                            Matrix Settings
                        </button>
                    </div>
                </div>

                {/* The 4-Node Grid Matrix */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                    {/* NODE 1: Financial & Energy Accounting */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><DollarSign size={24} /></div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Finance & Accounting</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">19 Active KPIs</p>
                                </div>
                            </div>
                            <button onClick={() => navigate('/dashboard/dashboard1')} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                                Open Hub <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <NodeStat kpi={atcLoss} label="Energy Accounting" onClick={() => handleKPIClick(atcLoss)} />
                            <NodeStat kpi={billingEff} label="Billing Eff." onClick={() => handleKPIClick(billingEff)} />
                        </div>

                        <div className="h-40 w-full mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={efficiencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={5} />
                                    <Tooltip cursor={{ fill: 'rgba(226, 232, 240, 0.5)' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} />
                                    <Bar dataKey="Billing" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
                                    <Bar dataKey="Collection" fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={16} />
                                    <Bar dataKey="Loss" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={16} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* NODE 2: Grid Operations (Reliability) */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Server size={24} /></div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Grid Reliability Ops</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">31 Active KPIs</p>
                                </div>
                            </div>
                            <button onClick={() => navigate('/dashboard/dashboard4')} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
                                Open Hub <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <NodeStat kpi={saidi} label="System SAIDI" onClick={() => handleKPIClick(saidi)} />
                            <NodeStat kpi={saifi} label="System SAIFI" onClick={() => handleKPIClick(saifi)} />
                        </div>

                        <div className="h-40 w-full mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-100 relative overflow-hidden">
                            <span className="absolute top-4 left-4 text-[10px] font-black tracking-widest uppercase text-slate-400">Reliability Trend</span>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={reliabilityData} margin={{ top: 30, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={5} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                    <Line type="monotone" dataKey="SAIDI" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="SAIFI" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* NODE 3: Security & Anomaly Center */}
                    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Layers size={150} className="text-white" /></div>

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-orange-500/20 text-orange-400 rounded-xl"><Shield size={24} /></div>
                                <div>
                                    <h2 className="text-xl font-black text-white tracking-tight">Security & Analytics</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">30 Active KPIs</p>
                                </div>
                            </div>
                            <button onClick={() => navigate('/dashboard/dashboard7')} className="text-sm font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors">
                                Access Core <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 relative z-10">
                            <div className="col-span-1 md:col-span-1 bg-slate-800/80 rounded-2xl p-5 border border-slate-700/50 flex flex-col justify-center items-center">
                                <span className="text-5xl font-black text-orange-500">{securityCount}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2 text-center">Total Monitored Nodes</span>
                            </div>
                            <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                                <NodeStatDark kpi={coverOpen} onClick={() => handleKPIClick(coverOpen)} />
                                <NodeStatDark kpi={theftDiversion} onClick={() => handleKPIClick(theftDiversion)} />
                            </div>
                        </div>

                        {/* Heatmap Micro-viz */}
                        <div className="mt-4 flex gap-2 h-16 w-full relative z-10">
                            {anomalyData.map((d, i) => (
                                <div key={i} className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-2 flex flex-col justify-end relative overflow-hidden group/bar">
                                    <div className="absolute bottom-0 left-0 w-full bg-orange-500/20 group-hover/bar:bg-orange-500/40 transition-colors" style={{ height: `${(d.size / 250) * 100}%` }}>
                                        <div className="w-full h-0.5 bg-orange-500 absolute top-0"></div>
                                    </div>
                                    <div className="relative z-10 w-full flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.name}</span>
                                        <span className="text-[10px] font-black text-white">{d.size}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* NODE 4: Network Asset Tracking */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Network size={24} /></div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Asset Management</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">25 Active KPIs</p>
                                </div>
                            </div>
                            <button onClick={() => navigate('/dashboard/dashboard10')} className="text-sm font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 transition-colors">
                                Open Hub <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <NodeStat kpi={dtPeakLoading} label="DT Diagnostics" onClick={() => handleKPIClick(dtPeakLoading)} />
                            <NodeStat kpi={dtFailure} label="Failure Tracking" onClick={() => handleKPIClick(dtFailure)} />
                        </div>

                        <div className="mt-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Box size={14} /> Asset Saturation Watchlist</span>
                            </div>
                            <div
                                onClick={() => handleKPIClick(overloadedFeeders)}
                                className="w-full flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-slate-800">{overloadedFeeders.kpiName}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Automated Topology Map</span>
                                </div>
                                <span className="text-lg font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">{overloadedFeeders.value}</span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

// Extracted UI Component for Light KPIs
const NodeStat = ({ kpi, label, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-32"
        >
            <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
                <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${kpi.status === 'Critical' ? 'bg-red-50 text-red-600' : kpi.status === 'Watchlist' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                    {kpi.status}
                </span>
            </div>
            <div>
                <h3 className="text-2xl font-black text-slate-800 mb-1 group-hover:text-primary transition-colors">{kpi.value}</h3>
                <p className="text-xs font-bold text-slate-500 line-clamp-1 truncate">{kpi.kpiName}</p>
            </div>
        </div>
    );
};

// Extracted UI Component for Dark (Security) KPIs
const NodeStatDark = ({ kpi, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/80 hover:border-orange-500/50 hover:bg-slate-800 transition-all cursor-pointer group flex flex-col justify-between h-full"
        >
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 line-clamp-2">{kpi.kpiName}</span>
            <div className="flex items-end justify-between mt-auto">
                <h3 className="text-2xl font-black text-slate-200 group-hover:text-white transition-colors">{kpi.value}</h3>
                <ArrowRight size={16} className="text-slate-600 group-hover:text-orange-500 transition-colors" />
            </div>
        </div>
    );
};

export default Home;
