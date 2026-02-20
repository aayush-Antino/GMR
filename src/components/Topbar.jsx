import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { executiveDummyData } from '../data/executiveDummyData';
import { useAuth } from '../context/AuthContext';

const Topbar = () => {
    const { user, logout } = useAuth();
    const [isUserOpen, setIsUserOpen] = useState(false);
    const userRef = useRef(null);

    const departmentItems = executiveDummyData.departments.map(dept => ({
        title: dept.name,
        path: `/departments/${dept.id}`,
    }));

    // Close user dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (userRef.current && !userRef.current.contains(e.target)) setIsUserOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <header className="w-full bg-primary text-white h-16 flex items-center px-6 shadow-lg fixed top-0 left-0 right-0 z-50">
            {/* Logo */}
            <div className="flex items-center mr-8 flex-shrink-0">
                <div className="bg-white py-1.5 px-3 rounded-lg shadow-sm">
                    <img
                        src="https://www.gmrgroup.in/src/images/home/gmr-logo.png"
                        alt="GMR Logo"
                        className="h-7 object-contain"
                    />
                </div>
            </div>

            {/* Nav Items — all departments shown inline */}
            <nav className="flex items-center gap-3 flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {departmentItems.map((dept) => (
                    <NavLink
                        key={dept.path}
                        to={dept.path}
                        className={({ isActive }) =>
                            `whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-white/15 text-white font-semibold'
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`
                        }
                    >
                        {dept.title}
                    </NavLink>
                ))}
            </nav>

            {/* Right Side: User Profile */}
            <div className="relative flex items-center ml-4 flex-shrink-0" ref={userRef}>
                <button
                    onClick={() => setIsUserOpen(prev => !prev)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer"
                >
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accentOrange to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow border border-white/20">
                            {user?.initials || 'AD'}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-primary"></div>
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold text-white leading-tight">{user?.username || 'Admin User'}</p>
                        <p className="text-[11px] text-gray-400 leading-tight">{user?.role || 'System Administrator'}</p>
                    </div>
                    <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-200 ${isUserOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {isUserOpen && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-bold text-gray-800">{user?.username || 'Admin User'}</p>
                            <p className="text-xs text-gray-500">{user?.role || 'System Administrator'}</p>
                        </div>
                        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <Settings size={15} />
                            Settings
                        </button>
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={15} />
                            Logout
                        </button>
                        <div className="px-4 py-2 border-t border-gray-100 text-center">
                            <p className="text-[10px] text-gray-400">v2.4.0 • GMR Group</p>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Topbar;
