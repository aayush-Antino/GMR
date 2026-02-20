import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const GMR_PALETTE = ['#0B3C6D', '#E31E24', '#F4A300', '#0D7377', '#7C3AED', '#10B981'];

const TOOLTIP_STYLE = {
    borderRadius: '10px', border: 'none',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12)', fontSize: '12px',
};
const AXIS_TICK = { fill: '#64748B', fontSize: 11 };

const BarChartComponent = ({ data }) => {
    if (!data || !data.length) return null;

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%" debounce={50}>
                <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        {GMR_PALETTE.map((c, i) => (
                            <linearGradient key={i} id={`bgrad${i}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={c} stopOpacity={1} />
                                <stop offset="100%" stopColor={c} stopOpacity={0.55} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                    <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                        {data.map((entry, i) => {
                            const idx = i % GMR_PALETTE.length;
                            return (
                                <Cell
                                    key={i}
                                    fill={entry.color || `url(#bgrad${idx})`}
                                />
                            );
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartComponent;
