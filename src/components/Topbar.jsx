import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { executiveDummyData } from '../data/executiveDummyData';
import { getDashboardsForDepartment } from '../utils/dashboardUtils';
import { useAuth } from '../context/AuthContext';

const Topbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeDept, setActiveDept] = useState(null);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const navRef = useRef(null);
    const userRef = useRef(null);

    const departments = executiveDummyData.departments;

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

    const handleDashboardClick = (deptId, dashKey) => {
        navigate(`/dashboard/${dashKey}`);
        setActiveDept(null);
    };

    return (
        <header className="w-full bg-primary text-white h-16 flex items-center px-6 shadow-md fixed top-0 left-0 right-0 z-50">
            {/* Logo */}
            <div className="flex items-center mr-8 flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
                <div className="bg-white py-1.5 px-3 rounded-lg">
                    <img
                        src="https://www.gmrgroup.in/src/images/home/gmr-logo.png"
                        alt="GMR Logo"
                        className="h-8 object-contain"
                    />
                </div>
            </div>

            {/* Department Nav */}
            <nav ref={navRef} className="flex items-center gap-1 flex-1">
                {departments.map((dept) => {
                    const dashboards = getDashboardsForDepartment(dept.name);
                    const isOpen = activeDept === dept.id;

                    return (
                        <div key={dept.id} className="relative flex-shrink-0">
                            <button
                                onClick={() => handleDeptClick(dept.id)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isOpen ? 'bg-white/15 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {dept.name}
                                <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : 'opacity-60'}`} />
                            </button>

                            {/* Dropdown */}
                            {isOpen && dashboards.length > 0 && (
                                <div className="absolute top-[calc(100%+8px)] left-0 w-60 rounded-xl overflow-hidden z-50"
                                    style={{ background: '#0f2744', boxShadow: '0 16px 48px rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>{dept.name}</p>
                                    </div>
                                    <div className="py-1.5">
                                        {dashboards.map((dash) => (
                                            <button
                                                key={dash.key}
                                                onClick={() => handleDashboardClick(dept.id, dash.key)}
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
                })}
            </nav>

            {/* User Profile */}
            <div className="relative flex items-center ml-4 flex-shrink-0" ref={userRef}>
                <button
                    onClick={() => { setIsUserOpen(prev => !prev); setActiveDept(null); }}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accentOrange to-orange-600 flex items-center justify-center text-white font-bold text-sm border border-white/20">
                            {user?.initials || 'AD'}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-primary"></div>
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold text-white leading-tight">{user?.username || 'Admin User'}</p>
                        <p className="text-[11px] text-gray-400 leading-tight">{user?.role || 'System Administrator'}</p>
                    </div>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isUserOpen ? 'rotate-180' : ''}`} />
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
        </header>
    );
};

export default Topbar;
