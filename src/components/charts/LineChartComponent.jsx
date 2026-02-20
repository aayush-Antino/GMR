import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// GMR brand palette for named keys
const KEY_COLORS = {
    min: '#E31E24',
    max: '#10B981',
    avg: '#0B3C6D',
    critical: '#E31E24',
    major: '#F4A300',
    minor: '#0B3C6D',
    'R-Phase': '#E31E24',
    'Y-Phase': '#F4A300',
    'B-Phase': '#0B3C6D',
    value: '#0B3C6D',
};
const FALLBACK = ['#0B3C6D', '#E31E24', '#F4A300', '#0D7377'];

const TOOLTIP_STYLE = {
    borderRadius: '10px', border: 'none',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12)', fontSize: '12px',
};
const AXIS_TICK = { fill: '#64748B', fontSize: 11 };

const LineChartComponent = ({ data }) => {
    if (!data || !data.length) return null;
    const keys = Object.keys(data[0]).filter(k => k !== 'name');
    const getColor = (key, i) => KEY_COLORS[key] || FALLBACK[i % FALLBACK.length];

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%" debounce={50}>
                <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        {keys.map((key, i) => (
                            <linearGradient key={key} id={`lg_${key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={getColor(key, i)} stopOpacity={0.2} />
                                <stop offset="100%" stopColor={getColor(key, i)} stopOpacity={0} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                    <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    {keys.length > 1 && <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />}
                    {keys.map((key, i) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={getColor(key, i)}
                            strokeWidth={2.5}
                            dot={{ fill: getColor(key, i), r: 4, stroke: '#fff', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#F4A300' }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChartComponent;
