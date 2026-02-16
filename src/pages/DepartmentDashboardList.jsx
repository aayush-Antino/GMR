import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { executiveDummyData } from '../data/executiveDummyData';
import { getDashboardsForDepartment } from '../utils/dashboardUtils';
import { LayoutDashboard, ArrowRight } from 'lucide-react';

const DepartmentDashboardList = () => {
    const { deptId } = useParams();
    const navigate = useNavigate();

    // Find the department object
    const department = executiveDummyData.departments.find(d => d.id === deptId);

    if (!department) {
        return (
            <div className="flex min-h-screen bg-lightBg font-sans">
                <Sidebar />
                <div className="flex-1 ml-64 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-400">Department Not Found</h2>
                        <p className="text-gray-500 mt-2">Please select a valid department.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Get available dashboards for this department
    const availableDashboards = getDashboardsForDepartment(department.name);

    return (
        <div className="flex min-h-screen bg-lightBg font-sans">
            <Sidebar />
            <div className="flex-1 ml-64 relative overflow-y-auto overflow-x-hidden">

                {/* Hero Section */}
                <div className="bg-gradient-to-br from-primary to-blue-900 h-80 w-full relative overflow-hidden">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accentOrange/10 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl"></div>

                    <div className="max-w-7xl mx-auto px-8 flex flex-col justify-center h-full pb-16 relative z-10 text-center">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
                            {department.name} Dashboards
                        </h1>
                        <p className="text-blue-100 max-w-3xl mx-auto text-xl font-light leading-relaxed">
                            Overview of performance indicators and strategic metrics for {department.name}.
                        </p>
                    </div>
                </div>

                {/* Overlapping Content Section */}
                <div className="max-w-7xl mx-auto px-8 -mt-24 pb-16 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {availableDashboards.length > 0 ? (
                            availableDashboards.map((dash, index) => {
                                const colorCycle = index % 3;
                                const borderColor = colorCycle === 0 ? 'border-primary' : colorCycle === 1 ? 'border-accentOrange' : 'border-accentRed';
                                const iconColor = colorCycle === 0 ? 'text-primary' : colorCycle === 1 ? 'text-accentOrange' : 'text-accentRed';
                                const badgeBg = colorCycle === 0 ? 'bg-blue-50' : colorCycle === 1 ? 'bg-orange-50' : 'bg-red-50';

                                return (
                                    <div
                                        key={dash.key}
                                        onClick={() => navigate(`/departments/${deptId}/dashboard/${dash.key}`)}
                                        className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden border-t-4 hover:-translate-y-2"
                                        style={{ borderColor: colorCycle === 0 ? '#0B3C6D' : colorCycle === 1 ? '#F4A300' : '#E31E24' }}
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                            <LayoutDashboard size={120} />
                                        </div>

                                        <div className="p-8 relative z-10">
                                            <div className={`w-14 h-14 rounded-xl ${badgeBg} ${iconColor} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                                <LayoutDashboard size={32} />
                                            </div>

                                            <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors">
                                                {dash.title}
                                            </h3>

                                            <p className="text-gray-500 mb-8 leading-relaxed h-12 line-clamp-2">
                                                {dash.description}
                                            </p>

                                            <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                                                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Live Data</span>
                                                <button className={`font-semibold flex items-center gap-2 transition-all ${iconColor} group-hover:gap-3`}>
                                                    View Details <span className="text-lg">→</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <p className="text-gray-500 text-lg">No specific dashboards found for this department.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DepartmentDashboardList;
