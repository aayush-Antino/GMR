import React from 'react';
import {
    AreaChart, Area,
    LineChart, Line,
    BarChart, Bar,
    ComposedChart,
    PieChart, Pie, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, Radar,
    XAxis, YAxis, CartesianGrid, Label, LabelList,
    Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { GMR, AXIS_STYLE, TOOLTIP_STYLE, detectVariant, getColor } from '../../utils/chartUtils';

const slugify = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim();

// ─── Sub-Variants ──────────────────────────────────────────────────────────

const formatValue = (v) => {
    if (v === undefined || v === null) return '0';
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
    return v;
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={TOOLTIP_STYLE}>
                <p className="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between gap-4 py-0.5">
                        <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-slate-500 font-medium capitalize">{entry.name}:</span>
                        </span>
                        <span className="font-bold text-slate-900">{formatValue(entry.value)}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

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
const renderCustomLegend = (props) => {
    const { payload } = props;
    if (!payload) return null;
    return (
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 pt-2">
            {payload.map((entry, index) => {
                const isUrl = entry.color && entry.color.includes('url');
                const backgroundColor = isUrl 
                    ? getColor(entry.value?.toString().trim())
                    : (entry.color || getColor(entry.value?.toString().trim()) || GMR.blue);

                return (
                    <li key={`item-${index}`} className="flex items-center gap-2 select-none">
                        <span 
                            className="h-2.5 w-2.5 rounded-full shadow-sm shadow-black/10" 
                            style={{ backgroundColor }} 
                        />
                        <span className="text-[12px] font-extrabold text-slate-700 tracking-tight">
                            {entry.value}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
};

const AreaVariant = ({ data, isMulti, xLabel, yLabel, interval: propInterval, chartName }) => {
    const rawKeys = Object.keys(data[0]).filter(k => k !== 'name' && k !== 'color');
    const keys = (rawKeys.length > 1 && rawKeys.includes('value')) ? rawKeys.filter(k => k !== 'value') : rawKeys;
    const chartId = slugify(chartName || 'chart');
    
    // Dynamic interval to keep labels readable
    const interval = propInterval !== undefined ? propInterval : (data.length > 60 ? Math.floor(data.length / 6) : 'auto');

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 35, right: 20, left: 10, bottom: 20 }}>
                <defs>
                    {keys.map((key, i) => (
                        <linearGradient key={`${chartId}-${slugify(key)}`} id={`${chartId}-grad-${slugify(key)}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={getColor(key, i)} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={getColor(key, i)} stopOpacity={0.05} />
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GMR.grid} />
                <XAxis 
                    dataKey="name" 
                    tick={AXIS_STYLE} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={8} 
                    interval={interval}
                >
                    <Label value={xLabel} position="insideBottom" offset={-10} style={{ ...AXIS_STYLE, fontSize: 10 }} />
                </XAxis>
                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={formatValue}>
                    <Label value={yLabel} angle={-90} position="insideLeft" style={{ ...AXIS_STYLE, fontSize: 10, textAnchor: 'middle' }} offset={10} />
                </YAxis>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderCustomLegend} verticalAlign="top" />
                {keys.map((key, i) => (
                    <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={getColor(key, i)}
                        strokeWidth={data.length > 100 ? 1.5 : 3} // Thinner line for very high density
                        fill={`url(#${chartId}-grad-${slugify(key)})`}
                        dot={data.length > 50 ? false : { fill: getColor(key, i), r: 4, strokeWidth: 0 }} // Hide dots for dense data
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        animationDuration={1200}
                        isAnimationActive={true}
                    />
                ))}
            </AreaChart>
        </ResponsiveContainer>
    );
};

const MultiLineVariant = ({ data, xLabel, yLabel, interval: propInterval }) => {
    const keys = Object.keys(data[0]).filter(k => k !== 'name' && k !== 'color');
    const interval = propInterval !== undefined ? propInterval : 'auto';
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 35, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GMR.grid} />
                <XAxis dataKey="name" tick={AXIS_STYLE} axisLine={false} tickLine={false} dy={8} interval={interval}>
                    <Label value={xLabel} position="insideBottom" offset={-10} style={{ ...AXIS_STYLE, fontSize: 10 }} />
                </XAxis>
                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={formatValue}>
                    <Label value={yLabel} angle={-90} position="insideLeft" style={{ ...AXIS_STYLE, fontSize: 10, textAnchor: 'middle' }} offset={10} />
                </YAxis>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend content={renderCustomLegend} verticalAlign="top" />
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
                    dataKey={Object.keys(data[0]).find(k => k !== 'name' && k !== 'color') || 'value'}
                    labelLine={false}
                    label={renderCustomizedLabel}
                >
                    {data.map((entry, i) => (
                        <Cell key={i} fill={entry.color || getColor(entry.name, i)} stroke="none" />
                    ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend content={renderCustomLegend} verticalAlign="bottom" />
            </PieChart>
        </ResponsiveContainer>
    );
};

const CustomHBarLabel = (props) => {
    const { x, y, width, height, value, index, parentData } = props;
    const formatted = formatValue(value);
    
    // Density check: hide labels if there are too many bars
    if (parentData && parentData.length > 30) return null;

    // Dynamic font size calculation
    const baseFontSize = height < 12 ? 8 : 9;
    const textWidth = typeof formatted === 'string' ? formatted.length * 6 : 10;
    const fontSize = textWidth > width - 10 ? Math.max(6, Math.floor((width - 10) / formatted.length * 1.5)) : baseFontSize;

    // Don't render if the segment or font is too small or too thin
    if (width < 40 || fontSize < 7) return null;
    
    return (
        <text 
            x={x + width - 8} 
            y={y + height / 2} 
            fill="#fff" 
            textAnchor="end" 
            dominantBaseline="middle" 
            fontSize={fontSize} 
            fontWeight={700}
            pointerEvents="none"
        >
            {formatted}
        </text>
    );
};

const HBarVariant = ({ data, xLabel, yLabel }) => {
    const rawKeys = Object.keys(data[0]).filter(k => k !== 'name' && k !== 'color');
    const keys = (rawKeys.length > 1 && rawKeys.includes('value')) ? rawKeys.filter(k => k !== 'value') : rawKeys;
    const isDense = data.length > 15;
    const barSize = isDense ? Math.max(6, Math.min(12, 400 / data.length)) : 16;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 35, right: 80, left: 20, bottom: 20 }} barGap={2}>
                <defs>
                    {keys.map((key, i) => (
                        <linearGradient key={key} id={`hbar-grad-${slugify(key)}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={getColor(key, i)} stopOpacity={0.8} />
                            <stop offset="100%" stopColor={getColor(key, i)} stopOpacity={1} />
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={GMR.grid} />
                <XAxis type="number" tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={formatValue}>
                    <Label value={xLabel} position="insideBottom" offset={-10} style={{ ...AXIS_STYLE, fontSize: 10 }} />
                </XAxis>
                <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={AXIS_STYLE} 
                    axisLine={false} 
                    tickLine={false} 
                    width={isDense ? 100 : 150}
                    tickFormatter={(v) => v.length > 20 ? v.substring(0, 18) + '…' : v}
                    interval={data.length > 50 ? Math.floor(data.length / 10) : (isDense ? 'preserveStartEnd' : 0)}
                >
                    <Label value={yLabel} angle={-90} position="insideLeft" style={{ ...AXIS_STYLE, fontSize: 10, textAnchor: 'middle' }} offset={10} />
                </YAxis>
                <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} content={<CustomTooltip />} />
                <Legend content={renderCustomLegend} verticalAlign="top" />
                {keys.map((key, i) => (
                    <Bar
                        key={key}
                        dataKey={key}
                        stackId="a"
                        fill={`url(#hbar-grad-${slugify(key)})`}
                        stroke={getColor(key, i)}
                        strokeWidth={1}
                        radius={i === keys.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]}
                        barSize={barSize}
                        isAnimationActive={true}
                        animationDuration={1500}
                    >
                        <LabelList
                            dataKey={key}
                            content={<CustomHBarLabel parentData={data} />}
                        />
                    </Bar>
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

const CustomVBarLabel = (props) => {
    const { x, y, width, height, value, parentData } = props;
    const formatted = formatValue(value);
    
    // Density check: hide labels if there are too many bars
    if (parentData && parentData.length > 30) return null;

    // Dynamic font size calculation
    const baseFontSize = width < 20 ? 8 : 9;
    const textWidth = typeof formatted === 'string' ? formatted.length * 6 : 10;
    const fontSize = textWidth > width - 4 ? Math.max(6, Math.floor((width - 4) / formatted.length * 1.5)) : baseFontSize;

    // Don't render if the segment or font is too small or too thin
    if (height < 25 || width < 30 || fontSize < 7) return null;

    return (
        <text 
            x={x + width / 2} 
            y={y + 12} 
            fill="#fff" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fontSize={fontSize} 
            fontWeight={700}
            pointerEvents="none"
        >
            {formatted}
        </text>
    );
};

const BarVariant = ({ data, xLabel, yLabel, interval: propInterval }) => {
    const rawKeys = Object.keys(data[0]).filter(k => k !== 'name' && k !== 'color');
    const keys = (rawKeys.length > 1 && rawKeys.includes('value')) ? rawKeys.filter(k => k !== 'value') : rawKeys;
    const isDense = data.length > 10;
    const barSize = isDense ? Math.max(12, 300 / data.length) : 32;
    const interval = propInterval !== undefined ? propInterval : (data.length > 30 ? Math.floor(data.length / 8) : (isDense ? 'preserveStartEnd' : 0));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 35, right: 10, left: 10, bottom: 20 }}>
                <defs>
                    {keys.map((key, i) => (
                        <linearGradient key={key} id={`bar-grad-${slugify(key)}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={getColor(key, i)} stopOpacity={1} />
                            <stop offset="100%" stopColor={getColor(key, i)} stopOpacity={0.7} />
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GMR.grid} />
                <XAxis 
                    dataKey="name" 
                    tick={{ ...AXIS_STYLE, angle: data.length > 6 ? -30 : 0, textAnchor: data.length > 6 ? 'end' : 'middle' }} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={data.length > 6 ? 10 : 8} 
                    height={data.length > 6 ? 60 : 30}
                    interval={interval}
                >
                    <Label value={xLabel} position="insideBottom" offset={-10} style={{ ...AXIS_STYLE, fontSize: 10 }} />
                </XAxis>
                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={formatValue}>
                    <Label value={yLabel} angle={-90} position="insideLeft" style={{ ...AXIS_STYLE, fontSize: 10, textAnchor: 'middle' }} offset={10} />
                </YAxis>
                <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} content={<CustomTooltip />} />
                <Legend content={renderCustomLegend} verticalAlign="top" />
                {keys.map((key, i) => (
                    <Bar
                        key={key}
                        dataKey={key}
                        stackId="a"
                        fill={`url(#bar-grad-${slugify(key)})`}
                        stroke={getColor(key, i)}
                        strokeWidth={1}
                        radius={i === keys.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]} // Only top bar gets rounded corners
                        barSize={barSize}
                        isAnimationActive={true}
                        animationDuration={1500}
                    >
                        <LabelList
                            dataKey={key}
                            content={<CustomVBarLabel parentData={data} />}
                        />
                    </Bar>
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

const GaugeVariant = ({ data }) => {
    const val = data[0]?.value || 0;
    const gaugeData = [
        { name: 'count', value: val, color: GMR.green },
        { name: 'remaining', value: Math.max(0, 100 - val), color: GMR.grid }
    ];
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={gaugeData}
                    cx="50%"
                    cy="80%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius="65%"
                    outerRadius="90%"
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={true}
                    animationDuration={1500}
                >
                    {gaugeData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                    ))}
                    <Label
                        value={`${val.toFixed(1)}%`}
                        position="centerBottom"
                        style={{ fontSize: '28px', fontWeight: 900, fill: GMR.slate, fontFamily: 'Inter' }}
                        dy={-25}
                    />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
        </ResponsiveContainer>
    );
};

const BoxPlotVariant = ({ data }) => {
    const rawKeys = Object.keys(data[0] || {}).filter(k => k !== 'name' && k !== 'color' && typeof data[0][k] === 'number');
    const keys = (rawKeys.length > 1 && rawKeys.includes('value')) ? rawKeys.filter(k => k !== 'value') : rawKeys;
    if (keys.length === 0 && !rawKeys.includes('value')) keys.push('value');
    if (keys.length === 0 && rawKeys.includes('value')) keys.push('value');

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 35, right: 30, left: 20, bottom: 20 }}>
                <defs>
                    {keys.map((key, i) => (
                        <linearGradient key={key} id={`boxplot-grad-${slugify(key)}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={getColor(key, i)} stopOpacity={1} />
                            <stop offset="100%" stopColor={getColor(key, i)} stopOpacity={0.6} />
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GMR.grid} />
                <XAxis dataKey="name" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderCustomLegend} verticalAlign="top" />
                {keys.map((key, i) => (
                    <Bar 
                        key={key}
                        dataKey={key} 
                        fill={`url(#boxplot-grad-${slugify(key)})`} 
                        stroke={getColor(key, i)} 
                        radius={[6, 6, 6, 6]} 
                        barSize={32} 
                        isAnimationActive={true}
                    >
                        <LabelList dataKey={key} position="top" style={{ fill: getColor(key, i), fontWeight: 800, fontSize: 11 }} formatter={formatValue} />
                    </Bar>
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

const FunnelVariant = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 20, right: 60, left: 40, bottom: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={AXIS_STYLE} axisLine={false} tickLine={false} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderCustomLegend} verticalAlign="top" />
                <Bar dataKey={Object.keys(data[0]).find(k => k !== 'name' && k !== 'color') || 'value'} fill={GMR.orange} stroke={GMR.orange} radius={[0, 12, 12, 0]} barSize={28} isAnimationActive={true}>
                    <LabelList dataKey={Object.keys(data[0]).find(k => k !== 'name' && k !== 'color') || 'value'} position="right" style={{ fill: GMR.orange, fontWeight: 900, fontSize: 12 }} offset={10} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

const ParetoVariant = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 35, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GMR.grid} />
                <XAxis dataKey="name" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={AXIS_STYLE} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderCustomLegend} verticalAlign="top" />
                <Bar yAxisId="left" name="Value" dataKey={Object.keys(data[0]).find(k => k !== 'name' && k !== 'color' && k !== 'cumulative' && k !== 'value') || 'value'} fill={GMR.blue} stroke={GMR.blue} radius={[6, 6, 0, 0]} barSize={32} isAnimationActive={true} />
                <Line yAxisId="right" name="Cumulative %" type="monotone" dataKey="cumulative" stroke={GMR.orange} strokeWidth={4} dot={{ fill: GMR.orange, r: 5, strokeWidth: 0 }} isAnimationActive={true} />
            </BarChart>
        </ResponsiveContainer>
    );
};

const DualAxisVariant = ({ data, chartName }) => {
    const rawKeys = Object.keys(data[0] || {}).filter(k => k !== 'name' && k !== 'color');
    const keys = (rawKeys.length > 1 && rawKeys.includes('value')) ? rawKeys.filter(k => k !== 'value') : rawKeys;
    const chartId = slugify(chartName || 'dual-axis');
    
    // Auto-detect left vs right axis based on keywords
    const leftMetric = keys.find(k => k.toLowerCase().includes('installation')) || keys[0];
    const rightMetric = keys.find(k => k !== leftMetric && (k.toLowerCase().includes('productivity') || k.toLowerCase().includes('stock') || k.toLowerCase().includes('agency') || k.toLowerCase().includes('team'))) || keys[1];

    if (!leftMetric || !rightMetric) return <BarVariant data={data} />;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 35, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GMR.grid} />
                <XAxis dataKey="name" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={formatValue}>
                    <Label value={leftMetric} angle={-90} position="insideLeft" style={{ ...AXIS_STYLE, fontSize: 10, textAnchor: 'middle' }} offset={10} />
                </YAxis>
                <YAxis yAxisId="right" orientation="right" tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={formatValue}>
                    <Label value={rightMetric} angle={90} position="insideRight" style={{ ...AXIS_STYLE, fontSize: 10, textAnchor: 'middle' }} offset={10} />
                </YAxis>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderCustomLegend} verticalAlign="top" />
                
                {/* Metric 1: Volume (Bar) */}
                <Bar 
                    yAxisId="left" 
                    dataKey={leftMetric} 
                    fill={getColor(leftMetric, 0)} 
                    fillOpacity={0.8}
                    radius={[4, 4, 0, 0]} 
                    barSize={32}
                    animationDuration={1500}
                />
                
                {/* Metric 2: Efficiency/Ratio (Line) */}
                <Line 
                    yAxisId="right" 
                    type="monotone"
                    dataKey={rightMetric} 
                    stroke={getColor(rightMetric, 1)} 
                    strokeWidth={4} 
                    dot={{ fill: getColor(rightMetric, 1), r: 6, strokeWidth: 0 }} 
                    isAnimationActive={true}
                    animationDuration={2000}
                />

                {/* Additional metrics (if any) go to right axis as simple lines */}
                {keys.filter(k => k !== leftMetric && k !== rightMetric).map((key, i) => (
                    <Line 
                        key={key}
                        yAxisId="right" 
                        type="monotone"
                        dataKey={key}
                        stroke={getColor(key, i + 2)}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={true}
                    />
                ))}
            </ComposedChart>
        </ResponsiveContainer>
    );
};

const SmartChart = ({ data, hint, name, isDetailed = false }) => {
    if (!data || !data.length) {
        return (
            <div className="h-full flex items-center justify-center text-gray-300 text-sm italic">
                No data available
            </div>
        );
    }

    const variant = hint || detectVariant(data, name);

    // Dynamic width calculation for horizontal scrolling on dense datasets
    // Only enable scrolling if isDetailed is true
    const isTrend = ['area', 'multi-area', 'multi-line', 'bar', 'dual-axis'].includes(variant);
    const minWidth = (isDetailed && isTrend && data.length > 20) ? `${data.length * 35}px` : '100%';

    // Helper to inject isDetailed into variants
    const renderVariant = () => {
        const commonProps = { 
            data, 
            xLabel: "Time Period", 
            yLabel: "Value",
            chartName: name, // Pass name to make gradient IDs unique
            // In optimized mode, we show fewer labels. Recharts 'interval' handles this.
            // If isDetailed is false, we set interval to show fewer ticks.
            interval: isDetailed ? 0 : (data.length > 10 ? Math.floor(data.length / 5) : 'auto')
        };

        switch (variant) {
            case 'area': return <AreaVariant {...commonProps} />;
            case 'multi-area': return <AreaVariant {...commonProps} isMulti />;
            case 'multi-line': return <MultiLineVariant {...commonProps} />;
            case 'donut': return <DonutVariant data={data} />;
            case 'hbar': return <HBarVariant data={data} xLabel="Count" yLabel="Category" />;
            case 'bar': return <BarVariant {...commonProps} xLabel="Classification" yLabel="Total Count" />;
            case 'gauge': return <GaugeVariant data={data} />;
            case 'boxplot': return <BoxPlotVariant data={data} />;
            case 'funnel': return <FunnelVariant data={data} />;
            case 'pareto': return <ParetoVariant data={data} />;
            case 'dual-axis': return <DualAxisVariant data={data} />;
            default: return null;
        }
    };

    return (
        <div className={`h-full w-full font-sans ${isDetailed ? 'overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent' : 'overflow-hidden'}`}>
            <div style={{ width: minWidth, height: '100%', minHeight: isDetailed ? '400px' : '300px' }}>
                {renderVariant()}
            </div>
        </div>
    );
};

export default SmartChart;
