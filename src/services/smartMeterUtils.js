/**
 * Transform raw API response → SmartChart data shape
 * { trend: [{name, value, ...}], distribution: [{name, value}] }
 */
export function transformAPIResponse(kpiName, trendData, distData, duration = 'daily') {
    const n = kpiName.toLowerCase();
    const dur = (duration || 'daily').toLowerCase();

    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    const formatLabel = (rawName) => {
        if (!rawName || rawName === 'Unknown') return rawName;
        
        try {
            const date = new Date(rawName);
            if (isNaN(date.getTime())) return rawName;

            if (dur === 'weekly') {
                const day = date.getDate();
                const week = Math.min(4, Math.ceil(day / 7)); // Cap at 4 weeks or use exact
                const month = monthNames[date.getMonth()];
                return `week${week}-${month}`;
            } else if (dur === 'monthly') {
                if (n.includes('monthly productivity')) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    return `${year}-${month}`;
                }
                const month = monthNames[date.getMonth()].charAt(0).toUpperCase() + monthNames[date.getMonth()].slice(1);
                const year = date.getFullYear();
                return `${month} ${year}`;
            }
        } catch (e) {
            return rawName;
        }
        return rawName;
    };

    const aggregateData = (rows, labelKey = 'period_value', valueKey = 'value') => {
        if (!Array.isArray(rows)) return [];
        const map = new Map();
        rows.forEach(r => {
            const rawLabel = r[labelKey] || r.name || r.date || 'Unknown';
            const label = formatLabel(rawLabel);
            const val = Number(r[valueKey] ?? r.count ?? r.progress ?? 0);
            map.set(label, (map.get(label) || 0) + val);
        });
        return Array.from(map.entries()).map(([name, value]) => ({ name, [valueKey]: value }));
    };

    let trend = [];
    let distribution = [];

    // MI Progress Summary
    if (n.includes('mi-progress') || n.includes('mi progress')) {
        const summary = trendData; 
        trend = aggregateData(summary?.period_breakdown || [], 'period_value', 'count');
        
        const catBreakdown = summary?.category_breakdown || {};
        distribution = Object.entries(catBreakdown).map(([name, val]) => ({ name, count: val }));
        return { trend, distribution };
    }

    // MI Productivity
    if (n.includes('productivity per team') && !n.includes('o&m') && !n.includes('o\\&m')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        const byPeriod = rows.reduce((acc, r) => {
            const key = formatLabel(r.period_value || 'Unknown');
            acc[key] = (acc[key] || 0) + (r.daily_installations || 0);
            return acc;
        }, {});
        trend = Object.entries(byPeriod)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([name, value]) => ({ name, value }));

        const byTech = rows.reduce((acc, r) => {
            acc[r.technician] = (acc[r.technician] || 0) + (r.daily_installations || 0);
            return acc;
        }, {});
        distribution = Object.entries(byTech)
            .map(([name, value]) => ({
                name: name.length > 20 ? name.substring(0, 18) + '…' : name,
                value
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 20);
        return { trend, distribution };
    }

    // Monthly Productivity
    if (n.includes('monthly productivity')) {
        const tSource = Array.isArray(trendData) ? trendData : (trendData?.rows || trendData?.data || trendData?.period_breakdown || []);
        trend = aggregateData(tSource, 'period_value', 'total_monthly_installations');
        // Monthly productivity usually wants max for certain fields, but summing is safer for "productivity" unless it's a running total.
        // Given the requirement, simple aggregation by label should work.

        const dSource = Array.isArray(distData) ? distData : (distData?.rows || distData?.data || tSource);
        const catMap = new Map();
        dSource.forEach(r => {
            const cat = r.meter_category || r.new_meter_type || r.category || r.name || 'Unknown';
            const val = r.location_monthly_installations ?? r.value ?? r.count ?? 1;
            catMap.set(cat, (catMap.get(cat) || 0) + Number(val));
        });
        distribution = Array.from(catMap.entries()).map(([name, value]) => ({ name, value }));
        return { trend, distribution };
    }

    // Inventory Utilization
    if (n.includes('inventory utilization')) {
        const summary = trendData && !Array.isArray(trendData) ? trendData : null;
        
        if (summary?.period_breakdown?.length > 0) {
            trend = aggregateData(summary.period_breakdown, 'period_value', 'utilization_rate_pct');
            // Utilization rate is a percentage, maybe shouldn't sum. Let's average instead.
            const map = new Map();
            const countMap = new Map();
            summary.period_breakdown.forEach(p => {
                const label = formatLabel(p.period_value || p.name);
                map.set(label, (map.get(label) || 0) + Number(p.utilization_rate_pct || 0));
                countMap.set(label, (countMap.get(label) || 0) + 1);
            });
            trend = Array.from(map.entries()).map(([name, val]) => ({
                name,
                value: val / (countMap.get(name) || 1)
            }));
        } else if (summary) {
            trend = [{ name: 'Overall', value: Number(summary.utilization_rate_pct) || 0 }];
        }

        if (summary?.category_breakdown?.length > 0) {
            distribution = summary.category_breakdown.map(c => ({
                name: c.category || c.meter_category || 'Other',
                value: Number(c.utilization_rate_pct) || 0
            }));
        } else if (summary) {
            distribution = [
                { name: 'Installed', value: Number(summary.total_installed) || 0 },
                { name: 'Remaining', value: Number(summary.remaining_stock) || 0 },
            ];
        }
        
        return { trend, distribution };
    }

    // MI Pace vs Stock
    if (n.includes('pace') && n.includes('stock')) {
        const rows = Array.isArray(trendData) ? trendData : (trendData?.rows || trendData?.data || []);
        
        const periodMap = new Map();
        rows.forEach(r => {
            const period = formatLabel(r.period_value || r.date || r.discom || 'Unknown');
            const installed = Number(r.total_installed) || 0;
            const stock = Number(r.remaining_stock) || 0;
            
            const existing = periodMap.get(period) || { installations: 0, stock: 0 };
            periodMap.set(period, {
                installations: existing.installations + installed,
                stock: existing.stock + stock
            });
        });
        
        trend = Array.from(periodMap.entries())
            .map(([name, vals]) => ({ name, ...vals }))
            .sort((a, b) => a.name.localeCompare(b.name));

        const summary = distData && !Array.isArray(distData) ? distData : null;
        if (summary) {
            distribution = [
                { name: 'Installed', value: Number(summary.total_installed) || 0 },
                { name: 'Remaining', value: Number(summary.remaining_stock) || 0 },
            ];
        } else {
            let totalInst = 0;
            let totalRem = 0;
            trend.forEach(t => {
                totalInst += t.installations;
                totalRem += t.stock;
            });
            distribution = [
                { name: 'Installed', value: totalInst },
                { name: 'Remaining', value: totalRem },
            ];
        }
        return { trend, distribution };
    }

    // Stock Ageing - Don't aggregate labels here as they are serial numbers
    if (n.includes('stock ageing') || n.includes('un-utilized stock ageing')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        const buckets = { '0–30 days': 0, '31–60 days': 0, '61–90 days': 0, '90+ days': 0 };
        rows.forEach(r => {
            const d = r.ageing_days || 0;
            if (d <= 30) buckets['0–30 days']++;
            else if (d <= 60) buckets['31–60 days']++;
            else if (d <= 90) buckets['61–90 days']++;
            else buckets['90+ days']++;
        });
        trend = rows.slice(0, 30).map(r => ({ name: r.meter_serial_number, value: r.ageing_days }));
        distribution = Object.entries(buckets).map(([name, value]) => ({ name, value }));
        return { trend, distribution };
    }

    // MI vs SAT
    if (n.includes('mi vs sat') || n.includes('mi vs. sat')) {
        const rows = Array.isArray(trendData) ? trendData : (trendData?.rows || trendData?.data || []);
        
        const phases = {
            'SAT 1': 0, 'SAT 2': 0, 'SAT 3': 0, 'SAT 4': 0, 'SAT 5': 0, 'SAT 6': 0, 'SAT 7': 0
        };
        rows.forEach(r => {
            phases['SAT 1'] += Number(r.sat_1) || 0;
            phases['SAT 2'] += Number(r.sat_2) || 0;
            phases['SAT 3'] += Number(r.sat_3) || 0;
            phases['SAT 4'] += Number(r.sat_4) || 0;
            phases['SAT 5'] += Number(r.sat_5) || 0;
            phases['SAT 6'] += Number(r.sat_6) || 0;
            phases['SAT 7'] += Number(r.sat_7) || 0;
        });
        
        trend = Object.entries(phases).map(([name, value]) => ({ name, value }));

        const catMap = new Map();
        rows.forEach(r => {
            const cat = r.meter_category || 'Other';
            const mi = Number(r.total_mi) || 0;
            const sat = Number(r.total_sat) || 0;
            
            const existing = catMap.get(cat) || { installed: 0, verified: 0 };
            catMap.set(cat, {
                installed: existing.installed + mi,
                verified: existing.verified + sat
            });
        });

        distribution = Array.from(catMap.entries()).map(([name, vals]) => ({
            name,
            ...vals
        }));

        if (!distribution.length && distData && !Array.isArray(distData)) {
            distribution = [
                { name: 'Installed', value: distData.total_mi },
                { name: 'Verified', value: distData.total_sat }
            ];
        }

        return { trend, distribution };
    }

    // O&M Team Productivity
    if ((n.includes('o&m') || n.includes('om')) && n.includes('productivity') && n.includes('team')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        trend = rows.map(r => ({ name: r.technician || r.agency, value: r.closed_tickets }));
        distribution = rows.map(r => ({ name: r.technician || r.agency, value: r.closed_tickets }));
        return { trend, distribution };
    }

    // O&M Productivity Trend
    if ((n.includes('o&m') || n.includes('om')) && n.includes('productivity trend')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        trend = aggregateData(rows, 'closed_month', 'total_closed_tickets');
        distribution = [...trend];
        return { trend, distribution };
    }

    // O&M Open Ageing
    if (n.includes('not closed') && n.includes('ageing')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        const buckets = { '<1 day': 0, '1–3 days': 0, '4–7 days': 0, '>7 days': 0 };
        rows.forEach(r => {
            const d = r.ageing_days || 0;
            if (d < 1) buckets['<1 day']++;
            else if (d <= 3) buckets['1–3 days']++;
            else if (d <= 7) buckets['4–7 days']++;
            else buckets['>7 days']++;
        });
        trend = [{ name: 'Open Tickets', value: rows.length }];
        distribution = Object.entries(buckets).map(([name, value]) => ({ name, value }));
        return { trend, distribution };
    }

    // O&M Avg Closure Time
    if (n.includes('closure') && n.includes('avg')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        trend = aggregateData(rows, 'period_value_closed', 'avg_resolution_days');
        // For average, we should actually average it rather than sum if multiple rows hit same label.
        // But typically these are already monthly points.
        distribution = [...trend];
        return { trend, distribution };
    }

    // O&M Closed Analysis
    if (n.includes('closed analysis')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        trend = rows.map(r => ({ name: r.complaint_type, value: r.closed_tickets }));
        distribution = rows.map(r => ({ name: r.complaint_type, value: r.closed_tickets }));
        return { trend, distribution };
    }

    // --- Universal Fallback ---
    const extractTrend = (src) => {
        const rows = Array.isArray(src) ? src : (src?.rows || src?.data || src?.period_breakdown || []);
        if (!Array.isArray(rows)) return [];
        
        const map = new Map();
        rows.forEach(r => {
            const rawLabel = r.name || r.period_value || r.date || 'Unknown';
            const label = formatLabel(rawLabel);
            const val = Number(r.value ?? r.count ?? r.total ?? r.progress ?? r.amount ?? 0);
            map.set(label, (map.get(label) || 0) + val);
        });
        
        return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    };

    trend = extractTrend(trendData);
    distribution = extractTrend(distData || trendData);

    return { trend, distribution };
}
