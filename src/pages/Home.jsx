import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { executiveDummyData } from '../data/executiveDummyData';
import { Activity, AlertTriangle, TrendingUp, CheckCircle, ArrowRight, ShieldAlert, DollarSign, Database, Server } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Home = () => {
    const navigate = useNavigate();
    const { summary, businessAreas, departments } = executiveDummyData;

    // Calculate Health Score
    // Weighted deduction: Critical=100%, High=20% weight relative to total KPIs
    const weightedDefects = (summary.critical * 1.0) + (summary.high * 0.2);
    const defectPercentage = (weightedDefects / summary.totalKPIs) * 100;
    const calculatedHealthScore = Math.max(0, Math.round(100 - defectPercentage));

    // Determine Status
    const healthStatus = calculatedHealthScore > 80 ? "Healthy" : calculatedHealthScore >= 60 ? "Needs Attention" : "Critical Risk";
    const healthColor = calculatedHealthScore > 80 ? "text-green-500" : calculatedHealthScore >= 60 ? "text-yellow-500" : "text-red-500";
    const healthBg = calculatedHealthScore > 80 ? "bg-green-50 border-green-200" : calculatedHealthScore >= 60 ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200";

    // Circular Chart Data
    const healthChartData = [
        { name: 'Score', value: calculatedHealthScore },
        { name: 'Remaining', value: 100 - calculatedHealthScore }
    ];
    const CHART_COLORS = [calculatedHealthScore > 80 ? '#22c55e' : calculatedHealthScore >= 60 ? '#eab308' : '#ef4444', '#f3f4f6'];

    // AGGREGATE INSIGHTS FROM REAL DATA
    // 1. Collect all critical/high KPIs across departments
    const getAllCriticalKPIs = () => {
        let criticals = [];
        departments.forEach(dept => {
            if (dept.kpiList) {
                const depCriticals = dept.kpiList.filter(k => k.status === 'Critical').map(k => ({ ...k, dept: dept.name }));
                criticals = [...criticals, ...depCriticals];
            }
        });
        return criticals;
    };

    const criticalKPIs = getAllCriticalKPIs();

    // 2. Generate Insights based on specific KPIs
    const generateInsights = () => {
        const insights = [
            {
                text: `System Health is ${healthStatus} (${calculatedHealthScore}%) with ${summary.critical} critical metrics.`,
                type: calculatedHealthScore < 60 ? "critical" : "warning"
            }
        ];

        // Add specific KPI insights
        criticalKPIs.slice(0, 3).forEach(kpi => {
            insights.push({
                text: `${kpi.kpiName} in ${kpi.dept} is Critical (${kpi.value}).`,
                type: "critical"
            });
        });

        if (insights.length < 4) {
            if (businessAreas.finance.issues > 5) insights.push({ text: "Finance department shows elevated risk levels.", type: "warning" });
            if (businessAreas.operation.health < 70) insights.push({ text: "Operational stability below target.", type: "warning" });
        }
        return insights;
    };

    // 3. Generate Actions based on specific KPIs
    const generateActions = () => {
        const actions = criticalKPIs.slice(0, 4).map(kpi =>
            `Investigate root cause for ${kpi.kpiName} (${kpi.dept}).`
        );

        // Fallback actions if few criticals
        if (actions.length < 4) {
            actions.push("Review operational expenditure reports.");
            actions.push("Conduct weekly system maintenance check.");
            actions.push("Analyze recent data mapping anomalies.");
        }
        return actions;
    };

    const insights = generateInsights();
    const actions = generateActions();

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 ml-64 p-8 overflow-y-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Executive Control Center</h1>
                    <p className="text-gray-500 text-lg mt-1">High-level performance and risk visibility across the smart metering ecosystem.</p>
                </div>

                {/* Section 1: Overall System Health (Hero) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center relative z-10">
                        {/* Health Score */}
                        <div className="flex flex-col items-center justify-center border-r border-gray-100 pr-8">
                            <div className="relative w-48 h-48 min-w-[12rem] min-h-[12rem]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={healthChartData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            startAngle={90}
                                            endAngle={-270}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {healthChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-5xl font-extrabold ${healthColor}`}>{calculatedHealthScore}%</span>
                                    <span className="text-xs uppercase font-bold text-gray-400 mt-1 tracking-wider">Health Score</span>
                                </div>
                            </div>
                            <div className={`mt-4 px-4 py-1.5 rounded-full text-sm font-bold border ${healthBg} ${healthColor}`}>
                                {healthStatus}
                            </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-6">
                            <MetricBlock label="Total KPIs" value={summary.totalKPIs} icon={<CheckCircle size={20} className="text-blue-500" />} />
                            <MetricBlock label="Total Issues" value={summary.totalIssues} icon={<AlertTriangle size={20} className="text-orange-500" />} />
                            <MetricBlock label="Critical Issues" value={summary.critical} icon={<ShieldAlert size={20} className="text-red-500" />} />
                            <MetricBlock label="Impacted Depts" value={summary.departments} icon={<Server size={20} className="text-gray-500" />} />
                        </div>
                    </div>
                </div>

                {/* Section 2: Business Focus Areas */}
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    Business Focus Areas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    {/* Operational Stability */}
                    <FocusCard
                        title="Operational Stability"
                        score={businessAreas.operation.health}
                        issueCount={businessAreas.operation.issues}
                        summary={businessAreas.operation.summary}
                        onClick={() => navigate(businessAreas.operation.link)}
                        icon={<Activity size={24} className="text-blue-600" />}
                        colorClass="text-blue-600"
                    />

                    {/* Financial Risk */}
                    <FocusCard
                        title="Financial Risk"
                        score={businessAreas.finance.health}
                        issueCount={businessAreas.finance.issues}
                        summary={businessAreas.finance.summary}
                        onClick={() => navigate(businessAreas.finance.link)}
                        icon={<DollarSign size={24} className="text-orange-600" />}
                        colorClass="text-orange-600"
                        isRisk={true}
                    />

                    {/* Data Reliability */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Database size={24} /></div>
                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Stable</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-1">Data Reliability</h3>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-3xl font-extrabold text-gray-900">{businessAreas.advancedAnalytics.health}%</span>
                            <span className="text-sm text-gray-500">Completeness</span>
                        </div>
                        <p className="text-gray-500 text-sm mb-4 min-h-[40px]">{businessAreas.advancedAnalytics.summary}</p>
                        <button onClick={() => navigate('/risk')} className="text-purple-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            View Details <ArrowRight size={14} />
                        </button>
                    </div>

                    {/* Performance Trend */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-gray-50 rounded-lg text-gray-600"><TrendingUp size={24} /></div>
                            <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Monitoring</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-1">Performance Trend</h3>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-3xl font-extrabold text-gray-900">Rising</span>
                            <TrendingUp className="text-red-500" size={24} />
                        </div>
                        <p className="text-gray-500 text-sm mb-4 min-h-[40px]">{businessAreas.performanceTrend.summary}</p>
                        <button onClick={() => navigate('/trends')} className="text-gray-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            View Details <ArrowRight size={14} />
                        </button>
                    </div>
                </div>

                {/* Section 3 & 4: Insights and Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Executive Insights */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                            <Activity className="text-primary" size={20} />
                            Executive Insights
                        </h3>
                        <div className="space-y-3">
                            {insights.map((insight, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <span className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${insight.type === 'critical' ? 'bg-red-500' :
                                        insight.type === 'warning' ? 'bg-orange-500' : 'bg-green-500'
                                        }`}></span>
                                    <p className="text-gray-700 font-medium text-sm leading-relaxed">{insight.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommended Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                            <CheckCircle className="text-green-600" size={20} />
                            Recommended Actions
                        </h3>
                        <ul className="space-y-0">
                            {actions.map((action, idx) => (
                                <li key={idx} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded transition-colors">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 font-bold text-xs ring-2 ring-white">
                                        {idx + 1}
                                    </span>
                                    <p className="text-gray-700 font-medium text-sm">{action}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

            </div>
        </div>
    );
};

const MetricBlock = ({ label, value, icon }) => (
    <div className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="flex items-center gap-2 mb-2 opacity-70">
            {icon}
            <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        </div>
        <span className="text-2xl font-extrabold text-gray-900">{value}</span>
    </div>
);

const FocusCard = ({ title, score, issueCount, summary, onClick, icon, colorClass, isRisk }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg bg-gray-50 ${colorClass}`}>{icon}</div>
            <span className={`text-xs font-bold px-2 py-1 rounded ${score < 70 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {score}% Health
            </span>
        </div>
        <h3 className="font-bold text-lg text-gray-800 mb-1">{title}</h3>
        <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl font-extrabold text-gray-900">{issueCount}</span>
            <span className="text-sm text-gray-500 font-medium">Active Issues</span>
        </div>
        <p className="text-gray-500 text-sm mb-4 min-h-[40px]">{summary}</p>
        <button onClick={onClick} className={`${colorClass} text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all`}>
            View Details <ArrowRight size={14} />
        </button>
    </div>
);

export default Home;
