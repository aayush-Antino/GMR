import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    BarChart2,
    AlertTriangle,
    TrendingUp,
    Layers,
    ChevronDown,
    ChevronRight,
    User,
    Settings,
    Activity,
    ShieldCheck,
    LogOut
} from 'lucide-react';
import { executiveDummyData } from '../data/executiveDummyData';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isDeptOpen, setIsDeptOpen] = useState(true);

    const menuItems = [
        // { title: 'Executive Control Center', path: '/', icon: BarChart2 },
    ];

    const departmentItems = executiveDummyData.departments.map(dept => ({
        title: dept.name,
        path: `/departments/${dept.id}`,
        icon: ChevronRight
    }));

    const otherItems = [
        // { title: 'Risk Overview', path: '/risk', icon: AlertTriangle },
        // { title: 'Trends', path: '/trends', icon: TrendingUp },
        // { title: 'Dashboard Gallery (Legacy)', path: '/gallery', icon: LayoutDashboard },
    ];

    return (
        <div className="w-64 bg-primary text-white h-screen flex flex-col fixed left-0 top-0 shadow-lg z-50 transition-all duration-300">
            {/* Logo Section */}
            <div className="p-6 border-b border-white/10 flex items-center justify-center bg-black/10">
                <div className="bg-white py-2 px-4 rounded-lg shadow-sm w-full flex justify-center">
                    <img src="https://www.gmrgroup.in/src/images/home/gmr-logo.png" alt="GMR Logo" className="h-8 object-contain" />
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
                <div className="px-3 space-y-6">

                    {/* Main Menu */}
                    <div>
                        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Navigation</p>
                        <ul className="space-y-1">
                            {/* Department Performance Accordion */}
                            <li>
                                <button
                                    onClick={() => setIsDeptOpen(!isDeptOpen)}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Layers size={20} className="group-hover:text-accentOrange transition-colors" />
                                        <span className="text-sm font-medium">Departments</span>
                                    </div>
                                    {isDeptOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>

                                {isDeptOpen && (
                                    <ul className="mt-2 ml-6 space-y-1 border-l-2 border-white/10 pl-2">
                                        {departmentItems.map((dept) => (
                                            <li key={dept.path}>
                                                <NavLink
                                                    to={dept.path}
                                                    className={({ isActive }) =>
                                                        `group flex items-center gap-3 px-3 py-2.5 rounded-r-lg text-sm transition-all duration-300 relative overflow-hidden ${isActive
                                                            ? 'bg-gradient-to-r from-accentOrange/10 to-transparent text-accentOrange font-medium border-l-2 border-accentOrange'
                                                            : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent hover:border-white/30'
                                                        }`
                                                    }
                                                >
                                                    {({ isActive }) => (
                                                        <>
                                                            <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-accentOrange transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-50 group-hover:scale-75'
                                                                }`}></span>

                                                            <span className="relative z-10 flex-1 truncate">{dept.title}</span>

                                                            <ChevronRight
                                                                size={14}
                                                                className={`transition-transform duration-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 text-white/50`}
                                                            />
                                                        </>
                                                    )}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </div>


                </div>
            </div>

            {/* User Profile Section (Fixed at Bottom) */}
            <div className="p-4 border-t border-white/10 bg-black/10">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accentOrange to-orange-600 flex items-center justify-center text-white font-bold shadow-lg border-2 border-white/10 group-hover:border-accentOrange transition-colors">
                            {user?.initials || 'AD'}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-3 h-3 rounded-full border-2 border-primary"></div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <h4 className="text-sm font-semibold text-white truncate group-hover:text-accentOrange transition-colors">{user?.username || 'Admin User'}</h4>
                        <p className="text-xs text-gray-400 truncate">{user?.role || 'System Administrator'}</p>
                    </div>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <Settings size={18} />
                    </button>
                    <button
                        onClick={logout}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
                <div className="mt-3 text-center">
                    <p className="text-[10px] text-gray-600">v2.4.0 • GMR Group</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
