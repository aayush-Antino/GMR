/**
 * Transform raw API response → SmartChart data shape
 * { trend: [{name, value, ...}], distribution: [{name, value}] }
 */
export function transformAPIResponse(kpiName, trendData, distData, params = {}) {
    const n = kpiName.toLowerCase();
    const duration = typeof params === 'string' ? params : (params.period || 'daily');
    const dur = duration.toLowerCase();

    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    const formatLabel = (rawName) => {
        if (!rawName || rawName === 'Unknown') return rawName;
        
        try {
            let date;
            // Robust parsing for DD-MM-YY or DD-MM-YYYY formats
            if (typeof rawName === 'string' && /^\d{2}-\d{2}-\d{2}(\d{2})?$/.test(rawName)) {
                const parts = rawName.split('-');
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10);
                let year = parseInt(parts[2], 10);
                if (year < 100) year += 2000;
                date = new Date(year, month - 1, day);
            } else {
                date = new Date(rawName);
            }

            if (isNaN(date.getTime())) return rawName;

            if (dur === 'weekly') {
                const day = date.getDate();
                const week = Math.min(4, Math.ceil(day / 7));
                const month = monthNames[date.getMonth()];
                return `week${week}-${month}`;
            } else if (dur === 'monthly') {
                const year = date.getFullYear();
                const month = monthNames[date.getMonth()].charAt(0).toUpperCase() + monthNames[date.getMonth()].slice(1);
                return `${month} ${year}`;
            } else {
                // Default / Daily: Standardize to YYYY-MM-DD to align with fillDateGaps utility
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, '0');
                const d = String(date.getDate()).padStart(2, '0');
                return `${y}-${m}-${d}`;
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

    const aggregateGeographically = (rows, valueKey = 'value') => {
        if (!Array.isArray(rows)) return [];
        
        // Context-aware grouping level
        let groupKey = 'project';
        if (params.project && params.project !== 'All') groupKey = 'zone';
        if (params.zone && params.zone !== 'All') groupKey = 'circle';
        
        const map = new Map();
        rows.forEach(r => {
            const label = r[groupKey] || 'Other';
            let val;
            if (valueKey === 'utilization_rate_pct' || valueKey === 'productivity') {
                val = r[valueKey];
            } else {
                val = r[valueKey] ?? r.total_meters_installed ?? r.total_mi ?? r.meter_count ?? r.count ?? r.amount ?? r.value;
            }
            map.set(label, (map.get(label) || 0) + (Number(val) || 0));
        });
        
        return Array.from(map.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    };

    /**
     * Flattens 2-level nested breakdown: { cat: { subcat: { metrics } } }
     * to: [ { name: "cat - subcat", values... } ]
     */
    const flattenNestedBreakdown = (breakdown) => {
        if (!breakdown || typeof breakdown !== 'object') return [];
        const result = [];
        Object.entries(breakdown).forEach(([cat, subcats]) => {
            if (typeof subcats === 'object' && subcats !== null) {
                Object.entries(subcats).forEach(([subcat, metrics]) => {
                    const name = `${cat} - ${subcat}`;
                    if (typeof metrics === 'object' && metrics !== null) {
                        result.push({ name, ...metrics });
                    } else {
                        result.push({ name, value: metrics });
                    }
                });
            }
        });
        return result;
    };

    let trend = [];
    let distribution = [];

    const getCategoryData = (obj, key) => {
        if (!obj || typeof obj !== 'object') return null;
        const sel = String(key).toUpperCase();
        const match = Object.keys(obj).find(k => k.toUpperCase() === sel);
        if (match) return obj[match];
        if (sel === 'DT') {
            const dtrMatch = Object.keys(obj).find(k => k.toUpperCase() === 'DTR');
            return dtrMatch ? obj[dtrMatch] : null;
        }
        return null;
    };

    const sumDeep = (obj) => {
        if (!obj || typeof obj !== 'object') return Number(obj) || 0;
        return Object.values(obj).reduce((a, b) => a + (typeof b === 'object' ? sumDeep(b) : (Number(b) || 0)), 0);
    };

    // MI Progress (New Dashboard Endpoint)
    if (n.includes('mi-progress') || n.includes('mi progress')) {
        const dashboardData = trendData; // Since shared: true
        
        // 1. Trend Analysis
        if (Array.isArray(dashboardData?.trend)) {
            const selCategory = (params?.category || params?.meter_category || 'total').toUpperCase();
            
            trend = dashboardData.trend.map(node => {
                const label = formatLabel(node.period_value);
                const point = { name: label };
                
                if (selCategory === 'TOTAL') {
                    point.Consumer = node.CONSUMER || 0;
                    point.Feeder = node.FEEDER || 0;
                    point.DT = node.DT || 0;
                } else {
                    // Only return the selected category series, others are 0 (as per requirement)
                    point.Consumer = selCategory === 'CONSUMER' ? node.CONSUMER || 0 : 0;
                    point.Feeder = selCategory === 'FEEDER' ? node.FEEDER || 0 : 0;
                    point.DT = selCategory === 'DT' || selCategory === 'DTR' ? (node.DT || node.DTR || 0) : 0;
                }
                return point;
            });
        }
        
        // 2. Comparison (Geographical/Cluster)
        if (Array.isArray(dashboardData?.comparison)) {
            const project = (params?.project || 'all').toLowerCase();
            const level = (params?.level_by || params?.level || 'discom').toLowerCase();
            
            distribution = dashboardData.comparison.map(node => {
                let label = node.label || 'Unknown';
                
                // Behavior Note: Prefix labels if project=all and level is more granular than discom
                if (project === 'all' && level !== 'discom' && node.project_prefix) {
                    label = `${node.project_prefix} | ${label}`;
                }

                return {
                    name: label,
                    Consumer: node.CONSUMER || 0,
                    Feeder: node.FEEDER || 0,
                    DT: node.DT || 0
                };
            });
        }
        
        return { trend, distribution };
    }

    // MI Productivity per Team (New Dashboard Endpoint)
    if (n.includes('productivity per team') && !n.includes('o&m') && !n.includes('o\\&m')) {
        const dashboardData = trendData; // Since shared: true
        const project = (params?.project || 'all').toLowerCase();
        const level = (params?.level_by || params?.level || 'discom').toLowerCase();

        // 1. Trend Analysis
        if (Array.isArray(dashboardData?.trend)) {
            trend = dashboardData.trend.map(node => {
                const label = formatLabel(node.date || node.period_value);
                
                return {
                    name: label,
                    Productivity: node.productivity_per_agency_per_day || 0,
                    Installations: node.total_installations || 0,
                    Agencies: node.active_agencies || 0
                };
            });
        }

        // 2. Comparison (Geographical/Cluster)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => {
                let label = node.label || 'Unknown';
                
                // Behavior Note: Prefix labels if project=all and level is more granular than project/discom
                if (project === 'all' && level !== 'project' && level !== 'discom' && node.project_prefix) {
                    label = `${node.project_prefix} | ${label}`;
                }

                return {
                    name: label,
                    Productivity: node.productivity_per_agency_per_day || 0,
                    Installations: node.total_installations || 0,
                    Teams: node.active_agencies || 0
                };
            });
        }

        return { trend, distribution, summary: dashboardData?.summary, insights: dashboardData?.insights };
    }

    // Monthly Productivity Trend (New Dashboard Endpoint)
    if (n.includes('monthly productivity')) {
        const dashboardData = trendData; // Since shared: true
        
        // 1. Trend Analysis
        if (Array.isArray(dashboardData?.monthly_productivity_trend)) {
            trend = dashboardData.monthly_productivity_trend.map(node => ({
                name: formatLabel(node.month),
                Productivity: node.productivity_per_day || 0,
                Installations: node.total_installations || 0,
                'Active Days': node.active_days || 0
            }));
        }
        
        // 2. Comparison
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => ({
                name: node.label,
                Productivity: node.productivity_per_day || 0,
                Installations: node.total_installations || 0,
                'Active Days': node.active_days || 0
            }));
        }
        
        return { trend, distribution };
    }

    // Inventory Utilization
    if (n.includes('inventory utilization')) {
        const summary = trendData && !Array.isArray(trendData) ? trendData : null;
        
        if (summary?.period_breakdown && !Array.isArray(summary.period_breakdown)) {
            const flattened = [];
            Object.entries(summary.period_breakdown).forEach(([period, cats]) => {
                const label = formatLabel(period);
                if (!params?.meter_category || params?.meter_category === 'Total') {
                    const point = { name: label, Consumer: 0, DT: 0, Feeder: 0 };
                    
                    const conData = getCategoryData(cats, 'CONSUMER');
                    const dtData = getCategoryData(cats, 'DT');
                    const fdData = getCategoryData(cats, 'FEEDER');

                    if (conData) point.Consumer = Number(conData.total?.installed ?? conData.installed ?? 0);
                    if (dtData) point.DT = Number(dtData.total?.installed ?? dtData.installed ?? 0);
                    if (fdData) point.Feeder = Number(fdData.total?.installed ?? fdData.installed ?? 0);
                    
                    if (point.Consumer || point.DT || point.Feeder) flattened.push(point);
                } else {
                    const sel = params.meter_category.toUpperCase();
                    const catData = getCategoryData(cats, sel);
                    const installed = catData?.total?.installed ?? catData?.installed ?? 0;
                    const keyName = sel === 'CONSUMER' ? 'Consumer' : (sel === 'DT' ? 'DT' : 'Feeder');
                    flattened.push({ name: label, [keyName]: Number(installed) });
                }
            });
            trend = flattened;
        } else if (summary?.period_breakdown?.length > 0) {
            const map = new Map();
            summary.period_breakdown.forEach(p => {
                const label = formatLabel(p.period_value || p.name);
                map.set(label, (map.get(label) || 0) + Number(p.installed || p.total_installed || 0));
            });
            trend = Array.from(map.entries()).map(([name, val]) => ({
                name,
                value: val
            }));
        }

        // Geographical Comparison
        if (Array.isArray(distData)) {
            distribution = aggregateGeographically(distData, 'utilization_rate_pct');
        } else if (summary?.category_breakdown && !Array.isArray(summary.category_breakdown)) {
            const catBreakdown = summary.category_breakdown;
            // Detect if it's deeply nested (cat -> technology -> metrics) or simple (cat -> metrics)
            const isDeep = typeof Object.values(catBreakdown)[0] === 'object' && !('utilization_rate_pct' in Object.values(catBreakdown)[0]);
            
            if (isDeep) {
                distribution = flattenNestedBreakdown(catBreakdown).map(d => ({
                    name: d.name,
                    value: d.installed ?? d.utilization_rate_pct ?? (typeof d.value === 'number' ? d.value : (Object.values(d).find(v => typeof v === 'number') || 0))
                }));
            } else {
                distribution = Object.entries(catBreakdown).map(([name, val]) => {
                    const label = name.toUpperCase() === 'CONSUMER' ? 'Consumer' : (name.toUpperCase() === 'DT' ? 'DT' : (name.toUpperCase() === 'FEEDER' ? 'Feeder' : name));
                    const value = typeof val === 'object' ? (val.total?.installed ?? val.installed ?? val.utilization_rate_pct ?? val.value ?? 0) : val;
                    return { name: label, value: Number(value) || 0 };
                });
            }
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
        const summary = trendData;
        
        // 1. Trend: Parse period_breakdown
        if (summary?.period_breakdown && !Array.isArray(summary.period_breakdown)) {
            const pFlattened = [];
            Object.entries(summary.period_breakdown).forEach(([period, data]) => {
                const label = formatLabel(period);
                if (!params?.meter_category || params?.meter_category === 'Total') {
                    const point = { name: label, Consumer: 0, DT: 0, Feeder: 0 };
                    
                    const conData = getCategoryData(data, 'CONSUMER');
                    const dtData = getCategoryData(data, 'DT');
                    const fdData = getCategoryData(data, 'FEEDER');

                    if (conData) point.Consumer = Number(conData.total?.installed ?? conData.installed ?? 0);
                    if (dtData) point.DT = Number(dtData.total?.installed ?? dtData.installed ?? 0);
                    if (fdData) point.Feeder = Number(fdData.total?.installed ?? fdData.installed ?? 0);
                    
                    // Fallback to total installed if no category points found
                    if (point.Consumer === 0 && point.DT === 0 && point.Feeder === 0 && data.total?.installed) {
                        point.Value = Number(data.total.installed);
                    }
                    if (Object.keys(point).length > 1) pFlattened.push(point);
                } else {
                    const sel = params.meter_category.toUpperCase();
                    const catData = getCategoryData(data, sel);
                    const installed = catData?.total?.installed ?? catData?.installed ?? 0;
                    const keyName = sel === 'CONSUMER' ? 'Consumer' : (sel === 'DT' ? 'DT' : 'Feeder');
                    pFlattened.push({ name: label, [keyName]: Number(installed) });
                }
            });
            trend = pFlattened.sort((a,b) => a.name.localeCompare(b.name));
        } else {
            trend = [];
        }

        // 2. Distribution (Geographical or Standard)
        if (Array.isArray(distData) && distData.length > 0) {
            distribution = aggregateGeographically(distData, 'total_installed');
        } else {
            distribution = [
                { name: 'Installed', value: Number(summary?.total_installed) || 0 },
                { name: 'Remaining', value: Number(summary?.remaining_stock) || 0 },
            ];
        }
        
        return { trend, distribution };
    }

    // Un-utilized Stock Ageing
    if (n.includes('stock ageing') || n.includes('un-utilized stock ageing')) {
        const summary = trendData && !Array.isArray(trendData) ? trendData : (distData && !Array.isArray(distData) ? distData : null);
        
        // 1. Trend (or Category Chart if no trend)
        if (summary?.period_breakdown) {
            const flattened = [];
            Object.entries(summary.period_breakdown).forEach(([period, data]) => {
                const label = formatLabel(period);
                if (!params?.meter_category || params?.meter_category === 'Total') {
                    const point = { name: label, Consumer: 0, DT: 0, Feeder: 0 };
                    
                    const conData = getCategoryData(data, 'CONSUMER');
                    const dtData = getCategoryData(data, 'DT');
                    const fdData = getCategoryData(data, 'FEEDER');

                    if (conData?.total) point.Consumer = (Number(conData.total.age_0_30) || 0) + (Number(conData.total.age_31_60) || 0) + (Number(conData.total.age_61_90) || 0) + (Number(conData.total.age_90_plus) || 0);
                    if (dtData?.total) point.DT = (Number(dtData.total.age_0_30) || 0) + (Number(dtData.total.age_31_60) || 0) + (Number(dtData.total.age_61_90) || 0) + (Number(dtData.total.age_90_plus) || 0);
                    if (fdData?.total) point.Feeder = (Number(fdData.total.age_0_30) || 0) + (Number(fdData.total.age_31_60) || 0) + (Number(fdData.total.age_61_90) || 0) + (Number(fdData.total.age_90_plus) || 0);
                    
                    flattened.push(point);
                } else {
                    const sel = params.meter_category.toUpperCase();
                    let total = 0;
                    const catData = getCategoryData(data, sel);
                    if (catData?.total) {
                        total = (Number(catData.total.age_0_30) || 0) + (Number(catData.total.age_31_60) || 0) + 
                                (Number(catData.total.age_61_90) || 0) + (Number(catData.total.age_90_plus) || 0);
                    }
                    const keyName = sel === 'CONSUMER' ? 'Consumer' : (sel === 'DT' ? 'DT' : 'Feeder');
                    flattened.push({ name: label, [keyName]: total });
                }
            });
            trend = flattened.sort((a,b) => a.name.localeCompare(b.name));
        } else if (summary?.category_breakdown) {
            // Show categories (Consumer, Feeder, etc)
            trend = Object.entries(summary.category_breakdown).map(([name, data]) => {
                const total = data.total ? 
                    (Number(data.total.age_0_30) || 0) + (Number(data.total.age_31_60) || 0) + 
                    (Number(data.total.age_61_90) || 0) + (Number(data.total.age_90_plus) || 0) : 0;
                return { name, value: total };
            });
        }

        // 2. Distribution (Ageing Buckets or Geographical Comparison)
        if (Array.isArray(distData) && distData.length > 0) {
            // Use ageing_days for geographical aggregation
            distribution = aggregateGeographically(distData, 'ageing_days');
        } else if (summary?.category_breakdown) {
            const buckets = { '0-30 days': 0, '31-60 days': 0, '61-90 days': 0, '90+ days': 0 };
            Object.values(summary.category_breakdown).forEach(cat => {
                if (cat.total) {
                    buckets['0-30 days'] += (Number(cat.total.age_0_30) || 0);
                    buckets['31-60 days'] += (Number(cat.total.age_31_60) || 0);
                    buckets['61-90 days'] += (Number(cat.total.age_61_90) || 0);
                    buckets['90+ days'] += (Number(cat.total.age_90_plus) || 0);
                }
            });
            distribution = Object.entries(buckets).map(([name, value]) => ({ name, value }));
        }

        return { trend, distribution };
    }

    // MI vs SAT
    if (n.includes('mi vs sat') || n.includes('mi vs. sat')) {
        const summary = trendData && !Array.isArray(trendData) ? trendData : null;

        if (summary) {
             const stages = [
                 { name: 'S1', value: summary.sat_1 || 0 },
                 { name: 'S2', value: summary.sat_2 || 0 },
                 { name: 'S3', value: summary.sat_3 || 0 },
                 { name: 'S4', value: summary.sat_4 || 0 },
                 { name: 'S5', value: summary.sat_5 || 0 },
                 { name: 'S6', value: summary.sat_6 || 0 },
                 { name: 'S7', value: summary.sat_7 || 0 },
                 { name: 'S8', value: summary.sat_8 || 0 },
                 { name: 'S9', value: summary.sat_9 || 0 },
             ];
             
             if (summary.period_breakdown && !Array.isArray(summary.period_breakdown)) {
                const pFlattened = [];
                Object.entries(summary.period_breakdown).forEach(([period, cats]) => {
                    const label = formatLabel(period);
                    if (!params?.meter_category || params?.meter_category === 'Total') {
                        const point = { name: label, Consumer: 0, DT: 0, Feeder: 0 };
                        // Note: Here we are stacking SAT (Verified) counts
                        const conData = getCategoryData(cats, 'CONSUMER');
                        const dtData = getCategoryData(cats, 'DT');
                        const fdData = getCategoryData(cats, 'FEEDER');

                        if (conData) point.Consumer = Object.values(conData).reduce((a, b) => a + (Number(b.total_sat) || 0), 0);
                        if (dtData) point.DT = Object.values(dtData).reduce((a, b) => a + (Number(b.total_sat) || 0), 0);
                        if (fdData) point.Feeder = Object.values(fdData).reduce((a, b) => a + (Number(b.total_sat) || 0), 0);
                        
                        pFlattened.push(point);
                    } else {
                        const sel = params.meter_category.toUpperCase();
                        let totalMI = 0;
                        let totalSAT = 0;
                        const catData = getCategoryData(cats, sel);
                        if (catData) {
                            Object.values(catData).forEach(m => {
                                totalMI += (m.total_mi || 0);
                                totalSAT += (m.total_sat || 0);
                            });
                        }
                        const keyName = sel === 'CONSUMER' ? 'Consumer' : (sel === 'DT' ? 'DT' : 'Feeder');
                        pFlattened.push({ name: label, [keyName]: totalSAT, 'MI Installed': totalMI });
                    }
                });
                trend = pFlattened;
             } else {
                trend = stages;
             }
        }

        if (Array.isArray(distData) && distData.length > 0) {
            distribution = aggregateGeographically(distData, 'total_sat');
        } else {
             distribution = [
                 { name: 'Installed', value: summary?.total_mi || 0 },
                 { name: 'Verified (SAT)', value: summary?.total_sat || 0 }
             ];
        }
        return { trend, distribution };
    }
    
    // Non-SAT Ageing
    if (n.includes('non-sat ageing') || n.includes('non sat ageing')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        if (rows.length === 0) return { trend: [], distribution: [] };

        // 1. Trend: Count by installation_date
        const dateMap = new Map();
        rows.forEach(r => {
            const date = r.installation_date || 'Unknown';
            const label = formatLabel(date);
            dateMap.set(label, (dateMap.get(label) || 0) + 1);
        });
        trend = Array.from(dateMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => a.name.localeCompare(b.name));

        // 2. Distribution: Ageing Buckets
        const buckets = { '0-7 days': 0, '8-15 days': 0, '16-30 days': 0, '> 30 days': 0 };
        rows.forEach(r => {
            const d = Number(r.ageing_days || 0);
            if (d <= 7) buckets['0-7 days']++;
            else if (d <= 15) buckets['8-15 days']++;
            else if (d <= 30) buckets['16-30 days']++;
            else buckets['> 30 days']++;
        });
        distribution = Object.entries(buckets).map(([name, value]) => ({ 
            name, 
            value,
            avg: value // For BoxPlot compatibility
        }));

        return { trend, distribution };
    }

    // MI vs SAT vs Invoice Funnel
    if (n.includes('mi vs sat vs invoice') || n.includes('funnel')) {
        const summary = distData || trendData;
        const detailRows = Array.isArray(trendData) ? trendData : (trendData?.rows || []);

        // Helper to extract metrics from a potentially nested object (e.g., handles root total_mi OR nested total.mi)
        const getMetrics = (obj) => {
            if (!obj) return { mi: 0, sat: 0, inv: 0 };
            const m = obj.total || obj; // Use 'total' sub-object if present
            return {
                mi: Number(m.mi || m.total_mi || 0),
                sat: Number(m.sat || m.total_sat || 0),
                inv: Number(m.invoice || m.total_invoice || 0)
            };
        };

        // 1. Distribution: Funnel (Summary)
        let totals = getMetrics(summary);

        // Apply category filter to summary if needed
        if (params.meter_category && params.meter_category !== 'Total' && summary?.category_breakdown) {
            const catData = getCategoryData(summary.category_breakdown, params.meter_category);
            if (catData) {
                totals = getMetrics(catData);
            }
        }

        distribution = [
            { name: 'MI Installed', value: totals.mi },
            { name: 'SAT Done', value: totals.sat },
            { name: 'Invoiced', value: totals.inv },
        ];

        // 2. Trend: Historical progress
        const periodMap = new Map();
        
        if (summary?.period_breakdown && !Array.isArray(summary.period_breakdown)) {
            Object.entries(summary.period_breakdown).forEach(([period, cats]) => {
                const label = formatLabel(period);
                if (!periodMap.has(label)) periodMap.set(label, { name: label });
                const pObj = periodMap.get(label);

                if (!params.meter_category || params.meter_category === 'Total') {
                    const pTotals = getMetrics(cats);
                    pObj['MI'] = (pObj['MI'] || 0) + pTotals.mi;
                    pObj['SAT'] = (pObj['SAT'] || 0) + pTotals.sat;
                    pObj['Invoice'] = (pObj['Invoice'] || 0) + pTotals.inv;
                } else {
                    const catData = getCategoryData(cats, params.meter_category);
                    if (catData) {
                        const cTotals = getMetrics(catData);
                        pObj['MI'] = (pObj['MI'] || 0) + cTotals.mi;
                        pObj['SAT'] = (pObj['SAT'] || 0) + cTotals.sat;
                        pObj['Invoice'] = (pObj['Invoice'] || 0) + cTotals.inv;
                    }
                }
            });
        } else {
            detailRows.forEach(r => {
                const label = formatLabel(r.period_value || r.date || 'Unknown');
                if (!periodMap.has(label)) periodMap.set(label, { name: label });
                const pObj = periodMap.get(label);
                
                pObj['MI'] = (pObj['MI'] || 0) + Number(r.mi || r.total_mi || 0);
                pObj['SAT'] = (pObj['SAT'] || 0) + Number(r.sat || r.total_sat || 0);
                pObj['Invoice'] = (pObj['Invoice'] || 0) + Number(r.invoice || r.total_invoice || 0);
            });
        }
        trend = Array.from(periodMap.values()).sort((a, b) => a.name.localeCompare(b.name));

        return { trend, distribution };
    }


    // Revenue Ageing
    if (n.includes('revenue') && n.includes('ageing')) {
        const summary = distData || trendData;
        const buckets = ['age_0_30', 'age_31_60', 'age_61_90', 'age_90_plus'];
        const bucketLabels = {
            'age_0_30': '0-30 Days',
            'age_31_60': '31-60 Days',
            'age_61_90': '61-90 Days',
            'age_90_plus': '90+ Days'
        };

        const sumAgeingBuckets = (obj) => {
            const result = { age_0_30: 0, age_31_60: 0, age_61_90: 0, age_90_plus: 0 };
            if (!obj) return result;

            // Prioritize 'total' key at this level if it exists to avoid double-counting categories
            if (obj.total && typeof obj.total === 'object' && !Array.isArray(obj.total)) {
                buckets.forEach(b => {
                    result[b] += Number(obj.total[b] || 0);
                });
                return result;
            }

            // Otherwise recurse to find these keys in children
            const traverse = (item) => {
                if (typeof item !== 'object' || item === null) return;
                
                // If a child has a 'total' child, use that and stop
                if (item.total && typeof item.total === 'object') {
                    buckets.forEach(b => { result[b] += Number(item.total[b] || 0); });
                    return;
                }

                let foundBucket = false;
                buckets.forEach(b => {
                    if (item[b] !== undefined && typeof item[b] !== 'object') {
                        result[b] += Number(item[b] || 0);
                        foundBucket = true;
                    }
                });
                if (!foundBucket) {
                    Object.values(item).forEach(traverse);
                }
            };
            traverse(obj);
            return result;
        };

        // 1. Distribution: Ageing Buckets
        let distStats;
        if (!params.meter_category || params.meter_category === 'Total') {
            distStats = sumAgeingBuckets(summary?.category_breakdown);
        } else {
            const catData = getCategoryData(summary?.category_breakdown, params.meter_category);
            distStats = sumAgeingBuckets(catData);
        }

        distribution = buckets.map(b => ({
            name: bucketLabels[b],
            value: distStats[b],
            avg: distStats[b] // For BoxPlot
        }));

        // 2. Trend: Historical Ageing
        if (summary?.period_breakdown && !Array.isArray(summary.period_breakdown)) {
            trend = Object.entries(summary.period_breakdown).map(([period, cats]) => {
                const label = formatLabel(period);
                
                if (!params.meter_category || params.meter_category === 'Total') {
                    // Use category-specific keys for the trend chart to allow stacking/independence
                    const point = { name: label };
                    let grandTotal = 0;
                    ['CONSUMER', 'DT', 'FEEDER'].forEach(c => {
                        const cData = getCategoryData(cats, c);
                        const cStats = sumAgeingBuckets(cData);
                        const cTotal = Object.values(cStats).reduce((sum, val) => sum + val, 0);
                        point[c === 'CONSUMER' ? 'Consumer' : (c === 'DT' ? 'DT' : 'Feeder')] = cTotal;
                        grandTotal += cTotal;
                    });
                    // Fallback if no specific categories matched but there's a top-level total
                    if (grandTotal === 0 && cats.total) {
                        const tStats = sumAgeingBuckets(cats.total);
                        point.value = Object.values(tStats).reduce((sum, val) => sum + val, 0);
                    }
                    return point;
                } else {
                    const catData = getCategoryData(cats, params.meter_category);
                    const cStats = sumAgeingBuckets(catData);
                    const total = Object.values(cStats).reduce((sum, val) => sum + val, 0);
                    return { name: label, value: total };
                }
            }).sort((a, b) => {
                const dateA = new Date(a.name);
                const dateB = new Date(b.name);
                if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) return dateA - dateB;
                return a.name.localeCompare(b.name);
            });
        } else {
            trend = distribution; 
        }

        return { trend, distribution };
    }

    // Revenue Realized
    if (n.includes('revenue realized') && !n.includes('ageing')) {
        const summary = trendData;
        if (summary?.period_breakdown && !Array.isArray(summary.period_breakdown)) {
            const pFlattened = [];
            Object.entries(summary.period_breakdown).forEach(([period, cats]) => {
                const label = formatLabel(period);
                if (!params?.meter_category || params?.meter_category === 'Total') {
                    const point = { name: label, Consumer: 0, DT: 0, Feeder: 0 };
                    const conData = getCategoryData(cats, 'CONSUMER');
                    const dtData = getCategoryData(cats, 'DT');
                    const fdData = getCategoryData(cats, 'FEEDER');

                    if (conData) point.Consumer = sumDeep(conData);
                    if (dtData) point.DT = sumDeep(dtData);
                    if (fdData) point.Feeder = sumDeep(fdData);
                    
                    pFlattened.push(point);
                } else {
                    const sel = params.meter_category.toUpperCase();
                    let total = 0;
                    const catData = getCategoryData(cats, sel);
                    if (catData) total = sumDeep(catData);
                    
                    const keyName = sel === 'CONSUMER' ? 'Consumer' : (sel === 'DT' ? 'DT' : 'Feeder');
                    pFlattened.push({ name: label, [keyName]: total });
                }
            });
            trend = pFlattened;
        } else {
            trend = [{ name: 'Total Realized', value: summary?.total_realized || 0 }];
        }

        if (Array.isArray(distData) && distData.length > 0) {
            distribution = aggregateGeographically(distData, 'amount_realized');
        } else {
            distribution = flattenNestedBreakdown(summary?.category_breakdown).map(d => ({
                name: d.name,
                value: Object.values(d).find(v => typeof v === 'number') || 0
            }));
        }
        return { trend, distribution };
    }

    // Defective Meters
    if (n.includes('defective meters')) {
        const summary = trendData;
        
        // 1. Distribution: Types of Defects
        // Use top-level totals if available, otherwise sum from breakdown
        let totalBurnt = Number(summary?.total_burnt || 0);
        let totalFaulty = Number(summary?.total_faulty || 0);
        let totalOthers = Number(summary?.total_others || 0);
        
        if (summary?.category_breakdown && !Array.isArray(summary.category_breakdown)) {
            // Recalculate from breakdown if top-level is missing or inaccurate
            totalBurnt = 0; totalFaulty = 0; totalOthers = 0;
            Object.values(summary.category_breakdown).forEach(cat => {
                if (cat.total) {
                    totalBurnt += (Number(cat.total.meter_burnt) || 0);
                    totalFaulty += (Number(cat.total.meter_faulty) || 0);
                    totalOthers += (Number(cat.total.others) || 0);
                }
            });
        }
        
        distribution = [
            { name: 'Burnt', value: totalBurnt },
            { name: 'Faulty', value: totalFaulty },
            { name: 'Others', value: totalOthers },
        ];

        // 2. Trend: Aggregate
        if (summary?.period_breakdown && !Array.isArray(summary.period_breakdown)) {
            const pFlattened = [];

            Object.entries(summary.period_breakdown).forEach(([period, data]) => {
                const label = formatLabel(period);
                if (!params?.meter_category || params?.meter_category === 'Total') {
                    const point = { name: label, _rawDate: period, Consumer: 0, DT: 0, Feeder: 0 };
                    
                    const conData = getCategoryData(data, 'CONSUMER');
                    if (conData?.total) {
                        point.Consumer = (Number(conData.total.meter_burnt) || 0) + (Number(conData.total.meter_faulty) || 0) + (Number(conData.total.others) || 0);
                    }
                    
                    const dtData = getCategoryData(data, 'DT');
                    if (dtData?.total) {
                        point.DT = (Number(dtData.total.meter_burnt) || 0) + (Number(dtData.total.meter_faulty) || 0) + (Number(dtData.total.others) || 0);
                    }
                    
                    const fdData = getCategoryData(data, 'FEEDER');
                    if (fdData?.total) {
                        point.Feeder = (Number(fdData.total.meter_burnt) || 0) + (Number(fdData.total.meter_faulty) || 0) + (Number(fdData.total.others) || 0);
                    }
                    
                    pFlattened.push(point);
                } else {
                    const sel = params.meter_category.toUpperCase();
                    let burnt = 0, faulty = 0, others = 0;
                    
                    const catData = getCategoryData(data, sel);
                    if (catData?.total) {
                        burnt = Number(catData.total.meter_burnt) || 0;
                        faulty = Number(catData.total.meter_faulty) || 0;
                        others = Number(catData.total.others) || 0;
                    }
                    pFlattened.push({ name: label, _rawDate: period, Burnt: burnt, Faulty: faulty, Others: others });
                }
            });
            
            // Chronological sorting for DD-MM-YY format
            trend = pFlattened.sort((a, b) => {
                if (a._rawDate === 'Unknown') return 1;
                if (b._rawDate === 'Unknown') return -1;
                
                const parseDate = (d) => {
                    const parts = d.split('-');
                    if (parts.length !== 3) return new Date(0);
                    const day = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10) - 1;
                    const year = parseInt(parts[2], 10) + 2000;
                    return new Date(year, month, day);
                };
                
                return parseDate(a._rawDate) - parseDate(b._rawDate);
            }).map(({ _rawDate, ...rest }) => rest);
        } else if (summary?.category_breakdown) {

        } else {
            trend = distribution;
        }

        if (Array.isArray(distData) && distData.length > 0) {
            // Aggregating all categories for comparison
            const map = new Map();
            let groupKey = 'project';
            if (params.project && params.project !== 'All') groupKey = 'zone';
            if (params.zone && params.zone !== 'All') groupKey = 'circle';

            distData.forEach(r => {
                const label = r[groupKey] || 'Other';
                const val = (Number(r.defective) || 0) + (Number(r.burnt) || 0) + (Number(r.faulty) || 0) || (Number(r.count) || 0);
                map.set(label, (map.get(label) || 0) + val);
            });
            distribution = Array.from(map.entries()).map(([name, value]) => ({ name, value }));
        }

        return { trend, distribution };
    }

    // Meter Journey
    if (n.includes('meter journey') || n.includes('meters journey')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        if (rows.length === 0) return { trend: [], distribution: [] };

        // 1. Trend: Group by project and show category-wise journey times
        const projectMap = new Map();
        rows.forEach(r => {
            const p = r.project || 'Total';
            if (!projectMap.has(p)) projectMap.set(p, { name: p, _counts: {} });
            const pObj = projectMap.get(p);
            
            const rawCat = r.meter_category || 'Total';
            const cat = rawCat.toUpperCase() === 'CONSUMER' ? 'Consumer' : (rawCat.toUpperCase() === 'FEEDER' ? 'Feeder' : (rawCat.toUpperCase().includes('DT') ? 'DT' : rawCat));
            
            const val = Number(r.total_journey || 0);
            if (pObj[cat] !== undefined) {
                const count = pObj._counts[cat] || 1;
                pObj[cat] = (pObj[cat] * count + val) / (count + 1);
                pObj._counts[cat] = count + 1;
            } else {
                pObj[cat] = val;
                pObj._counts[cat] = 1;
            }
        });
        trend = Array.from(projectMap.values()).map(p => {
            const { _counts, ...rest } = p;
            return rest;
        });

        // 2. Distribution: Average time across specific levels
        let targetRow;
        if (params.meter_category && params.meter_category !== 'Total') {
            const matches = rows.filter(r => (r.meter_category || '').toUpperCase() === params.meter_category.toUpperCase());
            if (matches.length > 0) {
                targetRow = {
                    di_to_gmr: matches.reduce((s, r) => s + (r.di_to_gmr || 0), 0) / matches.length,
                    gmr_to_agency: matches.reduce((s, r) => s + (r.gmr_to_agency || 0), 0) / matches.length,
                    agency_to_sup: matches.reduce((s, r) => s + (r.agency_to_sup || 0), 0) / matches.length,
                    sup_to_install: matches.reduce((s, r) => s + (r.sup_to_install || 0), 0) / matches.length,
                    install_to_sat: matches.reduce((s, r) => s + (r.install_to_sat || 0), 0) / matches.length,
                    sat_to_revenue: matches.reduce((s, r) => s + (r.sat_to_revenue || 0), 0) / matches.length,
                };
            }
        }
        
        if (!targetRow) {
            const count = rows.length;
            targetRow = {
                di_to_gmr: rows.reduce((s, r) => s + (r.di_to_gmr || 0), 0) / count,
                gmr_to_agency: rows.reduce((s, r) => s + (r.gmr_to_agency || 0), 0) / count,
                agency_to_sup: rows.reduce((s, r) => s + (r.agency_to_sup || 0), 0) / count,
                sup_to_install: rows.reduce((s, r) => s + (r.sup_to_install || 0), 0) / count,
                install_to_sat: rows.reduce((s, r) => s + (r.install_to_sat || 0), 0) / count,
                sat_to_revenue: rows.reduce((s, r) => s + (r.sat_to_revenue || 0), 0) / count,
            };
        }

        distribution = [
            { name: 'DI → GMR', value: Number(targetRow.di_to_gmr?.toFixed(1) || 0) },
            { name: 'GMR → Agency', value: Number(targetRow.gmr_to_agency?.toFixed(1) || 0) },
            { name: 'Agency → Sup', value: Number(targetRow.agency_to_sup?.toFixed(1) || 0) },
            { name: 'Sup → Install', value: Number(targetRow.sup_to_install?.toFixed(1) || 0) },
            { name: 'Install → SAT', value: Number(targetRow.install_to_sat?.toFixed(1) || 0) },
            { name: 'SAT → Revenue', value: Number(targetRow.sat_to_revenue?.toFixed(1) || 0) },
        ];
        
        return { trend, distribution };
    }

    // Meter Stage
    if (n.includes('meter stage') || n.includes('meters stage') || n.includes('meter current stage') || n.includes('meters current stage')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        if (rows.length === 0) return { trend: [], distribution: [] };

        // 1. Distribution: Aggregate by current_stage
        const stageMap = new Map();
        rows.forEach(r => {
            let stage = (r.current_stage || 'Unknown').replace(/_/g, ' ').trim();
            // Capitalize
            stage = stage.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
            
            const count = Number(r.meter_count || 0);
            
            // Filter by category if requested
            if (!params.meter_category || params.meter_category === 'Total' || (r.meter_category || '').toUpperCase() === params.meter_category.toUpperCase()) {
                stageMap.set(stage, (stageMap.get(stage) || 0) + count);
            }
        });
        distribution = Array.from(stageMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        // 2. Trend: Group by project and show category-wise totals
        const projectMap = new Map();
        rows.forEach(r => {
            const p = r.project || 'Total';
            if (!projectMap.has(p)) projectMap.set(p, { name: p });
            const pObj = projectMap.get(p);
            
            const rawCat = r.meter_category || 'Total';
            const cat = rawCat.toUpperCase() === 'CONSUMER' ? 'Consumer' : (rawCat.toUpperCase() === 'FEEDER' ? 'Feeder' : (rawCat.toUpperCase().includes('DT') ? 'DT' : rawCat));
            
            pObj[cat] = (pObj[cat] || 0) + Number(r.meter_count || 0);
        });
        trend = Array.from(projectMap.values());

        return { trend, distribution };
    }

    // O&M Team Productivity
    if ((n.includes('o&m') || n.includes('om')) && n.includes('productivity') && n.includes('team')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        if (rows.length === 0) return { trend: [], distribution: [] };

        // 1. Trend: Category-wise productivity over time
        const periodMap = new Map();
        rows.forEach(r => {
            const period = formatLabel(r.period_value || 'Unknown');
            const rawCat = r.meter_category || r.category || 'Other';
            const cat = rawCat.toUpperCase() === 'CONSUMER' ? 'Consumer' : ((rawCat.toUpperCase() === 'DT' || rawCat.toUpperCase() === 'DTR') ? 'DT' : (rawCat.toUpperCase() === 'FEEDER' ? 'Feeder' : rawCat));
            const val = Number(r.closed_tickets || 0);
            
            if (!periodMap.has(period)) periodMap.set(period, { name: period });
            const pObj = periodMap.get(period);

            if (!params?.meter_category || params?.meter_category === 'Total' || rawCat.toUpperCase() === params.meter_category.toUpperCase()) {
                pObj[cat] = (pObj[cat] || 0) + val;
            }
        });
        trend = Array.from(periodMap.values()).sort((a, b) => a.name.localeCompare(b.name));

        // 2. Distribution: Team-wise Productivity with Category breakdown
        const teamMap = new Map();
        rows.forEach(r => {
            // Strip quotes and trim
            let team = (r.agency || r.technician || 'Other').replace(/^"|"$/g, '').trim();
            if (team.startsWith('\\"')) team = team.replace(/^\\"|\\"$/g, '').trim(); 
            
            const rawCat = r.meter_category || r.category || 'Other';
            const cat = rawCat.toUpperCase() === 'CONSUMER' ? 'Consumer' : ((rawCat.toUpperCase() === 'DT' || rawCat.toUpperCase() === 'DTR') ? 'DT' : (rawCat.toUpperCase() === 'FEEDER' ? 'Feeder' : rawCat));
            const val = Number(r.closed_tickets || 0);

            if (!teamMap.has(team)) teamMap.set(team, { name: team });
            const tObj = teamMap.get(team);

            if (!params?.meter_category || params?.meter_category === 'Total' || rawCat.toUpperCase() === params.meter_category.toUpperCase()) {
                tObj[cat] = (tObj[cat] || 0) + val;
            }
        });
        distribution = Array.from(teamMap.values())
            .sort((a, b) => {
                const totalA = Object.keys(a).filter(k => k !== 'name').reduce((s, k) => s + a[k], 0);
                const totalB = Object.keys(b).filter(k => k !== 'name').reduce((s, k) => s + b[k], 0);
                return totalB - totalA;
            })
            .slice(0, 20);

        /*
        // Previous attempt - only single value aggregation
        trend = aggregateData(rows, 'period_value', 'closed_tickets');
        const catMap = new Map();
        rows.forEach(r => {
            const cat = r.meter_category || r.category || 'Other';
            const val = Number(r.closed_tickets || 0);
            catMap.set(cat, (catMap.get(cat) || 0) + val);
        });
        distribution = Array.from(catMap.entries()).map(([name, value]) => ({ name, value }));
        */
        
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
        if (rows.length === 0) return { trend: [], distribution: [] };

        const buckets = { '<1 day': 0, '1–3 days': 0, '4–7 days': 0, '>7 days': 0 };
        const periodMap = new Map();

        rows.forEach(r => {
            const rawCat = r.meter_category || r.category || 'Other';
            const cat = rawCat.toUpperCase() === 'CONSUMER' ? 'Consumer' : ((rawCat.toUpperCase() === 'DT' || rawCat.toUpperCase() === 'DTR') ? 'DT' : (rawCat.toUpperCase() === 'FEEDER' ? 'Feeder' : rawCat));
            const d = Number(r.ageing_days || 0);
            
            if (d < 1) buckets['<1 day']++;
            else if (d <= 3) buckets['1–3 days']++;
            else if (d <= 7) buckets['4–7 days']++;
            else buckets['>7 days']++;

            if (r.created_date) {
                const date = formatLabel(r.created_date.split('T')[0]);
                if (!periodMap.has(date)) periodMap.set(date, { name: date });
                const pObj = periodMap.get(date);

                if (!params?.meter_category || params?.meter_category === 'Total' || rawCat.toUpperCase() === params.meter_category.toUpperCase()) {
                    pObj[cat] = (pObj[cat] || 0) + 1;
                }
            }
        });

        trend = Array.from(periodMap.values()).sort((a, b) => a.name.localeCompare(b.name));

        if (trend.length === 0) trend = [{ name: 'Total Open', value: rows.length }];

        distribution = Object.entries(buckets).map(([name, value]) => ({ 
            name, 
            value,
            avg: value // For BoxPlot compatibility
        }));

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
        if (rows.length === 0) return { trend: [], distribution: [] };

        // 1. Trend: Total closed tickets over time
        trend = aggregateData(rows, 'period_value', 'closed_tickets');

        // 2. Distribution: By Complaint Type
        const typeMap = new Map();
        rows.forEach(r => {
            const type = (r.complaint_type || 'Other').replace(/^"|"$/g, '').trim();
            const val = Number(r.closed_tickets || 0);
            typeMap.set(type, (typeMap.get(type) || 0) + val);
        });
        distribution = Array.from(typeMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

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
