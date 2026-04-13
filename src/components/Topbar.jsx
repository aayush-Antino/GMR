import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, LogOut, Settings } from 'lucide-react';
import gmrLogo from '../assets/gmr_logo.png';
import { executiveDummyData } from '../data/executiveDummyData';
import { getDashboardsForDepartment } from '../utils/dashboardUtils';
import { useAuth } from '../context/AuthContext';

const Topbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [activeDept, setActiveDept] = useState(null);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const navRef = useRef(null);
    const userRef = useRef(null);

    const isSatActive = location.pathname === '/sat-dashboard';
    const isMdmActive = location.pathname === '/mdm-dashboard-test';

    const departmentsOrder = ["Business", "Finance", "Operations", "Technical", "Analytics", "Advanced Analytics"];
    const departments = [...executiveDummyData.departments].sort((a, b) => {
        return departmentsOrder.indexOf(a.name) - departmentsOrder.indexOf(b.name);
    });

    useEffect(() => {
        const handleClick = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) setActiveDept(null);
            if (userRef.current && !userRef.current.contains(e.target)) setIsUserOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleDeptClick = (deptId) => {
        setActiveDept(prev => (prev === deptId ? null : deptId));
        setIsUserOpen(false);
    };

    const handleDashboardClick = (deptId, dashKey, route) => {
        if (route) {
            navigate(route);
        } else {
            navigate(`/dashboard/${dashKey}`);
        }
        setActiveDept(null);
    };

    return (
        <header className="w-full h-12 flex items-center px-6 shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-slate-200" style={{ backgroundColor: '#F1F5F9' }}>
            {/* Logo */}
            <div className="flex items-center mr-2 flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
                <div className="px-3">
                    <img
                        src={gmrLogo}
                        alt="GMR Logo"
                        className="h-16 object-contain"
                    />
                </div>
            </div>


            {/* Department Nav */}
            <nav ref={navRef} className="flex items-center gap-1 flex-1">
                {(() => {
                    const navItems = [...departments];
                    // Insert SAT and MDM as structured items with dashboards
                    navItems.splice(1, 0, { 
                        id: 'sat-node', 
                        name: 'SAT', 
                        dashboards: [{ key: 'sat-dash', title: 'SAT Dashboard', route: '/sat-dashboard' }], 
                        active: isSatActive 
                    });
                    navItems.splice(2, 0, { 
                        id: 'mdm-node', 
                        name: 'MDM', 
                        dashboards: [{ key: 'mdm-dash', title: 'MDMS Dashboard', route: '/mdm-dashboard-test' }], 
                        active: isMdmActive 
                    });

                    return navItems.map((item) => {
                        if (item.isDummy) {
                            return (
                                <div key={item.id} className="relative flex-shrink-0">
                                    <button
                                        onClick={() => navigate(item.route)}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                                            item.active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                    >
                                        {item.name}
                                    </button>
                                </div>
                            );
                        }

                        const dashboards = item.dashboards || getDashboardsForDepartment(item.name);
                        const isOpen = activeDept === item.id;

                        return (
                            <div key={item.id} className="relative flex-shrink-0">
                                <button
                                    onClick={() => handleDeptClick(item.id)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isOpen ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                >
                                    {item.name}
                                    <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-600' : 'opacity-40 text-slate-400'}`} />
                                </button>

                                {/* Dropdown */}
                                {isOpen && dashboards.length > 0 && (
                                    <div className="absolute top-[calc(100%+8px)] left-0 w-60 rounded-xl overflow-hidden z-50"
                                        style={{ background: '#0f2744', boxShadow: '0 16px 48px rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.name}</p>
                                        </div>
                                        <div className="py-1.5">
                                            {dashboards.map((dash) => (
                                                <button
                                                    key={dash.key}
                                                    onClick={() => handleDashboardClick(item.id, dash.key, dash.route)}
                                                    className="w-full text-left px-4 py-2.5 text-sm transition-all duration-150"
                                                    style={{ color: 'rgba(255,255,255,0.75)' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#F4A300'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                                                >
                                                    {dash.title}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    });
                })()}
            </nav>

            {/* User Profile */}
            <div className="relative flex items-center ml-4 flex-shrink-0" ref={userRef}>
                <button
                    onClick={() => { setIsUserOpen(prev => !prev); setActiveDept(null); }}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accentOrange to-orange-600 flex items-center justify-center text-white font-bold text-sm border border-white/20 shadow-sm">
                            {user?.initials || 'AD'}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-[#F1F5F9]"></div>
                    </div>
                    {/* <div className="hidden sm:block text-left">
                        <p className="text-sm font-bold text-slate-800 leading-tight">{user?.username || 'Admin User'}</p>
                        <p className="text-[10px] text-slate-500 font-bold leading-tight uppercase tracking-wide">{user?.role || 'System Administrator'}</p>
                    </div> */}
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isUserOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                        <div className="px-4 py-2.5 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-800">{user?.username || 'Admin User'}</p>
                            <p className="text-xs text-gray-400">{user?.role || 'System Administrator'}</p>
                        </div>
                        <div className="py-1">
                            <button className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                <Settings size={14} /> Settings
                            </button>
                            <button onClick={logout} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                <LogOut size={14} /> Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Version Badge */}
            <div className="ml-4 text-[10px] font-bold text-slate-400 bg-slate-200/50 px-1.5 py-0.5 rounded uppercase flex-shrink-0">
                v0
            </div>
        </header>
    );
};

export default Topbar;
