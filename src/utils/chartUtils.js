export const GMR = {
    blue: '#2563eb',    // Stronger Corporate Blue
    green: '#059669',   // Emerald Green
    orange: '#ea580c',  // Deep Orange
    purple: '#7c3aed',  // Royal Purple
    pink: '#db2777',    // Vibrant Pink
    slate: '#1e293b',   // Darker Text
    grid: '#f1f5f9',    // Soft Grid
    bg: 'rgba(255, 255, 255, 0.8)',
    yellow: '#fbbf24',  // Amber/Yellow
    red: '#ef4444',     // Red
};

export const GMR_PALETTE = [GMR.blue, GMR.green, GMR.orange, GMR.purple, GMR.pink, GMR.yellow, GMR.red];

export const KEY_COLORS = {
    'total monthly installations': GMR.blue,
    'total installed': GMR.green,
    'cumulative sat': GMR.orange,
    'critical': '#dc2626',
    'major': '#f59e0b',
    'minor': '#10b981',
    'high': '#dc2626',
    'medium': '#f59e0b',
    'low': '#10b981',
    'count': GMR.blue,
    'value': GMR.blue,
    'consumer': '#2563eb', // Blue
    'dt': '#fbbf24',       // Yellow
    'feeder': '#ef4444',   // Red
    'mi installed': GMR.orange,
    'sat done': GMR.green,
    'invoiced': GMR.purple,
    'burnt': '#ef4444',
    'faulty': '#fbbf24',
    'others': '#64748b',
    'daily installations': GMR.blue,
    'total installations': GMR.blue,
    'installations': GMR.blue,
    'closed tickets': GMR.green,
    'open tickets': GMR.orange,
    'closed': GMR.green,
    'open': GMR.orange,
    'pace': GMR.blue,
    'revenue': GMR.purple,
    'installed': GMR.green,
    'remaining': '#94a3b8',
    'inventory': GMR.blue,
    'total inventory': GMR.blue,
    'remaining stock': GMR.orange,
    'utilization rate': GMR.purple,
    'stock': GMR.blue,
    'productivity': GMR.yellow,
    'agencies': GMR.red,
    'teams': GMR.red,
    'active days': GMR.red,
    'active_days': GMR.red,
    '0-30 days': GMR.green,
    '31-60 days': GMR.yellow,
    '61-90 days': GMR.orange,
    '90+ days': GMR.red,
};

export const getColor = (key, index) => {
    if (!key) return GMR_PALETTE[index % GMR_PALETTE.length];
    const k = key.toLowerCase().trim();
    if (KEY_COLORS[k]) return KEY_COLORS[k];
    return GMR_PALETTE[index % GMR_PALETTE.length];
};

export const AXIS_STYLE = {
    fontSize: 10,
    fontWeight: 700,
    fill: '#64748b',
    fontFamily: 'Inter, sans-serif',
};

export const TOOLTIP_STYLE = {
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    fontSize: '12px',
    fontWeight: 600,
    padding: '12px',
    color: '#1e293b',
};

const isDate = (val) => {
    if (typeof val !== 'string') return false;
    // Basic date patterns: YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY, Monthly/Daily formats
    // Also handles week patterns like YYYY-W## or YYYY-Www
    const dateRegex = /^(\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4}|\d{2}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}\/\d{2}\/\d{2}|\d{4}-\d{2}|\d{4}-W\d{1,2}|[a-zA-Z]{3}[-\s]\d{2,4})$/i;
    return dateRegex.test(val);
};

export const detectVariant = (data, name) => {
    if (!data || !data.length) return 'bar';
    const kpiName = (name || '').toLowerCase();

    // 1. Keyword Overrides
    if (kpiName.includes('ageing') || kpiName.includes('closure avg. time') || kpiName.includes('avg time')) return 'boxplot';
    if (kpiName.includes('rca') || kpiName.includes('pareto')) return 'pareto';
    if (kpiName.includes('funnel') || kpiName.includes('workflow')) return 'funnel';
    
    // Utilization: gauge for single value summary, bar/area for trends/categories
    if (kpiName.includes('utilization') || kpiName.includes('never / non-comm')) {
        if (data.length > 1) return (isDate(data[0].name) ? (data.length > 25 ? 'area' : 'bar') : 'bar');
        return 'gauge';
    }

    // Pace vs Stock and other vs trends
    if (kpiName.includes('pace vs stock') || kpiName.includes('vs stock')) {
        return isDate(data[0].name) ? (data.length > 25 ? 'area' : 'bar') : 'hbar';
    }
    
    // Productivity: HBar for categories/teams, Bar/Area for trends
    if (kpiName.includes('productivity')) {
        return isDate(data[0].name) ? (data.length > 25 ? 'area' : 'bar') : 'hbar';
    }

    // 2. Data Shape detection
    const sample = data[0];
    const keys = Object.keys(sample);

    if (keys.includes('avg')) return 'boxplot';
    if (keys.includes('cumulative')) return 'pareto';
    const lowerKeys = keys.map(k => k.toLowerCase());
    if (lowerKeys.includes('installations') && (lowerKeys.includes('stock') || lowerKeys.includes('productivity'))) return 'dual-axis';
    if (data.length <= 4 && keys.includes('color')) return 'donut';
    
    // Time-series data (dates or weeks) - always vertical bar or area, never hbar
    if (isDate(sample.name)) {
        return data.length > 25 ? 'area' : 'bar';
    }

    if (data.length > 8) return 'hbar';

    return 'bar';
};
