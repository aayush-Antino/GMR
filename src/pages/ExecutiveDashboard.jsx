import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import BarChartComponent from '../components/charts/BarChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';
import LineChartComponent from '../components/charts/LineChartComponent';
import { executiveDummyData } from '../data/executiveDummyData';
import { ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle, ShieldAlert, Activity } from 'lucide-react';

const ExecutiveDashboard = () => {
    const { summary, chartData, departments } = executiveDummyData;

    // Health Score Logic: 100 - (critical * 2 + high * 1)
    const calculatedHealthScore = Math.max(0, 100 - ((summary.critical * 2) + (summary.high * 1)));

    // Helper to get health score color
    const getHealthColor = (score) => {
        if (score > 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    // Generate Dynamic Insights
    const generateInsights = () => {
        const insights = [];

        // Critical Issue Insight
        if (summary.critical > 5) {
            insights.push({
                type: 'critical',
                text: "Immediate attention required due to elevated critical issues across departments."
            });
        }

        // Finance Insight
        const financeDept = departments.find(d => d.id === 'finance');
        // Check if finance has high issues (example logic: high + critical > 3)
        if (financeDept && (financeDept.issues.high + financeDept.issues.critical) > 3) {
            insights.push({
                type: 'warning',
                text: "Revenue exposure risk is increasing due to billing discrepancies."
            });
        }

        // Operational Insight
        const opsDept = departments.find(d => d.id === 'operation');
        if (opsDept && (opsDept.issues.high + opsDept.issues.critical) > 3) {
            insights.push({
                type: 'warning',
                text: "Operational stability impacted by rising field data collection delays."
            });
        }

        // Trend Insight
        const trend = chartData.performanceTrend;
        const lastMonth = trend[trend.length - 1].value;
        const prevMonth = trend[trend.length - 2].value;
        const monthBefore = trend[trend.length - 3].value;

        if (lastMonth < prevMonth && prevMonth < monthBefore) {
            insights.push({
                type: 'info',
                text: "Consistent downward trend in system health observed over last 3 months."
            });
        } else if (lastMonth > prevMonth) {
            insights.push({
                type: 'success',
                text: "Performance stability improving compared to previous months."
            });
        }

        return insights;
    };

    // Generate Recommended Actions
    const generateActions = () => {
        const actions = [];
        if (summary.critical > 0) actions.push("Prioritize resolution of critical incidents in Finance and Operations.");
        if (calculatedHealthScore < 60) actions.push("Conduct immediate operational performance review.");
        if (summary.high > 10) actions.push("Review high-risk departments for process optimization.");
        actions.push("Monitor finance-related alerts closely for next 48 hours.");
        return actions;
    };

    const insights = generateInsights();
    const actions = generateActions();

    return (
        <DashboardLayout title="Executive Summary" description="High-level business performance and risk overview.">

            {/* Top Section - KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                {/* HEADLINE METRIC: System Health Score */}
                <div className={`p-6 rounded-xl border flex flex-col justify-between shadow-sm col-span-1 md:col-span-2 ${getHealthColor(calculatedHealthScore)}`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-lg opacity-80 uppercase tracking-wide">Overall System Health Score</p>
                            <h2 className="text-6xl font-extrabold mt-2 tracking-tight">{calculatedHealthScore}%</h2>
                        </div>
                        <Activity size={64} className="opacity-20" />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        {calculatedHealthScore > 80 ? (
                            <span className="flex items-center gap-1 font-medium bg-white/40 px-3 py-1 rounded-full text-sm"><CheckCircle size={16} /> Optimal Performance</span>
                        ) : calculatedHealthScore >= 60 ? (
                            <span className="flex items-center gap-1 font-medium bg-white/40 px-3 py-1 rounded-full text-sm"><AlertCircle size={16} /> Needs Attention</span>
                        ) : (
                            <span className="flex items-center gap-1 font-medium bg-white/40 px-3 py-1 rounded-full text-sm"><ShieldAlert size={16} /> Critical Condition</span>
                        )}
                    </div>
                </div>

                <SummaryCard
                    label="Total Issues Identified"
                    value={summary.totalIssues}
                    subValue={`${summary.critical} Critical`}
                    colorClass="text-accentOrange bg-orange-50 border-orange-100"
                    icon={<AlertCircle size={24} />}
                />

                <SummaryCard
                    label="Total KPIs Monitored"
                    value={summary.totalKPIs}
                    subValue={`${summary.departments} Departments`}
                    colorClass="text-blue-600 bg-blue-50 border-blue-100"
                    icon={<CheckCircle size={24} />}
                />
            </div>

            {/* Middle Section - Business Risk Overview */}
            <h3 className="text-xl font-bold text-gray-800 mb-4 pl-1 border-l-4 border-primary">Business Risk Overview</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                <ChartCard title="Where Attention Is Required">
                    <p className="text-xs text-gray-400 mb-2">Issue count by department</p>
                    <BarChartComponent data={chartData.issuesByDept} />
                </ChartCard>
                <ChartCard title="Issue Severity Distribution">
                    <p className="text-xs text-gray-400 mb-2">Breakdown of identified risks</p>
                    <PieChartComponent data={chartData.severityDistribution} />
                </ChartCard>
                <ChartCard title="Monthly Performance Trend">
                    <p className="text-xs text-gray-400 mb-2">6-Month Health Score History</p>
                    <LineChartComponent data={chartData.performanceTrend} />
                </ChartCard>
            </div>

            {/* Bottom Section - Executive Insights & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Executive Insights */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                            Executive Insights
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {insights.map((insight, index) => (
                            <div key={index} className={`flex items-start gap-4 p-4 rounded-xl border-l-4 shadow-sm ${insight.type === 'critical' ? 'bg-red-50 border-l-red-500 border-y border-r border-gray-100 text-red-900' :
                                    insight.type === 'warning' ? 'bg-orange-50 border-l-orange-500 border-y border-r border-gray-100 text-orange-900' :
                                        insight.type === 'success' ? 'bg-green-50 border-l-green-500 border-y border-r border-gray-100 text-green-900' :
                                            'bg-blue-50 border-l-blue-500 border-y border-r border-gray-100 text-blue-900'
                                }`}>
                                <div className="mt-1 flex-shrink-0">
                                    {insight.type === 'critical' && <ShieldAlert size={20} className="text-red-600" />}
                                    {insight.type === 'warning' && <AlertCircle size={20} className="text-orange-600" />}
                                    {insight.type === 'success' && <ArrowUpRight size={20} className="text-green-600" />}
                                    {insight.type === 'info' && <Activity size={20} className="text-blue-600" />}
                                </div>
                                <div>
                                    <p className="font-medium text-base leading-relaxed">{insight.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommended Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                            Recommended Actions
                        </h3>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-0">
                            {actions.map((action, index) => (
                                <li key={index} className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <p className="text-gray-700 font-medium">{action}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>

        </DashboardLayout>
    );
};

const SummaryCard = ({ label, value, subValue, colorClass, icon }) => (
    <div className={`bg-white p-6 rounded-xl border flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow ${colorClass}`}>
        <div className="flex justify-between items-start mb-2">
            <p className="text-gray-600 text-sm font-bold uppercase tracking-wide">{label}</p>
            {icon && <span className="opacity-70">{icon}</span>}
        </div>
        <div>
            <h4 className="text-4xl font-extrabold text-gray-800">{value}</h4>
            {subValue && (
                <span className="text-sm font-semibold opacity-70 mt-1 block">{subValue}</span>
            )}
        </div>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full hover:shadow-md transition-shadow">
        <h3 className="font-bold text-lg text-gray-800 mb-4">{title}</h3>
        <div className="h-[280px] w-full">
            {children}
        </div>
    </div>
);

export default ExecutiveDashboard;
