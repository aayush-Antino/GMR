import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Zap } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // Simulate network delay
        setTimeout(() => {
            const success = login(username, password);
            if (success) {
                navigate(from, { replace: true });
            } else {
                setError('Invalid credentials. Try admin / 12345');
                setIsSubmitting(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen flex font-sans bg-white">
            {/* Left Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
                <div className="w-full max-w-md space-y-8">
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Log In</h1>
                        <p className="text-gray-500">Welcome back! Please enter your details.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Email Address/Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter Username"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <button type="button" className="text-sm font-semibold text-[#0B3C6D] hover:underline">
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-[#0B3C6D] hover:bg-[#092b4d] text-white font-bold py-3.5 rounded-lg transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Side - Branding */}
            <div className="hidden lg:flex w-1/2 bg-[#0B3C6D] relative overflow-hidden items-center justify-center p-12">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accentOrange/10 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl"></div>

                {/* Content */}
                <div className="relative z-10 text-center max-w-lg">
                    <h2 className="text-3xl font-bold text-white mb-2">Executive Control Center</h2>
                    <h3 className="text-xl font-medium text-blue-200 mb-12">Smart Metering Ecosystem</h3>

                    {/* SVG Illustration - Command Center Hub */}
                    <div className="relative mx-auto w-96 h-96 animate-in fade-in zoom-in duration-700">
                        <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-2xl overflow-visible">
                            <defs>
                                <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
                                </radialGradient>
                                <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.9" />
                                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
                                </linearGradient>
                                <filter id="blueGlow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Orbiting Rings */}
                            <g transform="translate(250, 250)">
                                {/* Outer Ring */}
                                <circle cx="0" cy="0" r="180" fill="none" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="10 20">
                                    <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="60s" repeatCount="indefinite" />
                                </circle>

                                {/* Inner Data Ring */}
                                <circle cx="0" cy="0" r="140" fill="none" stroke="#F4A300" strokeWidth="2" strokeOpacity="0.2">
                                    <animate attributeName="stroke-opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" />
                                </circle>

                                {/* Moving Data Packet on Ring */}
                                <circle cx="0" cy="-140" r="4" fill="#F4A300" filter="url(#blueGlow)">
                                    <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="0" cy="140" r="4" fill="#3b82f6" filter="url(#blueGlow)">
                                    <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="12s" repeatCount="indefinite" />
                                </circle>
                            </g>

                            {/* Central Core Structure */}
                            <g transform="translate(250, 280)">
                                {/* Base Platform */}
                                <ellipse cx="0" cy="60" rx="100" ry="30" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                                <path d="M-80 50 L-60 -20 L60 -20 L80 50 Z" fill="url(#coreGradient)" opacity="0.5" />

                                {/* Main Server Block */}
                                <rect x="-60" y="-100" width="120" height="140" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />

                                {/* Server Lights */}
                                <circle cx="-40" cy="-80" r="3" fill="#22c55e" filter="url(#blueGlow)">
                                    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="-40" cy="-60" r="3" fill="#22c55e" />
                                <circle cx="-40" cy="-40" r="3" fill="#22c55e" />

                                {/* Central GMR Logo on Server */}
                                <g transform="translate(-40, -10)">
                                    <rect width="80" height="30" rx="5" fill="#f8fafc" />
                                    <text x="40" y="20" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold" fontSize="14" fill="#0B3C6D">GMR</text>
                                </g>

                                {/* Energy Pulse from Core */}
                                <circle cx="0" cy="-30" r="5" fill="#3b82f6" opacity="0">
                                    <animate attributeName="r" values="5;100" dur="3s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.8;0" dur="3s" repeatCount="indefinite" />
                                </circle>
                            </g>

                            {/* Floating Holographic Screens */}
                            <g transform="translate(250, 160)">
                                {/* Main Stats Screen (Top) */}
                                <g transform="translate(0, -40)">
                                    <rect x="-90" y="-50" width="180" height="100" rx="8" fill="url(#screenGrad)" stroke="#3b82f6" strokeWidth="2" filter="url(#blueGlow)" />
                                    {/* Graph Line */}
                                    <polyline points="-70,20 -40,0 -10,15 20,-10 50,5 70,-20" fill="none" stroke="#22c55e" strokeWidth="3" />
                                    <circle cx="70" cy="-20" r="4" fill="#22c55e" />
                                    {/* Header */}
                                    <rect x="-80" y="-40" width="60" height="8" rx="2" fill="#3b82f6" opacity="0.5" />
                                </g>

                                {/* Side Screen (Left) */}
                                <g transform="translate(-160, 40)">
                                    <rect x="-50" y="-40" width="100" height="80" rx="6" fill="url(#screenGrad)" stroke="#F4A300" strokeWidth="1" opacity="0.8" />
                                    <text x="0" y="5" textAnchor="middle" fill="#F4A300" fontSize="24" fontWeight="bold">98%</text>
                                    <text x="0" y="25" textAnchor="middle" fill="#94a3b8" fontSize="10">Uptime</text>
                                    {/* Connection Line to Core */}
                                    <path d="M50 0 L100 50" stroke="#F4A300" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                                </g>

                                {/* Side Screen (Right) */}
                                <g transform="translate(160, 40)">
                                    <rect x="-50" y="-40" width="100" height="80" rx="6" fill="url(#screenGrad)" stroke="#ef4444" strokeWidth="1" opacity="0.8" />
                                    <text x="0" y="5" textAnchor="middle" fill="#ef4444" fontSize="24" fontWeight="bold">3</text>
                                    <text x="0" y="25" textAnchor="middle" fill="#94a3b8" fontSize="10">Alerts</text>
                                    {/* Connection Line to Core */}
                                    <path d="M-50 0 L-100 50" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                                </g>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
