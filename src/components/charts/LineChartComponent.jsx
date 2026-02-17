
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LineChartComponent = ({ data }) => {
    // Determine keys to plot
    const keys = data && data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'name') : ['value'];

    // Define colors for specific keys
    const getKeyColor = (key) => {
        switch (key) {
            case 'min': return '#EF4444'; // Red for min
            case 'max': return '#10B981'; // Green for max
            case 'avg': return '#3B82F6'; // Blue for avg
            default: return '#0B3C6D';    // Default blue
        }
    };

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%" debounce={50}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    {keys.map((key) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={getKeyColor(key)}
                            strokeWidth={3}
                            dot={{ fill: getKeyColor(key), strokeWidth: 2, r: 4, stroke: '#fff' }}
                            activeDot={{ r: 6 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChartComponent;
