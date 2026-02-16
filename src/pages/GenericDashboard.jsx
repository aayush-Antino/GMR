
import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import BarChartComponent from '../components/charts/BarChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';
import LineChartComponent from '../components/charts/LineChartComponent';
import { dashboardData } from '../data/dashboardData';

const GenericDashboard = ({ title, description, dataKey = 'dashboard1' }) => {
    // Safe access to data with fallback
    const currentSummary = dashboardData.summary[dataKey] || dashboardData.summary.dashboard1;
    const currentChartData = dashboardData.chartData[dataKey] || dashboardData.chartData.dashboard1;
    const tableData = dashboardData[dataKey] || dashboardData.dashboard1;

    // Use currentSummary instead of summary
    const summary = currentSummary;
    // Use currentChartData instead of chartData
    const chartData = currentChartData;


    return (
        <DashboardLayout title={title} description={description}>

            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <SummaryCard label="Total KPIs" value={summary.totalKPIs} change="+12%" />
                <SummaryCard label="Anomalies Detected" value={summary.totalAnomalies} change="+2" isNegative />
                <SummaryCard label="Critical Priority" value={summary.highPriority} change="-3" />
                <SummaryCard label="Stable Metrics" value={Math.floor(summary.totalKPIs * 0.4)} change="+5" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                <ChartCard title="KPIs by Department">
                    <BarChartComponent data={chartData.bar} />
                </ChartCard>
                <ChartCard title="Feasibility Status">
                    <PieChartComponent data={chartData.pie} />
                </ChartCard>
                <ChartCard title="Performance Trends">
                    <LineChartComponent data={chartData.line} />
                </ChartCard>
            </div>

            {/* Data Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-primary">Detailed KPI Report</h3>
                    <button className="text-sm text-primary font-medium hover:underline">Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">KPI Name</th>
                                <th className="p-4 font-medium">Department</th>
                                <th className="p-4 font-medium">Description</th>
                                <th className="p-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tableData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-textDark">{row.name}</td>
                                    <td className="p-4 text-gray-600">{row.department}</td>
                                    <td className="p-4 text-gray-600 text-sm max-w-md">
                                        <p className="truncate hover:whitespace-normal transition-all duration-300" title={row.description}>
                                            {row.description}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.status === 'Critical' ? 'text-accentRed bg-red-50' : row.status === 'Warning' ? 'text-accentOrange bg-orange-50' : 'text-green-600 bg-green-50'}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

const SummaryCard = ({ label, value, change, isNegative }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
        <div className="flex items-end justify-between">
            <h4 className="text-3xl font-bold text-primary">{value}</h4>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${isNegative ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
                {change}
            </span>
        </div>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg text-primary mb-6">{title}</h3>
        {children}
    </div>
);

export default GenericDashboard;
