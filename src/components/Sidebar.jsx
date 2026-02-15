
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Radio, AlertTriangle, FileText, Activity, Database, TrendingUp, BookOpen, Layers } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { title: 'Executive Control Center', path: '/', icon: BarChart2 },
        { title: 'Department Performance', path: '/departments', icon: Layers },
        { title: 'Risk Overview', path: '/risk', icon: AlertTriangle },
        { title: 'Trends', path: '/trends', icon: TrendingUp },
        { title: 'Dashboard Gallery (Legacy)', path: '/gallery', icon: LayoutDashboard },
    ];

    return (
        <div className="w-64 bg-primary text-white h-screen flex flex-col fixed left-0 top-0 shadow-lg z-50">
            <div className="p-6 border-b border-white/10 flex items-center justify-center">
                <div className="bg-white py-2 px-4 rounded-lg shadow-sm">
                    <img src="https://www.gmrgroup.in/src/images/home/gmr-logo.png" alt="" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-white/10 text-white font-medium border-l-4 border-accentOrange'
                                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`
                                }
                            >
                                <item.icon size={20} />
                                <span className="text-sm">{item.title}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-4 border-t border-white/10 text-xs text-center text-gray-400">
                © 2026 KPI Showcase
            </div>
        </div>
    );
};

export default Sidebar;
