import React from 'react';
import {
    AreaChart, Area,
    LineChart, Line,
    BarChart, Bar,
    PieChart, Pie, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, Radar,
    XAxis, YAxis, CartesianGrid, Label, LabelList,
    Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// ─── GMR Brand Palette (Exact BI Match) ──────────────────────────────────
const GMR = {
    blue: '#3b82f6',    // Inventory / Primary / Critical
    green: '#10b981',   // Total Installed / Success / Major
    orange: '#f59e0b',  // Cumulative SAT / Warning / Minor
    slate: '#475569',   // axis text (darker for BI clarity)
    grid: '#f1f5f9',    // lighter grid lines
};

// Map keys to specific brand colors for consistency
const KEY_COLORS = {
    'Inventory': GMR.blue,
    'Total Installed': GMR.green,
    'Cumulative SAT': GMR.orange,
    'critical': GMR.blue,
    'major': GMR.green,
    'minor': GMR.orange,
    'High': GMR.blue,
    'Medium': GMR.green,
    'Low': GMR.orange,
};

const GMR_PALETTE = [GMR.blue, GMR.green, GMR.orange, '#6366f1', '#ec4899'];

const getColor = (key, index) => {
    const k = key.toLowerCase().trim();
    if (KEY_COLORS[k]) return KEY_COLORS[k];
    if (KEY_COLORS[key]) return KEY_COLORS[key];
    return GMR_PALETTE[index % GMR_PALETTE.length];
};

const TOOLTIP_STYLE = {
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#fff',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    fontSize: '13px',
    fontWeight: 700,
    padding: '10px',
};

const AXIS_STYLE = { fill: GMR.slate, fontSize: 11, fontWeight: 600 };

const formatValue = (v) => {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
    return v;
};

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

    if (isMultiKey) return 'multi-area'; // Default to multi-area for trends in image
    if (hasColors && data.length <= 6) return 'donut';
    if (data.length <= 5) return 'hbar';
    return 'area';
}

// ─── Custom Components ──────────────────────────────────────────────────────

const CustomLabel = ({ x, y, value, color, position = 'top' }) => (
    <g>
        <text
            x={x}
            y={position === 'top' ? y - 10 : y + 4}
            fill="#fff"
            fontSize={11}
            fontWeight={900}
            textAnchor={position === 'right' ? 'start' : 'middle'}
            dx={position === 'right' ? 8 : 0}
            stroke="#fff"
            strokeWidth={3}
            strokeLinejoin="round"
        >
            {formatValue(value)}
        </text>
        <text
            x={x}
            y={position === 'top' ? y - 10 : y + 4}
            fill={color}
            fontSize={11}
            fontWeight={900}
            textAnchor={position === 'right' ? 'start' : 'middle'}
            dx={position === 'right' ? 8 : 0}
        >
            {formatValue(value)}
        </text>
    </g>
);

const AreaVariant = ({ data, isMulti, xLabel, yLabel }) => {
    const keys = isMulti ? Object.keys(data[0]).filter(k => k !== 'name' && k !== 'color') : ['value'];
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 35, right: 20, left: 10, bottom: 20 }}>
                <defs>
                    {keys.map((key, i) => (
                        <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={getColor(key, i)} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={getColor(key, i)} stopOpacity={0.05} />
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GMR.grid} />
                <XAxis dataKey="name" tick={AXIS_STYLE} axisLine={false} tickLine={false} dy={8}>
                    <Label value={xLabel} position="insideBottom" offset={-10} style={{ ...AXIS_STYLE, fontSize: 10 }} />
                </XAxis>
                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={formatValue}>
                    <Label value={yLabel} angle={-90} position="insideLeft" style={{ ...AXIS_STYLE, fontSize: 10, textAnchor: 'middle' }} offset={10} />
                </YAxis>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend
                    verticalAlign="top"
                    align="center"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ top: -20, paddingBottom: 30, fontSize: 12, fontWeight: 800 }}
                />
                {keys.map((key, i) => (
                    <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={getColor(key, i)}
                        strokeWidth={3}
                        fill={`url(#grad-${key})`}
                        dot={{ fill: getColor(key, i), r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        label={<CustomLabel color={getColor(key, i)} />}
                    />
                ))}
            </AreaChart>
        </ResponsiveContainer>
    );
};

