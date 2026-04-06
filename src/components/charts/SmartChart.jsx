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
import { GMR, AXIS_STYLE, TOOLTIP_STYLE, detectVariant, getColor } from '../../utils/chartUtils';

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

const AreaVariant = ({ data, isMulti, xLabel, yLabel, interval: propInterval }) => {
    const keys = Object.keys(data[0]).filter(k => k !== 'name' && k !== 'color');
    
    // Dynamic interval to keep labels readable
    const interval = propInterval !== undefined ? propInterval : (data.length > 60 ? Math.floor(data.length / 6) : 'auto');

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
                        strokeWidth={data.length > 100 ? 1.5 : 3} // Thinner line for very high density
                        fill={`url(#grad-${key})`}
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
                    dataKey={Object.keys(data[0]).find(k => k !== 'name' && k !== 'color') || 'value'}
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
    const isDense = data.length > 15;
    const barSize = isDense ? Math.max(6, Math.min(12, 400 / data.length)) : 16;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 35, right: 80, left: 20, bottom: 20 }} barGap={2}>
                <defs>
                    {keys.map((key, i) => (
                        <linearGradient key={key} id={`hbar-grad-${key}`} x1="0" y1="0" x2="1" y2="0">
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
                    width={isDense ? 80 : 120}
                    interval={data.length > 50 ? Math.floor(data.length / 10) : (isDense ? 'preserveStartEnd' : 0)}
                >
                    <Label value={yLabel} angle={-90} position="insideLeft" style={{ ...AXIS_STYLE, fontSize: 10, textAnchor: 'middle' }} offset={10} />
                </YAxis>
                <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} content={<CustomTooltip />} />
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
                        fill={`url(#hbar-grad-${key})`}
                        radius={[0, 4, 4, 0]}
                        barSize={barSize}
                        isAnimationActive={true}
                        animationDuration={1500}
                    >
                        <LabelList
                            dataKey={key}
                            position="insideRight"
                            fill="#fff"
                            fontSize={barSize < 6 ? 0 : 7}
                            fontWeight={700}
                            offset={8}
                            formatter={formatValue}
                        />
                    </Bar>
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

const BarVariant = ({ data, xLabel, yLabel, interval: propInterval }) => {
    const keys = Object.keys(data[0]).filter(k => k !== 'name' && k !== 'color');
    const isDense = data.length > 10;
    const barSize = isDense ? Math.max(12, 300 / data.length) : 32;
    const interval = propInterval !== undefined ? propInterval : (data.length > 30 ? Math.floor(data.length / 8) : (isDense ? 'preserveStartEnd' : 0));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 35, right: 10, left: 10, bottom: 20 }} barGap={8}>
                <defs>
                    {keys.map((key, i) => (
                        <linearGradient key={key} id={`bar-grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={getColor(key, i)} stopOpacity={1} />
                            <stop offset="100%" stopColor={getColor(key, i)} stopOpacity={0.7} />
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
                <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} content={<CustomTooltip />} />
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
                        fill={`url(#bar-grad-${key})`}
                        radius={[6, 6, 0, 0]}
                        barSize={barSize}
                        isAnimationActive={true}
                        animationDuration={1500}
                    >
                        <LabelList
                            dataKey={key}
                            position="insideTop"
                            fill="#fff"
                            fontSize={barSize < 8 ? 0 : 7}
                            fontWeight={700}
                            formatter={formatValue}
                            offset={10}
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
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                    <linearGradient id="boxplot-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={GMR.blue} stopOpacity={1} />
                        <stop offset="100%" stopColor={GMR.blue} stopOpacity={0.6} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GMR.grid} />
                <XAxis dataKey="name" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avg" fill="url(#boxplot-grad)" radius={[6, 6, 6, 6]} barSize={32} isAnimationActive={true}>
                    <LabelList dataKey="avg" position="top" style={{ fill: GMR.blue, fontWeight: 800, fontSize: 11 }} />
                </Bar>
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
                <Bar dataKey={Object.keys(data[0]).find(k => k !== 'name' && k !== 'color') || 'value'} fill={GMR.orange} radius={[0, 12, 12, 0]} barSize={28} isAnimationActive={true}>
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
                <Bar yAxisId="left" dataKey={Object.keys(data[0]).find(k => k !== 'name' && k !== 'color' && k !== 'cumulative') || 'value'} fill={GMR.blue} radius={[6, 6, 0, 0]} barSize={32} isAnimationActive={true} />
                <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke={GMR.orange} strokeWidth={4} dot={{ fill: GMR.orange, r: 5, strokeWidth: 0 }} isAnimationActive={true} />
            </BarChart>
        </ResponsiveContainer>
    );
};

const DualAxisVariant = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 35, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GMR.grid} />
                <XAxis dataKey="name" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" iconType="circle" wrapperStyle={{ top: -20, paddingBottom: 20 }} />
                <Line yAxisId="left" dataKey="installations" stroke={GMR.green} strokeWidth={4} dot={{ fill: GMR.green, r: 5, strokeWidth: 0 }} isAnimationActive={true} />
                <Line yAxisId="right" dataKey="stock" stroke={GMR.blue} strokeWidth={4} strokeDasharray="6 6" dot={{ fill: GMR.blue, r: 5, strokeWidth: 0 }} isAnimationActive={true} />
            </LineChart>
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
