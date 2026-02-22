import React from 'react';
import { REGIONS } from '../../utils/regionUtils';
import { MapPin, Navigation, Compass, Map } from 'lucide-react';
import { executiveDummyData } from '../../data/executiveDummyData';

// Simulated Health mapping for regions based on total executive dummy data
const getRegionHealth = (regionName) => {
    // Generate pseudo-data for visual demonstration based on the core system score
    const baseHealth = executiveDummyData.summary.health || 85;

    switch (regionName) {
        case 'North': return { score: Math.round(baseHealth - 12), text: 'Needs Attention', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
        case 'South': return { score: Math.round(baseHealth + 8), text: 'Healthy', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
        case 'East': return { score: Math.round(baseHealth - 5), text: 'Stable', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
        case 'West': return { score: Math.round(baseHealth - 25), text: 'Critical Risk', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
        default: return { score: baseHealth, text: 'Healthy', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    }
}

const RegionIcon = ({ region }) => {
    switch (region) {
        case 'North': return <Navigation className="text-orange-500 rotate-0" size={24} />;
        case 'South': return <Navigation className="text-green-500 rotate-180" size={24} />;
        case 'East': return <Navigation className="text-blue-500 rotate-90" size={24} />;
        case 'West': return <Navigation className="text-red-500 -rotate-90" size={24} />;
        default: return <Map size={24} className="text-slate-400" />;
    }
}

const RegionalHeatmap = () => {
    const activeRegions = REGIONS.filter(r => r !== 'All');

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:border-slate-300 transition-colors z-10">
            {/* Ambient Background Element */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-slate-50 rounded-full blur-[80px] pointer-events-none group-hover:bg-slate-100 transition-colors"></div>

            <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-3 tracking-wide">
                    <Compass className="text-primary" size={28} />
                    Geographical Risk Heatmap
                </h3>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">Live Matrix</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {activeRegions.map(region => {
                    const health = getRegionHealth(region);
                    return (
                        <div
                            key={region}
                            className={`p-6 bg-white rounded-2xl border ${health.border} ${health.bg} hover:shadow-lg hover:bg-white transition-all cursor-pointer shadow-sm hover:-translate-y-1 relative overflow-hidden group/card`}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <RegionIcon region={region} />
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-md border border-slate-200/50 shadow-sm backdrop-blur-sm">
                                    <div className={`w-1.5 h-1.5 rounded-full ${health.color.replace('text-', 'bg-')} ${health.score < 70 ? 'animate-pulse shadow-[0_0_8px_currentColor]' : ''}`}></div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${health.color}`}>
                                        {health.text}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 group-hover/card:text-slate-500 transition-colors">Region Zone</h4>
                                <div className="text-2xl font-black text-slate-900 flex items-baseline gap-2">
                                    {region}
                                    <span className="text-sm font-semibold text-slate-400">[{health.score}/100]</span>
                                </div>
                            </div>

                            {/* subtle health bar at the bottom */}
                            <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full">
                                <div
                                    className={`h-full ${health.color.replace('text-', 'bg-')}`}
                                    style={{ width: `${health.score}%` }}
                                ></div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default RegionalHeatmap;