const MultiLineVariant = ({ data, xLabel, yLabel }) => {
    const keys = Object.keys(data[0]).filter(k => k !== 'name' && k !== 'color');
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 35, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GMR.grid} />
                <XAxis dataKey="name" tick={AXIS_STYLE} axisLine={false} tickLine={false} dy={8}>
                    <Label value={xLabel} position="insideBottom" offset={-10} style={{ ...AXIS_STYLE, fontSize: 10 }} />
                </XAxis>
                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={formatValue}>
                    <Label value={yLabel} angle={-90} position="insideLeft" style={{ ...AXIS_STYLE, fontSize: 10, textAnchor: 'middle' }} offset={10} />
                </YAxis>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend
                    verticalAlign="top"
                    align="center"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ top: -20, paddingBottom: 30, fontSize: 12, fontWeight: 800 }}
                />
                {keys.map((key, i) => (
                    <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={getColor(key, i)}
                        strokeWidth={3}
                        dot={{ fill: getColor(key, i), r: 4, strokeWidth: 0 }}
                        label={<CustomLabel color={getColor(key, i)} />}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

const DonutVariant = ({ data }) => {
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if (percent < 0.05) return null;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={800}>
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
                    cy="50%"
                    innerRadius="45%"
                    outerRadius="75%"
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                >
                    {data.map((entry, i) => (
                        <Cell key={i} fill={entry.color || getColor(entry.name, i)} stroke="none" />
                    ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: 15, fontSize: 11, fontWeight: 600 }} />
            </PieChart>
        </ResponsiveContainer>
    );
};

const HBarVariant = ({ data, xLabel, yLabel }) => {
    const keys = Object.keys(data[0]).filter(k => k !== 'name' && k !== 'color');

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 35, right: 80, left: 20, bottom: 20 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={GMR.grid} />
                <XAxis type="number" tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={formatValue}>
                    <Label value={xLabel} position="insideBottom" offset={-10} style={{ ...AXIS_STYLE, fontSize: 10 }} />
                </XAxis>
                <YAxis dataKey="name" type="category" tick={AXIS_STYLE} axisLine={false} tickLine={false} width={120}>
                    <Label value={yLabel} angle={-90} position="insideLeft" style={{ ...AXIS_STYLE, fontSize: 10, textAnchor: 'middle' }} offset={10} />
                </YAxis>
                <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} contentStyle={TOOLTIP_STYLE} />
                <Legend
                    verticalAlign="top"
                    align="center"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ top: -20, paddingBottom: 30, fontSize: 12, fontWeight: 800 }}
                />
                {keys.map((key, i) => (
                    <Bar
                        key={key}
                        dataKey={key}
                        fill={getColor(key, i)}
                        radius={[0, 4, 4, 0]}
                        barSize={14}
                    >
                        {/* Custom label logic: 1st bar (Green) = Outside, 2nd bar (Orange) = Inside */}
                        <LabelList
                            dataKey={key}
                            position={i === 0 ? "right" : "inside"}
                            fill={i === 0 ? getColor(key, i) : "#fff"}
                            fontSize={10}
                            fontWeight={900}
                            formatter={(v) => {
                                if (key.toLowerCase().includes('sat') || key.toLowerCase().includes('achievement')) {
                                    return typeof v === 'number' ? `${v}%` : v;
                                }
                                return formatValue(v);
                            }}
                        />
                    </Bar>
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

const BarVariant = ({ data, xLabel, yLabel }) => {
    const keys = Object.keys(data[0]).filter(k => k !== 'name' && k !== 'color');
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 35, right: 10, left: 10, bottom: 20 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GMR.grid} />
                <XAxis dataKey="name" tick={AXIS_STYLE} axisLine={false} tickLine={false} dy={8}>
                    <Label value={xLabel} position="insideBottom" offset={-10} style={{ ...AXIS_STYLE, fontSize: 10 }} />
                </XAxis>
                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={formatValue}>
                    <Label value={yLabel} angle={-90} position="insideLeft" style={{ ...AXIS_STYLE, fontSize: 10, textAnchor: 'middle' }} offset={10} />
                </YAxis>
                <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} contentStyle={TOOLTIP_STYLE} />
                <Legend
                    verticalAlign="top"
                    align="center"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ top: -20, paddingBottom: 30, fontSize: 12, fontWeight: 800 }}
                />
                {keys.map((key, i) => (
                    <Bar
                        key={key}
                        dataKey={key}
                        fill={getColor(key, i)}
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                        label={<CustomLabel color={getColor(key, i)} />}
                    />
                ))}
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
            <div className="h-full flex items-center justify-center text-gray-300 text-sm italic">
                No data available
            </div>
        );
    }

    const variant = hint || detectVariant(data);

    return (
        <div className="h-full w-full font-sans">
            {variant === 'area' && <AreaVariant data={data} xLabel="Time Period" yLabel="Value" />}
            {variant === 'multi-area' && <AreaVariant data={data} isMulti xLabel="Time Period" yLabel="Volume" />}
            {variant === 'multi-line' && <MultiLineVariant data={data} xLabel="Timeline" yLabel="Parameters" />}
            {variant === 'donut' && <DonutVariant data={data} />}
            {variant === 'hbar' && <HBarVariant data={data} xLabel="Value" yLabel="Category" />}
            {variant === 'bar' && <BarVariant data={data} xLabel="Classification" yLabel="Total Count" />}
        </div>
    );
};

export default SmartChart;
export { GMR, GMR_PALETTE, detectVariant };
