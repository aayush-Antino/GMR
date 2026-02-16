import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import KPIDetailModal from '../components/KPIDetailModal';
import { dashboardData } from '../data/dashboardData';
import { executiveDummyData } from '../data/executiveDummyData';
import { dashboardMeta } from '../utils/dashboardUtils';
import { ChevronRight, ArrowLeft, Search, Activity, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const DeptSpecificDashboard = () => {
    const { deptId, dashKey } = useParams();
    const navigate = useNavigate();
    const [selectedKPI, setSelectedKPI] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Find Department
    const department = executiveDummyData.departments.find(d => d.id === deptId);

    // Get Dashboard Data
    const allItems = dashboardData[dashKey] || [];
    const meta = dashboardMeta[dashKey] || { title: 'Dashboard', description: '' };

    // Filter Items for this Department
    const filteredItems = allItems.filter(item =>
        item.department === department?.name &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!department) return (
        <div className="flex min-h-screen bg-lightBg font-sans">
            <Sidebar />
            <div className="flex-1 ml-64 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-400">Department Not Found</h2>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-lightBg font-sans">
            <Sidebar />
            <div className="flex-1 ml-64 relative overflow-y-auto overflow-x-hidden">

                {/* Hero Section */}
                <div className="bg-gradient-to-br from-primary to-blue-900 h-64 w-full relative overflow-hidden">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accentOrange/10 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl"></div>

                    <div className="max-w-7xl mx-auto px-8 flex flex-col justify-center h-full relative z-10">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 mb-4 text-sm text-blue-200/80">
                            <button onClick={() => navigate(`/departments/${deptId}`)} className="hover:text-white flex items-center gap-1 transition-colors">
                                <ArrowLeft size={16} /> Back to {department.name}
                            </button>
                            <ChevronRight size={14} className="opacity-50" />
                            <span className="font-medium text-white">{meta.title}</span>
                        </div>

                        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">
                            {meta.title}
                        </h1>
                        <p className="text-blue-100 max-w-2xl text-lg font-light">
                            {meta.description}
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-8 -mt-8 pb-16 relative z-20">

                    {/* Controls & Stats */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                        {/* Search Bar */}
                        <div className="relative w-full md:w-96 shadow-lg rounded-xl overflow-hidden group">
                            <div className="absolute inset-0 bg-white opacity-95 group-hover:opacity-100 transition-opacity"></div>
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder={`Search in ${meta.title}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-transparent relative z-10 focus:outline-none text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        {/* Quick Stat */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm">
                            <Activity size={16} />
                            <span>{filteredItems.length} KPIs Tracked</span>
                        </div>
                    </div>

                    {/* KPI Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((kpi, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedKPI(kpi)}
                                className={`bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-primary/20 hover:-translate-y-1 overflow-hidden relative ${kpi.status === 'Critical' ? 'border-l-4 border-l-accentRed' :
                                    kpi.status === 'Warning' ? 'border-l-4 border-l-accentOrange' :
                                        'border-l-4 border-l-emerald-500'
                                    }`}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 rounded-lg bg-gray-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                            <Activity size={24} />
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${kpi.status === 'Critical' ? 'bg-red-50 text-accentRed border border-red-100' :
                                            kpi.status === 'Warning' ? 'bg-orange-50 text-accentOrange border border-orange-100' :
                                                'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                            }`}>
                                            {kpi.status === 'Critical' && <AlertCircle size={12} />}
                                            {kpi.status === 'Warning' && <Clock size={12} />}
                                            {kpi.status === 'On Track' && <CheckCircle2 size={12} />}
                                            {kpi.status}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                        {kpi.name}
                                    </h3>

                                    <div className="text-sm text-gray-600 mb-6 line-clamp-3 min-h-[4.5rem] leading-relaxed">
                                        {kpi.description}
                                    </div>
                                </div>

                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center group-hover:bg-primary/5 transition-colors">
                                    <span className="text-xs font-semibold text-gray-400 group-hover:text-primary transition-colors">Real-time Analysis</span>
                                    <span className="text-sm font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Analyze <ChevronRight size={16} />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Search size={32} className="text-gray-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">No KPIs Found</h3>
                            <p className="text-gray-500 mt-1 max-w-sm">We couldn't find any KPIs matching "{searchTerm}" in this dashboard.</p>
                            <button
                                onClick={() => setSearchTerm('')}
                                className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>

                {/* Modal */}
                <KPIDetailModal
                    isOpen={!!selectedKPI}
                    onClose={() => setSelectedKPI(null)}
                    kpi={selectedKPI}
                />

            </div>
        </div>
    );
};

export default DeptSpecificDashboard;
