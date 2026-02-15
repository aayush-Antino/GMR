
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Radio, AlertTriangle, FileText, Activity, Database, TrendingUp, BookOpen, Layers } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const DashboardGallery = () => {
    const navigate = useNavigate();

    const dashboards = [
        { title: 'Dashboard 1', description: 'Executive Overview', path: '/dashboard1', icon: BarChart2 },
        { title: 'Dashboard 2', description: 'Department KPIs', path: '/dashboard2', icon: Layers },
        { title: 'Dashboard 3', description: 'Anomaly Monitoring', path: '/dashboard3', icon: AlertTriangle },
        { title: 'Dashboard 4', description: 'Data Gap Analysis', path: '/dashboard4', icon: Database },
        { title: 'Dashboard 5', description: 'Feasibility Tracking', path: '/dashboard5', icon: Activity },
        { title: 'Dashboard 6', description: 'Priority Analysis', path: '/dashboard6', icon: Radio },
        { title: 'Dashboard 7', description: 'Source System Dependency', path: '/dashboard7', icon: FileText },
        { title: 'Dashboard 8', description: 'Performance Trends', path: '/dashboard8', icon: TrendingUp },
        { title: 'Dashboard 9', description: 'KPI Dictionary', path: '/dashboard9', icon: BookOpen },
    ];

    return (
        <div className="flex min-h-screen bg-lightBg font-sans">
            <Sidebar />
            <div className="flex-1 ml-64 relative overflow-y-auto overflow-x-hidden">

                {/* Hero Section */}
                <div className="bg-gradient-to-br from-primary to-blue-900 h-96 w-full relative overflow-hidden">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accentOrange/10 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl"></div>

                    <div className="max-w-7xl mx-auto p-12 pt-20 relative z-10 text-center">
                        <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-sm">
                            Dashboard Gallery
                        </h1>
                        <p className="text-blue-100 max-w-3xl mx-auto text-xl font-light leading-relaxed">
                            Legacy technical dashboards for detailed monitoring and engineering analysis.
                        </p>
                    </div>
                </div>

                {/* Overlapping Content Section */}
                <div className="max-w-7xl mx-auto px-8 -mt-24 pb-16 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {dashboards.map((dash, index) => {
                            const colorCycle = index % 3;
                            const borderColor = colorCycle === 0 ? 'border-primary' : colorCycle === 1 ? 'border-accentOrange' : 'border-accentRed';
                            const iconColor = colorCycle === 0 ? 'text-primary' : colorCycle === 1 ? 'text-accentOrange' : 'text-accentRed';
                            const badgeBg = colorCycle === 0 ? 'bg-blue-50' : colorCycle === 1 ? 'bg-orange-50' : 'bg-red-50';

                            return (
                                <div
                                    key={index}
                                    onClick={() => navigate(dash.path)}
                                    className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden border-t-4 hover:-translate-y-2"
                                    style={{ borderColor: colorCycle === 0 ? '#0B3C6D' : colorCycle === 1 ? '#F4A300' : '#E31E24' }}
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                        <dash.icon size={120} />
                                    </div>

                                    <div className="p-8 relative z-10">
                                        <div className={`w-14 h-14 rounded-xl ${badgeBg} ${iconColor} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                            <dash.icon size={32} />
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors">
                                            {dash.title}
                                        </h3>

                                        <p className="text-gray-500 mb-8 leading-relaxed h-12">
                                            {dash.description}
                                        </p>

                                        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                                            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Live Data</span>
                                            <button className={`font-semibold flex items-center gap-2 transition-all ${iconColor} group-hover:gap-3`}>
                                                Explore <span className="text-lg">→</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardGallery;
