import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const GMR_PALETTE = ['#0B3C6D', '#E31E24', '#F4A300', '#0D7377', '#7C3AED', '#10B981'];

const TOOLTIP_STYLE = {
    borderRadius: '10px', border: 'none',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12)', fontSize: '12px',
};

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.06) return null;
    const r = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const PieChartComponent = ({ data }) => {
    if (!data || !data.length) return null;

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="45%"
                        innerRadius="35%"
                        outerRadius="58%"
                        paddingAngle={3}
                        dataKey="value"
                        labelLine={false}
                        label={renderLabel}
                    >
                        {data.map((entry, i) => (
                            <Cell
                                key={i}
                                fill={entry.color || GMR_PALETTE[i % GMR_PALETTE.length]}
                                stroke="none"
                            />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [v, '']} />
                    <Legend iconType="circle" iconSize={8} verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartComponent;
