import React from 'react';
import {
    AreaChart, Area,
    LineChart, Line,
    BarChart, Bar,
    PieChart, Pie, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, Radar,
    XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// ─── GMR Brand Palette ─────────────────────────────────────────────────────
const GMR = {
    navy: '#0B3C6D',  // primary deep blue
    red: '#E31E24',  // accent red
    gold: '#F4A300',  // accent gold/orange
    teal: '#0D7377',  // complementary teal
    slate: '#64748B',  // neutral text
    light: '#F5F7FA',  // bg
};

// Ordered palette for multi-series charts
const GMR_PALETTE = [GMR.navy, GMR.red, GMR.gold, GMR.teal, '#7C3AED', '#10B981'];

// Common tooltip style
const TOOLTIP_STYLE = {
    borderRadius: '10px',
    border: 'none',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
};

const AXIS_TICK = { fill: GMR.slate, fontSize: 11, fontFamily: 'Inter, sans-serif' };

// ─── Helper: detect data shape ──────────────────────────────────────────────
/**
 * Returns the chart variant best suited to the data:
 *   'area'        – single value series (trend line with fill)
 *   'multi-line'  – multiple numeric keys (min/avg/max, phases, severity)
 *   'donut'       – 3-7 named slices (distribution / severity mix)
 *   'hbar'        – 2-5 comparison items (feeder comparison, tech mix)
 *   'bar'         – everything else (counts, volume)
 */
function detectVariant(data) {
    if (!data || !data.length) return 'bar';
    const keys = Object.keys(data[0]).filter(k => k !== 'name' && k !== 'color');
    const isMultiKey = keys.length > 1;
    const hasColors = data[0].color !== undefined;
    const isSmallSet = data.length <= 6;
    const hasNamedSlices = isSmallSet && keys.length === 1;

    if (isMultiKey) return 'multi-line';
    if (hasColors && hasNamedSlices) return 'donut';
    if (hasNamedSlices && data.length <= 5) return 'hbar';
    return 'area';
}

// ─── Gradient defs helper ───────────────────────────────────────────────────
const GradientDefs = ({ id, color }) => (
    <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
    </defs>
);

// ─── Sub-charts ─────────────────────────────────────────────────────────────

const AreaVariant = ({ data }) => (
    <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <GradientDefs id="areaGrad" color={GMR.navy} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Area
                type="monotone"
                dataKey="value"
                stroke={GMR.navy}
                strokeWidth={2.5}
                fill="url(#areaGrad)"
                dot={{ fill: GMR.navy, r: 4, stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: GMR.gold }}
            />
        </AreaChart>
    </ResponsiveContainer>
);

const MultiLineVariant = ({ data }) => {
    const keys = Object.keys(data[0]).filter(k => k !== 'name' && k !== 'color');
    const getColor = (key) => {
        const map = {
            min: GMR.red, max: '#10B981', avg: GMR.navy,
            critical: GMR.red, major: GMR.gold, minor: GMR.navy,
            'R-Phase': GMR.red, 'Y-Phase': GMR.gold, 'B-Phase': GMR.navy,
        };
        return map[key] || GMR_PALETTE[keys.indexOf(key) % GMR_PALETTE.length];
    };
    return (
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: 8, fontSize: 11 }} />
                {keys.map(key => (
                    <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={getColor(key)}
                        strokeWidth={2.5}
                        dot={{ fill: getColor(key), r: 3, stroke: '#fff', strokeWidth: 2 }}
                        activeDot={{ r: 5 }}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

const DonutVariant = ({ data }) => {
    const colors = data.map((d, i) => d.color || GMR_PALETTE[i % GMR_PALETTE.length]);
    const RADIAN = Math.PI / 180;
    const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if (percent < 0.06) return null;
        const r = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + r * Math.cos(-midAngle * RADIAN);
        const y = cy + r * Math.sin(-midAngle * RADIAN);
        return (
            <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="45%"
                    innerRadius="38%"
                    outerRadius="60%"
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={renderLabel}
                >
                    {data.map((_, i) => (
                        <Cell key={i} fill={colors[i]} stroke="none" />
                    ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [v, '']} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: 4, fontSize: 11 }} />
            </PieChart>
        </ResponsiveContainer>
    );
};

const HBarVariant = ({ data }) => {
    const colors = data.map((d, i) => d.color || GMR_PALETTE[i % GMR_PALETTE.length]);
    return (
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={AXIS_TICK} axisLine={false} tickLine={false} width={70} />
                <Tooltip
                    cursor={{ fill: '#F1F5F9' }}
                    contentStyle={TOOLTIP_STYLE}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
                    {data.map((_, i) => (
                        <Cell key={i} fill={colors[i]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

const BarVariant = ({ data }) => {
    const colors = data.map((d, i) => d.color || GMR_PALETTE[i % GMR_PALETTE.length]);
    return (
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    {GMR_PALETTE.map((c, i) => (
                        <linearGradient key={i} id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={c} stopOpacity={1} />
                            <stop offset="100%" stopColor={c} stopOpacity={0.6} />
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                    {data.map((d, i) => {
                        const idx = i % GMR_PALETTE.length;
                        return <Cell key={i} fill={d.color || `url(#barGrad${idx})`} />;
                    })}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

// ─── Main SmartChart export ─────────────────────────────────────────────────
/**
 * SmartChart — picks the right chart type automatically from data shape.
 * @param {Array}  data    – chart data array
 * @param {string} [hint]  – optional override: 'area'|'multi-line'|'donut'|'hbar'|'bar'
 */
const SmartChart = ({ data, hint }) => {
    if (!data || !data.length) {
        return (
            <div className="h-full flex items-center justify-center text-gray-300 text-sm">
                No data available
            </div>
        );
    }

    const variant = hint || detectVariant(data);

    return (
        <div className="h-full w-full">
            {variant === 'area' && <AreaVariant data={data} />}
            {variant === 'multi-line' && <MultiLineVariant data={data} />}
            {variant === 'donut' && <DonutVariant data={data} />}
            {variant === 'hbar' && <HBarVariant data={data} />}
            {variant === 'bar' && <BarVariant data={data} />}
        </div>
    );
};

export default SmartChart;
export { GMR, GMR_PALETTE, detectVariant };
