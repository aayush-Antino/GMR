export const GMR = {
    blue: '#2563eb',    // Stronger Corporate Blue
    green: '#059669',   // Emerald Green
    orange: '#ea580c',  // Deep Orange
    purple: '#7c3aed',  // Royal Purple
    pink: '#db2777',    // Vibrant Pink
    slate: '#1e293b',   // Darker Text
    grid: '#f1f5f9',    // Soft Grid
    bg: 'rgba(255, 255, 255, 0.8)',
};

export const GMR_PALETTE = [GMR.blue, GMR.green, GMR.orange, GMR.purple, GMR.pink];

export const KEY_COLORS = {
    'inventory': GMR.blue,
    'total installed': GMR.green,
    'cumulative sat': GMR.orange,
    'critical': '#dc2626',
    'major': '#f59e0b',
    'minor': '#10b981',
    'high': '#dc2626',
    'medium': '#f59e0b',
    'low': '#10b981',
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

export const detectVariant = (data, name) => {
    if (!data || !data.length) return 'bar';
    const kpiName = (name || '').toLowerCase();

    // 1. Keyword Overrides
    if (kpiName.includes('ageing') || kpiName.includes('closure avg. time') || kpiName.includes('avg time')) return 'boxplot';
    if (kpiName.includes('rca') || kpiName.includes('pareto')) return 'pareto';
    if (kpiName.includes('funnel') || kpiName.includes('workflow')) return 'funnel';
    if (kpiName.includes('utilization') || kpiName.includes('never / non-comm')) return 'gauge';
    if (kpiName.includes('pace vs stock') || kpiName.includes('vs stock')) return 'dual-axis';

    // 2. Data Shape detection
    const sample = data[0];
    const keys = Object.keys(sample);

    if (keys.includes('avg')) return 'boxplot';
    if (keys.includes('cumulative')) return 'pareto';
    if (keys.includes('installations') && keys.includes('stock')) return 'dual-axis';
    if (data.length <= 4 && keys.includes('color')) return 'donut';
    if (data.length > 8) return 'hbar';

    return 'bar';
};
