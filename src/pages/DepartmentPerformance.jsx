import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import SmartChart from '../components/charts/SmartChart';
import { executiveDummyData } from '../data/executiveDummyData';
import { findKPIOrigin } from '../utils/dashboardUtils';
import { ThumbsUp, AlertOctagon, Activity, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

const DepartmentPerformance = () => {
    const navigate = useNavigate();
    const { departments } = executiveDummyData;
    const [selectedDeptId, setSelectedDeptId] = useState(departments[0].id);

    const currentDept = departments.find(d => d.id === selectedDeptId) || departments[0];

    // Calculate Department Level Health Score
    // Logic: 100 - (critical * 5 + high * 2 + medium * 1)
    const deptHealthScore = Math.max(0, 100 - (
        (currentDept.issues.critical * 5) +
        (currentDept.issues.high * 2) +
        (currentDept.issues.medium * 1)
    ));

    const getHealthColor = (score) => {
        if (score > 85) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    // Prepare chart data for the selected department
    const issueData = [
        { name: 'Low Priority', value: currentDept.issues.low },
        { name: 'Medium Priority', value: currentDept.issues.medium },
        { name: 'High Priority', value: currentDept.issues.high },
        { name: 'Critical', value: currentDept.issues.critical },
    ];

    return (
        <DashboardLayout title="Department Performance" description="Detailed operational health and risk assessment per department.">

            {/* Department Selector Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                {departments.map((dept) => (
                    <button
                        key={dept.id}
                        onClick={() => setSelectedDeptId(dept.id)}
                        className={`px-6 py-3 rounded-lg text-sm font-bold transition-all ${selectedDeptId === dept.id
                            ? 'bg-primary text-white shadow-md transform scale-105'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                            }`}
                    >
                        {dept.name}
                    </button>
                ))}
            </div>

            {/* Department Header & Health Score */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className={`p-8 rounded-xl border flex flex-col justify-center items-center text-center shadow-sm ${getHealthColor(deptHealthScore)}`}>
                    <Activity size={48} className="opacity-50 mb-4" />
                    <h2 className="text-6xl font-extrabold tracking-tight mb-2">{deptHealthScore}%</h2>
                    <p className="text-sm font-bold uppercase tracking-widest opacity-80">Department Health Score</p>
                </div>

                <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-8 w-1 bg-primary rounded-full"></span>
                        <h3 className="text-xl font-bold text-gray-800">Executive Summary</h3>
                    </div>
                    <p className="text-xl text-gray-600 font-medium leading-relaxed">
                        "{currentDept.impactStatement}"
                    </p>
                    <div className="mt-6 flex gap-6">
                        <div className="flex items-center gap-2 text-gray-500">
                            <CheckCircle size={18} className="text-primary" />
                            <span className="font-semibold">{currentDept.kpis} KPIs Tracking</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                            <TrendingUp size={18} className="text-primary" />
                            <span className="font-semibold">6-Month Trend Available</span>
                        </div>
                    </div>
                    <div className="mt-8">
                        <button
                            onClick={() => navigate(`/departments/${selectedDeptId}`)}
                            className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-sm"
                        >
                            View Department Dashboards <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                {/* Left Column: KPI Stats & Needs Attention */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                        <h3 className="font-bold text-lg text-red-600 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                            <AlertOctagon className="text-red-500" size={24} />
                            Where Attention Is Required
                        </h3>
                        <ul className="space-y-4">
                            {currentDept.needsAttention.map((item, idx) => {
                                const origin = findKPIOrigin(item, currentDept.name);
                                const navPath = origin ? `/departments/${selectedDeptId}/dashboard/${origin.dashKey}/kpi/${encodeURIComponent(item)}` : null;

                                return (
                                    <li
                                        key={idx}
                                        onClick={() => navPath && navigate(navPath)}
                                        className={`flex items-start justify-between gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-400 group transition-all ${navPath ? 'cursor-pointer hover:bg-red-100/50 hover:shadow-sm' : ''}`}
                                    >
                                        <span className="text-gray-800 font-medium group-hover:text-red-700">{item}</span>
                                        {navPath && <ArrowRight size={14} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />}
                                    </li>
                                );
                            })}
                        </ul>

                        <h3 className="font-bold text-lg text-green-600 mt-8 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                            <ThumbsUp className="text-green-500" size={24} />
                            What's Working Well
                        </h3>
                        <ul className="space-y-4">
                            {currentDept.workingWell.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                                    <span className="text-gray-800 font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Charts */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg text-gray-800 mb-4">6-Month Performance Trend</h3>
                        <div className="h-[250px]">
                            <SmartChart data={currentDept.trend} hint="multi-area" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg text-gray-800 mb-4">Current Issue Distribution</h3>
                        <div className="h-[250px]">
                            <SmartChart data={issueData} hint="donut" />
                        </div>
                    </div>
                </div>

            </div>

        </DashboardLayout>
    );
};

export default DepartmentPerformance;
