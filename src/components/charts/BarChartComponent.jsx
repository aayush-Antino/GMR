
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const BarChartComponent = ({ data }) => {
    const colors = ['#0B3C6D', '#E31E24', '#F4A300', '#0B3C6D', '#F4A300'];

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%" debounce={50}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartComponent;
