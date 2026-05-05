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

    // Shared helper for ageing buckets with potentially nested categories (Stock, Non-SAT, etc.)
    const getBucketVal = (node, key, category) => {
        if (!node || typeof node === 'number') return 0;
        
        const raw = node[key];
        if (raw === undefined) return 0;

        if (typeof raw === 'object' && raw !== null) {
            const sel = (category || params?.category || params?.meter_category || 'total').toUpperCase();
            if (sel === 'TOTAL' || !sel) {
                return Number(raw.total || 0);
            }
            return Number(raw[sel] || raw.total || 0);
        }

        return Number(raw || 0);
    };

    const getBreakdownData = (node, selCategory, fallbackLabel) => {
        const point = {};
        
        if (typeof node === 'number') {
            let label = fallbackLabel;
            if (!label) {
                label = (selCategory === 'DT' || selCategory === 'DTR') ? 'DT' : (selCategory.charAt(0) + selCategory.slice(1).toLowerCase());
            }
            point[label] = node;
            return point;
        }

        if (!node) {
            // Ensure the main category key exists even for null/0 nodes
            if (selCategory !== 'TOTAL' && selCategory) {
                const label = fallbackLabel || (selCategory === 'DT' || selCategory === 'DTR' ? 'DT' : (selCategory.charAt(0) + selCategory.slice(1).toLowerCase()));
                point[label] = 0;
            }
            return point;
        }

        if (selCategory === 'TOTAL' || !selCategory) {
            point.DT = Number(node?.DT || 0);
            point.Consumer = Number(node?.CONSUMER || 0);
            point.Feeder = Number(node?.FEEDER || 0);
            
            // If all categories are 0 but total exists, it might be a single-category response or nested
            if (point.DT === 0 && point.Consumer === 0 && point.Feeder === 0 && node?.total) {
                point.Consumer = Number(node.total); // Usually default to consumer if ambiguous
            }
            point.total = (point.DT + point.Consumer + point.Feeder);
        } else {
            const searchStr = selCategory === 'DTR' ? 'DT' : selCategory;
            const subKeys = node ? Object.keys(node).filter(k => 
                k.toUpperCase().includes(searchStr) && 
                k.toUpperCase() !== selCategory &&
                !['NAME', 'LABEL', 'PERIOD_VALUE', 'DATE', 'TOTAL', 'PROJECT', 'PROJECT_PREFIX'].includes(k.toUpperCase())
            ) : [];

            if (subKeys.length > 0) {
                let subTotal = 0;
                subKeys.forEach(sk => {
                    point[sk] = Number(node[sk] || 0);
                    subTotal += point[sk];
                });
                if (subKeys.length > 1 && !['DT', 'FEEDER', 'DTR'].includes(selCategory)) {
                    point.total = subTotal;
                }
            } else {
                let label = fallbackLabel;
                if (!label) {
                    label = (selCategory === 'DT' || selCategory === 'DTR') ? 'DT' : (selCategory.charAt(0) + selCategory.slice(1).toLowerCase());
                }
                point[label] = Number(node[selCategory] || node[searchStr] || 0);
            }
        }
        return point;
    };

    // MI Progress (New Dashboard Endpoint)
    if (n.includes('mi-progress') || n.includes('mi progress')) {
        const dashboardData = trendData; // Since shared: true
        
        // 1. Trend Analysis
        if (Array.isArray(dashboardData?.trend)) {
            const selCategory = (params?.category || params?.meter_category || 'total').toUpperCase();
            
            trend = dashboardData.trend.map(node => {
                const label = formatLabel(node.period_value);
                return { name: label, ...getBreakdownData(node, selCategory) };
            });
        }
        
        // 2. Comparison (Geographical/Cluster)
        if (Array.isArray(dashboardData?.comparison)) {
            const project = (params?.project || 'all').toLowerCase();
            const level = (params?.level_by || params?.level || 'discom').toLowerCase();
            const selCategory = (params?.category || params?.meter_category || 'total').toUpperCase();
            
            distribution = dashboardData.comparison.map(node => {
                let label = node.label || 'Unknown';
                
                // Behavior Note: Prefix labels if project=all and level is more granular than discom
                if (project === 'all' && level !== 'discom' && node.project_prefix) {
                    label = `${node.project_prefix} | ${label}`;
                }

                return { name: label, ...getBreakdownData(node, selCategory) };
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
                    Productivity: node.productivity_per_technician_per_day || 0,
                    Installations: node.total_installations || 0,
                    Technicians: node.active_technicians || 0
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
                    Productivity: node.productivity_per_technician_per_day || 0,
                    Installations: node.total_installations || 0,
                    Technicians: node.active_technicians || 0
                };
            });
        }

        return { 
            trend, 
            distribution, 
            summary: dashboardData?.summary, 
            insights: dashboardData?.insights,
            category_breakdown: dashboardData?.category_breakdown 
        };
    }

    // Monthly Productivity Trend (New Dashboard Endpoint)
    if (n.includes('monthly productivity')) {
        const dashboardData = trendData; // Since shared: true
        
        // 1. Trend Analysis
        if (Array.isArray(dashboardData?.trend)) {
            trend = dashboardData.trend.map(node => ({
                name: formatLabel(node.month || node.date || node.period_value),
                Productivity: node.productivity_per_technician_per_day || node.productivity_per_day || 0,
                Installations: node.total_installations || 0,
                'Active Days': node.active_days || 0,
                Technicians: node.avg_active_technicians || 0
            }));
        }
        
        // 2. Comparison
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => ({
                name: node.label,
                Productivity: node.productivity_per_technician_per_day || node.productivity_per_day || 0,
                Installations: node.total_installations || 0,
                'Active Days': node.active_days || 0,
                Technicians: node.avg_active_technicians || 0
            }));
        }
        
        return { 
            trend, 
            distribution, 
            summary: dashboardData?.summary, 
            insights: dashboardData?.insights, 
            category_breakdown: dashboardData?.category_breakdown 
        };
    }

    // Defective Meters (Revamped Dashboard)
    if (n.includes('defective meters')) {
        const dashboardData = trendData; // shared: true
        const selCategory = (params?.category || params?.meter_category || 'total').toUpperCase();
        
        // 1. Trend Analysis (Source: period_breakdown or trend)
        const trendSource = dashboardData?.period_breakdown || dashboardData?.trend;
        if (Array.isArray(trendSource)) {
            trend = trendSource.map(node => ({
                name: formatLabel(node.period_value),
                Burnt: getBucketVal(node, 'total_burnt', selCategory),
                Faulty: getBucketVal(node, 'total_faulty', selCategory),
                Others: getBucketVal(node, 'total_others', selCategory)
            }));
        }
        
        // 2. Comparison
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => ({
                name: node.label,
                Burnt: getBucketVal(node, 'total_burnt', selCategory),
                Faulty: getBucketVal(node, 'total_faulty', selCategory),
                Others: getBucketVal(node, 'total_others', selCategory),
                value: getBucketVal(node, 'total_defective', selCategory)
            }));
        }
        
        return { 
            trend, 
            distribution, 
            summary: {
                'Total Defective': getBucketVal(dashboardData.summary, 'total_defective', selCategory),
                'Meter Burnt': getBucketVal(dashboardData.summary, 'total_burnt', selCategory),
                'Meter Faulty': getBucketVal(dashboardData.summary, 'total_faulty', selCategory),
                'Others': getBucketVal(dashboardData.summary, 'total_others', selCategory)
            },
            category_breakdown: dashboardData.category_breakdown
        };
    }

    // Inventory Utilization (Revamped Dashboard)
    if (n.includes('inventory utilization')) {
        const dashboardData = trendData; // shared: true
        const selCategory = (params?.meter_category || 'Total').toUpperCase();

        // 1. Trend Analysis (Period Breakdown)
        if (dashboardData?.period_breakdown && typeof dashboardData.period_breakdown === 'object') {
            trend = Object.entries(dashboardData.period_breakdown).map(([period, categories]) => {
                const label = formatLabel(period);
                const point = { name: label };
                
                let inventory = 0;
                let installed = 0;

                if (selCategory === 'TOTAL') {
                    // 1. Check if there's a top-level 'total' node for the period
                    if (categories.total) {
                        inventory = categories.total.inventory ?? categories.total.total_inventory ?? 0;
                        installed = categories.total.installed ?? categories.total.total_installed ?? 0;
                    } else {
                        // 2. Fallback: Aggregate across major categories
                        ['CONSUMER', 'DT', 'FEEDER'].forEach(cat => {
                            const catData = categories[cat];
                            if (catData) {
                                const cTotal = catData.total || catData;
                                inventory += cTotal.inventory ?? cTotal.total_inventory ?? Object.values(catData).reduce((sum, tech) => sum + (tech.inventory || tech.total_inventory || 0), 0);
                                installed += cTotal.installed ?? cTotal.total_installed ?? Object.values(catData).reduce((sum, tech) => sum + (tech.installed || tech.total_installed || 0), 0);
                            }
                        });
                    }
                } else {
                    const catData = categories[selCategory];
                    if (catData) {
                        const cTotal = catData.total || catData;
                        inventory = cTotal.inventory ?? cTotal.total_inventory ?? Object.values(catData).reduce((sum, tech) => sum + (tech.inventory || tech.total_inventory || 0), 0);
                        installed = cTotal.installed ?? cTotal.total_installed ?? Object.values(catData).reduce((sum, tech) => sum + (tech.installed || tech.total_installed || 0), 0);
                    }
                }

                point['Inventory'] = Number(inventory);
                point['Installed'] = Number(installed);
                point['Utilization Rate'] = inventory > 0 ? Number(((installed / inventory) * 100).toFixed(2)) : 0;
                
                return point;
            });
        }

        // 2. Comparison (Geographical)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => ({
                name: node.label,
                'Inventory': node.total_inventory || node.inventory || 0,
                'Installed': node.total_installed || node.installed || 0,
                'Utilization Rate': node.utilization_rate_pct || 0
            }));
        }

        return { 
            trend, 
            distribution,
            summary: {
                'Total Inventory': dashboardData.total_inventory,
                'Total Installed': dashboardData.total_installed,
                'Utilization Rate': dashboardData.utilization_rate_pct,
                'Remaining Stock': dashboardData.remaining_stock
            },
            category_breakdown: dashboardData.category_breakdown
        };
    }

    // MI Pace vs Stock (Revamped Dashboard)
    if (n.includes('pace') && n.includes('stock')) {
        const dashboardData = trendData; // shared: true
        const selCategory = (params?.meter_category || 'Total').toUpperCase();

        // 1. Trend Analysis (Period Breakdown)
        if (dashboardData?.period_breakdown && typeof dashboardData.period_breakdown === 'object') {
            trend = Object.entries(dashboardData.period_breakdown).map(([period, categories]) => {
                const label = formatLabel(period);
                const point = { name: label };
                
                let inventory = 0;
                let installed = 0;

                if (selCategory === 'TOTAL') {
                    if (categories.total) {
                        inventory = categories.total.inventory ?? categories.total.total_inventory ?? 0;
                        installed = categories.total.installed ?? categories.total.total_installed ?? 0;
                    } else {
                        ['CONSUMER', 'DT', 'FEEDER'].forEach(cat => {
                            const catData = categories[cat];
                            if (catData) {
                                const cTotal = catData.total || catData;
                                inventory += (cTotal.inventory ?? cTotal.total_inventory ?? 0);
                                installed += (cTotal.installed ?? cTotal.total_installed ?? 0);
                            }
                        });
                    }
                } else {
                    const catData = categories[selCategory];
                    if (catData) {
                        const cTotal = catData.total || catData;
                        inventory = cTotal.inventory ?? cTotal.total_inventory ?? 0;
                        installed = cTotal.installed ?? cTotal.total_installed ?? 0;
                    }
                }

                point['Total Inventory'] = Number(inventory);
                point['Total Installed'] = Number(installed);
                point['Remaining Stock'] = Number(inventory - installed);
                
                return point;
            });
        }

        // 2. Comparison (Geographical - Focused on Stock)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => ({
                name: node.label,
                'Total Inventory': node.total_inventory || node.inventory || 0,
                'Total Installed': node.total_installed || node.installed || 0,
                'Remaining Stock': node.remaining_stock || (node.total_inventory - node.total_installed) || 0
            }));
        }

        return { 
            trend, 
            distribution,
            summary: {
                'Total Inventory': dashboardData.total_inventory,
                'Total Installed': dashboardData.total_installed,
                'Utilization Rate': dashboardData.utilization_rate_pct,
                'Remaining Stock': dashboardData.remaining_stock
            },
            category_breakdown: dashboardData.category_breakdown
        };
    }

    // Un-utilized Stock Ageing (New Consolidated Dashboard)
    if (n.includes('stock ageing') || n.includes('un-utilized stock ageing')) {
        const dashboardData = trendData; // shared: true
        const selCategory = (params?.meter_category || 'Total').toUpperCase();

        const bucketKeys = [
            { key: 'age_0_30', label: '0-30 days' },
            { key: 'age_31_60', label: '31-60 days' },
            { key: 'age_61_90', label: '61-90 days' },
            { key: 'age_90_plus', label: '90+ days' }
        ];

        // 1. Snapshot Breakdown (Left Chart)
        trend = bucketKeys.map(b => {
            const bucketNode = dashboardData.summary?.[b.key];
            return { name: b.label, ...getBreakdownData(bucketNode, selCategory) };
        });

        // 2. Comparison (Geographical / Comparison Array)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => {
                const point = { name: node.label || 'Unknown' };
                let sum = 0;
                bucketKeys.forEach(b => {
                    const val = getBucketVal(node, b.key, selCategory);
                    point[b.label] = val;
                    sum += val;
                });
                point.total = sum;
                return point;
            });
        }

        return { 
            trend, 
            distribution,
            summary: {
                'Total Stock': dashboardData.total_stock || 0,
                '0-30 Days': getBucketVal(dashboardData.summary, 'age_0_30', selCategory),
                '31-60 Days': getBucketVal(dashboardData.summary, 'age_31_60', selCategory),
                '61-90 Days': getBucketVal(dashboardData.summary, 'age_61_90', selCategory),
                '90+ Days': getBucketVal(dashboardData.summary, 'age_90_plus', selCategory)
            },
            category_breakdown: dashboardData.category_breakdown
        };
    }

    // MI vs SAT Dashboard (Revamped Stage-wise)
    if ((n.includes('mi vs sat') || n.includes('mi vs. sat')) && !n.includes('invoice') && !n.includes('funnel')) {
        const dashboardData = trendData; // shared: true
        const selCategory = (params?.category || params?.meter_category || 'Total').toUpperCase();

        // 1. Stage-wise Analysis (Left Chart - repurposed from trend)
        const stages = ['sat_1', 'sat_2', 'sat_3', 'sat_4', 'sat_5', 'sat_6', 'sat_7', 'sat_8', 'sat_9'];
        trend = stages.map(s => {
            const label = s.toUpperCase().replace('_', ' ');
            const stageNode = dashboardData.summary?.[s];
            return { name: label, ...getBreakdownData(stageNode, selCategory) };
        });

        // 2. Comparison (Right Chart - Geographical / Hierarchical Array)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => ({
                name: node.label,
                'Total MI': Number(node.total_mi || 0),
                'Total SAT': Number(node.total_sat || 0),
                'SAT Progress %': Number(node.sat_progress_pct || 0)
            }));
        }

        return { 
            trend, 
            distribution,
            summary: {
                'Total MI': dashboardData.total_mi || 0,
                'Total SAT': dashboardData.total_sat || 0,
                'SAT Progress %': dashboardData.sat_progress_pct || 0,
                'SAT Stage 1': getBucketVal(dashboardData.summary, 'sat_1', selCategory),
                'SAT Stage 2': getBucketVal(dashboardData.summary, 'sat_2', selCategory),
                'SAT Stage 3': getBucketVal(dashboardData.summary, 'sat_3', selCategory),
                'SAT Stage 4': getBucketVal(dashboardData.summary, 'sat_4', selCategory),
                'SAT Stage 5': getBucketVal(dashboardData.summary, 'sat_5', selCategory),
                'SAT Stage 6': getBucketVal(dashboardData.summary, 'sat_6', selCategory),
                'SAT Stage 7': getBucketVal(dashboardData.summary, 'sat_7', selCategory),
                'SAT Stage 8': getBucketVal(dashboardData.summary, 'sat_8', selCategory),
                'SAT Stage 9': getBucketVal(dashboardData.summary, 'sat_9', selCategory),
            },
            category_breakdown: dashboardData.category_breakdown
        };
    }
    
    // Non-SAT Ageing
    // Non-SAT Ageing Dashboard (New Consolidated)
    if (n.includes('non-sat ageing') || n.includes('non sat ageing')) {
        const dashboardData = trendData; // shared: true
        const selCategory = (params?.category || params?.meter_category || 'total').toUpperCase();

        // 1. Snapshot Ageing Buckets (Left Chart)
        const buckets = [
            { key: 'age_0_30', label: 'age 0-30' },
            { key: 'age_31_60', label: 'age 31-60' },
            { key: 'age_61_90', label: 'age 61-90' },
            { key: 'age_91_120', label: 'age 91-120' },
            { key: 'age_120_plus', label: 'age 120+' }
        ];

        trend = buckets.map(b => {
            const bucketNode = dashboardData.summary?.[b.key];
            return { name: b.label, ...getBreakdownData(bucketNode, selCategory) };
        });

        // 2. Comparison (Geographical Array)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => {
                const point = { name: node.label || 'Unknown' };
                let sum = 0;
                buckets.forEach(b => {
                    const val = getBucketVal(node, b.key, selCategory);
                    point[b.label] = val;
                    sum += val;
                });
                point.total = sum;
                return point;
            });
        }

        return { 
            trend, 
            distribution,
            summary: {
                'Total Non-SAT': dashboardData.total_non_sat || 0,
                'age 0-30': getBucketVal(dashboardData.summary, 'age_0_30', selCategory),
                'age 31-60': getBucketVal(dashboardData.summary, 'age_31_60', selCategory),
                'age 61-90': getBucketVal(dashboardData.summary, 'age_61_90', selCategory),
                'age 91-120': getBucketVal(dashboardData.summary, 'age_91_120', selCategory),
                'age 120+': getBucketVal(dashboardData.summary, 'age_120_plus', selCategory),
            },
            category_breakdown: dashboardData.category_breakdown
        };
    }

    // MI vs SAT vs Invoice Funnel (KPI 11)
    if (n.includes('mi vs sat vs invoice') || n.includes('funnel')) {
        const dashboardData = trendData; // shared: true
        const selCategory = (params?.category || params?.meter_category || 'total').toUpperCase();

        const stages = [
            { key: 'mi', label: 'MI' },
            { key: 'sat', label: 'SAT' },
            { key: 'lumpsum_invoice', label: 'Lumpsum Inv' },
            { key: 'pmpm_invoice', label: 'PMPM Inv' }
        ];

        // 1. Snapshot Funnel (Left Chart)
        trend = stages.map(st => {
            const label = st.label;
            const stageKey = `total_${st.key}`;
            const stageSummary = dashboardData.summary?.[stageKey];

            return { name: label, ...getBreakdownData(stageSummary, selCategory) };
        });

        // 2. Comparison (Right Chart)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => {
                const mi = Number(node.total_mi?.total ?? node.total_mi ?? 0);
                const sat = Number(node.total_sat?.total ?? node.total_sat ?? 0);
                const lumpsum = Number(node.total_lumpsum_invoice?.total ?? node.total_lumpsum_invoice ?? 0);
                const pmpm = Number(node.total_pmpm_invoice?.total ?? node.total_pmpm_invoice ?? 0);
                
                return {
                    name: node.label || 'Unknown',
                    'total mi': mi,
                    'total sat': sat,
                    'total lumpsum invoice': lumpsum,
                    'total pmpm invoice': pmpm,
                    total: mi // For Funnel comparison, MI is usually the baseline "Total"
                };
            });
        }

        return { 
            trend, 
            distribution,
            summary: {
                'Total MI': dashboardData.summary?.total_mi?.total || 0,
                'Total SAT': dashboardData.summary?.total_sat?.total || 0,
                'Total Invoiced': (Number(dashboardData.summary?.total_lumpsum_invoice?.total || 0) + Number(dashboardData.summary?.total_pmpm_invoice?.total || 0))
            }
        };
    }




    // Revenue Realized Summary
    if ((n.includes('revenue realized') || n.includes('invoice vs revenue released')) && !n.includes('ageing') && !n.includes('meter journey') && !n.includes('meters journey')) {
        const dashboardData = trendData; // shared: true
        const selCategory = (params?.category || params?.meter_category || 'total').toUpperCase();

        const realizationStages = [
            { key: 'lumpsum_invoice', label: 'Lumpsum Invoice' },
            { key: 'pmpm_invoice', label: 'PMPM Invoice' },
            { key: 'lumpsum_collection', label: 'Lumpsum Collection' },
            { key: 'pmpm_collection', label: 'PMPM Collection' }
        ];

        // 1. Snapshot Stages (Left Chart)
        trend = realizationStages.map(st => {
            const node = dashboardData.summary?.['total_' + st.key];
            return { name: st.label, ...getBreakdownData(node, selCategory) };
        });

        // 2. Comparison (Right Chart)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => {
                const point = { name: node.label || 'Unknown' };
                // Use pmpm_collection as the metric for comparison
                const pmpmNode = node['total_pmpm_collection'];
                const val = getBucketVal({ val: pmpmNode }, 'val', selCategory);
                
                if (selCategory === 'TOTAL') {
                    point.Realized = val;
                } else {
                    const catLabel = (selCategory === 'DT' || selCategory === 'DTR') ? 'DT' : (selCategory.charAt(0) + selCategory.slice(1).toLowerCase());
                    point[catLabel] = val;
                }
                return point;
            });
        }

        return { 
            trend, 
            distribution,
            summary: {
                'Lumpsum Invoice': getBucketVal({ val: dashboardData.summary?.total_lumpsum_invoice }, 'val', selCategory),
                'PMPM Invoice': getBucketVal({ val: dashboardData.summary?.total_pmpm_invoice }, 'val', selCategory),
                'Lumpsum Collection': getBucketVal({ val: dashboardData.summary?.total_lumpsum_collection }, 'val', selCategory),
                'PMPM Collection': getBucketVal({ val: dashboardData.summary?.total_pmpm_collection }, 'val', selCategory),
            }
        };
    }    // Revenue Ageing Summary
    if (n.includes('revenue') && n.includes('ageing')) {
        const dashboardData = trendData; // shared: true
        const selCategory = (params?.category || params?.meter_category || 'total').toUpperCase();

        const ageBuckets = [
            { key: 'age_0_30', label: 'age 0-30' },
            { key: 'age_31_60', label: 'age 31-60' },
            { key: 'age_61_90', label: 'age 61-90' },
            { key: 'age_90_plus', label: 'age 90+' }
        ];

        // 1. Snapshot Breakdown (Left Chart)
        trend = ageBuckets.map(bucket => {
            const bucketNode = dashboardData.summary?.[bucket.key];
            return { name: bucket.label, ...getBreakdownData(bucketNode, selCategory) };
        });

        // 2. Comparison (Right Chart)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => {
                const point = { name: node.label || 'Unknown' };
                let sum = 0;
                ageBuckets.forEach(b => {
                    const val = getBucketVal(node, b.key, selCategory);
                    point[b.label] = val;
                    sum += val;
                });
                point.total = sum;
                return point;
            });
        }

        return { 
            trend, 
            distribution,
            summary: {
                'Total Pending': dashboardData.summary?.total_pending || 0,
                'age 0-30': getBucketVal(dashboardData.summary, 'age_0_30', selCategory),
                'age 31-60': getBucketVal(dashboardData.summary, 'age_31_60', selCategory),
                'age 61-90': getBucketVal(dashboardData.summary, 'age_61_90', selCategory),
                'age 90+': getBucketVal(dashboardData.summary, 'age_90_plus', selCategory),
            },
            category_breakdown: dashboardData.category_breakdown
        };
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
                    const point = { name: label, _rawDate: period, DT: 0, Consumer: 0, Feeder: 0 };
                    
                    const dtData = getCategoryData(data, 'DT');
                    if (dtData?.total) {
                        point.DT = (Number(dtData.total.meter_burnt) || 0) + (Number(dtData.total.meter_faulty) || 0) + (Number(dtData.total.others) || 0);
                    }

                    const conData = getCategoryData(data, 'CONSUMER');
                    if (conData?.total) {
                        point.Consumer = (Number(conData.total.meter_burnt) || 0) + (Number(conData.total.meter_faulty) || 0) + (Number(conData.total.others) || 0);
                    }
                    
                    const fdData = getCategoryData(data, 'FEEDER');
                    if (fdData?.total) {
                        point.Feeder = (Number(fdData.total.meter_burnt) || 0) + (Number(fdData.total.meter_faulty) || 0) + (Number(fdData.total.others) || 0);
                    }
                    
                    point.total = (Number(point.DT) + Number(point.Consumer) + Number(point.Feeder));
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

    // Meter Journey Dashboard (Consolidated)
    if (n.includes('meter journey') || n.includes('meters journey')) {
        // Unwrap if the API wraps response under a 'data' key
        const raw = trendData;
        const dashboardData = (raw?.data && (raw.data.summary || raw.data.comparison)) ? raw.data : raw;
        const selCategory = (params?.category || params?.meter_category || 'total').toUpperCase();

        const stages = [
            { key: 'inventory_to_store', label: 'Inv to Store' },
            { key: 'store_to_agency', label: 'Store to Agency' },
            { key: 'agency_to_meter_installation', label: 'Agency to Install' },
            { key: 'meter_installation_to_sat', label: 'Install to SAT' },
            { key: 'sat_to_invoice', label: 'SAT to Invoice' },
            { key: 'invoice_to_revenue', label: 'Invoice to Revenue' },
            { key: 'total_journey', label: 'Total Journey' }
        ];

        // 1. Stage-wise Analysis (Left Chart)
        // Each stage on X-axis with a single 'Avg Days' bar from the global summary.
        const summaryData = dashboardData?.summary || {};

        trend = stages.map(st => {
            const node = summaryData[st.key];
            return { name: st.label, ...getBreakdownData(node, selCategory, 'Avg Days') };
        });

        // 2. Comparison (Right Chart - Hierarchical)
        if (Array.isArray(dashboardData?.comparison) && dashboardData.comparison.length > 0) {
            distribution = dashboardData.comparison.map(node => {
                const point = { name: node.label || 'Unknown' };
                stages.forEach(st => {
                    point[st.label] = getBucketVal(node, st.key, selCategory);
                });
                return point;
            });
        }

        return {
            trend,
            distribution,
            summary: {
                'Avg Store Time': getBucketVal(summaryData, 'inventory_to_store', selCategory),
                'Avg Agency allocation': getBucketVal(summaryData, 'store_to_agency', selCategory),
                'Avg Installation': getBucketVal(summaryData, 'agency_to_meter_installation', selCategory),
                'Avg SAT': getBucketVal(summaryData, 'meter_installation_to_sat', selCategory),
                'Avg Invoicing': getBucketVal(summaryData, 'sat_to_invoice', selCategory),
                'Avg Revenue': getBucketVal(summaryData, 'invoice_to_revenue', selCategory),
                'Total Journey': getBucketVal(summaryData, 'total_journey', selCategory),
                'Total Meters': getBucketVal(summaryData, 'meter_count', selCategory)
            },
            category_breakdown: dashboardData.category_breakdown
        };
    }

    // Meter Stage (Funnel: Inventory -> Installed -> SAT -> Revenue)
    if (n.includes('meter stage') || n.includes('meters stage') || n.includes('meter current stage') || n.includes('meters current stage')) {
        const dashboardData = trendData; // shared: true
        const selCategory = (params?.category || params?.meter_category || 'total').toUpperCase();

        const stages = [
            { key: 'inventory', label: 'Inventory' },
            { key: 'installed', label: 'Installed' },
            { key: 'sat_done', label: 'SAT Done' },
            { key: 'invoice_done', label: 'Invoice Done' }
        ];

        // 1. Funnel/Trend (Left Chart)
        trend = stages.map(st => {
            const node = dashboardData.summary?.[st.key];
            return { name: st.label, ...getBreakdownData(node, selCategory) };
        });

        // 2. Comparison (Right Chart)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => {
                const point = { name: node.label || 'Unknown' };
                stages.forEach(st => {
                    point[st.label] = getBucketVal(node, st.key, selCategory);
                });
                return point;
            });
        }

        return { 
            trend, 
            distribution,
            summary: {
                'Total Inventory': getBucketVal(dashboardData.summary, 'inventory', selCategory),
                'Total Installed': getBucketVal(dashboardData.summary, 'installed', selCategory),
                'SAT Done': getBucketVal(dashboardData.summary, 'sat_done', selCategory),
                'Invoice Done': getBucketVal(dashboardData.summary, 'invoice_done', selCategory)
            }
        };
    }

    // O&M Team Productivity
    if ((n.includes('o&m') || n.includes('om')) && n.includes('productivity') && n.includes('team')) {
        const dashboardData = trendData; // Since shared: true
        
        // 1. Trend Analysis
        if (Array.isArray(dashboardData?.trend)) {
            trend = dashboardData.trend.map(node => ({
                name: formatLabel(node.date || node.period_value),
                Productivity: node.productivity_per_technician_per_day || 0,
                'Closed Tickets': node.total_closed_tickets || 0,
                Technicians: node.active_technicians || 0
            }));
        }
        
        // 2. Comparison
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => ({
                name: node.label,
                Productivity: node.productivity_per_technician_per_day || 0,
                'Closed Tickets': node.total_closed_tickets || 0,
                Technicians: node.active_technicians || 0
            }));
        }
        
        return { 
            trend, 
            distribution, 
            summary: dashboardData?.summary, 
            insights: dashboardData?.insights, 
            category_breakdown: dashboardData?.category_breakdown 
        };
    }

    // O&M Productivity Trend
    if ((n.includes('o&m') || n.includes('om')) && n.includes('productivity trend')) {
        const dashboardData = trendData; // Since shared: true
        
        // 1. Trend Analysis
        if (Array.isArray(dashboardData?.trend)) {
            trend = dashboardData.trend.map(node => ({
                name: formatLabel(node.month || node.date || node.period_value),
                Productivity: node.productivity_per_technician_per_day || 0,
                'Closed Tickets': node.total_closed_tickets || 0,
                'Active Days': node.active_days || 0,
                Technicians: node.avg_active_technicians || 0
            }));
        }
        
        // 2. Comparison
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => ({
                name: node.label,
                Productivity: node.productivity_per_technician_per_day || 0
            }));
        }
        
        return { 
            trend, 
            distribution, 
            summary: dashboardData?.summary, 
            insights: dashboardData?.insights, 
            category_breakdown: dashboardData?.category_breakdown 
        };
    }

    // O&M Open Ageing
    if (n.includes('not closed') && n.includes('ageing')) {
        const dashboardData = trendData; // shared: true
        const selCategory = (params?.meter_category || 'TOTAL').toUpperCase();
        
        const buckets = [
            { key: 'age_less_than_3_days', label: '< 3 Days' },
            { key: 'age_less_than_7_days', label: '3-7 Days' },
            { key: 'age_less_than_15_days', label: '7-15 Days' },
            { key: 'age_less_than_30_days', label: '15-30 Days' },
            { key: 'age_less_than_3_months', label: '1-3 Months' },
            { key: 'age_less_than_6_months', label: '3-6 Months' },
            { key: 'age_6_months_and_above', label: '> 6 Months' }
        ];

        // 1. Trend Analysis
        if (Array.isArray(dashboardData?.trend)) {
            trend = dashboardData.trend.map(node => ({
                name: formatLabel(node.period_value),
                'Auto Ticketing': node.auto_ticketing || 0,
                '1912 Helpdesk': node['1912_helpdesk'] || 0,
                Others: node.others || 0,
                total: (node.auto_ticketing || 0) + (node['1912_helpdesk'] || 0) + (node.others || 0)
            }));
        }

        // 2. Ageing Distribution (Bar Chart)
        const summaryObj = (selCategory === 'TOTAL') ? dashboardData.summary : dashboardData.category_breakdown?.[selCategory];
        const ageBuckets = summaryObj?.age_buckets || {};
        
        distribution = buckets.map(b => {
            const auto = ageBuckets[b.key]?.auto_ticketing || 0;
            const helpdesk = ageBuckets[b.key]?.['1912_helpdesk'] || 0;
            const others = ageBuckets[b.key]?.others || 0;
            return {
                name: b.label,
                'Auto Ticketing': auto,
                '1912 Helpdesk': helpdesk,
                'Others': others,
                total: auto + helpdesk + others
            };
        });

        return { 
            trend, 
            distribution,
            summary: {
               'Total Open': summaryObj?.total_open || 0,
               'Auto Ticketing': summaryObj?.auto_ticketing || 0,
               '1912 Helpdesk': summaryObj?.['1912_helpdesk'] || 0,
               'Others': summaryObj?.others || 0
            }
        };
    }

    // O&M Avg Closure Time
    if (n.includes('closure') && n.includes('avg')) {
        const dashboardData = trendData; // shared: true
        
        // 1. Trend Analysis
        if (Array.isArray(dashboardData?.trend)) {
            trend = dashboardData.trend.map(node => ({
                name: formatLabel(node.period_value),
                'Avg Days': node.avg_resolution_days || 0,
                'Closed Tickets': node.total_closed_tickets || 0
            }));
        }
        
        // 2. Comparison
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => ({
                name: node.label,
                'Avg Days': node.avg_resolution_days || 0,
                'Closed Tickets': node.total_closed_tickets || 0
            }));
        }
        
        return { 
            trend, 
            distribution, 
            summary: dashboardData?.summary, 
            category_breakdown: dashboardData?.category_breakdown 
        };
    }

    // O&M Closed Analysis (New Dashboard Endpoint)
    if (n.includes('closed analysis')) {
        const dashboardData = trendData; // shared: true
        const selCategory = (params?.category || params?.meter_category || 'total').toUpperCase();
        
        // 1. Trend Analysis
        if (Array.isArray(dashboardData?.trend)) {
            trend = dashboardData.trend.map(node => {
                const auto = node.auto_ticketing || 0;
                const helpdesk = node['1912_helpdesk'] || 0;
                const others = node.others || 0;
                const sum = auto + helpdesk + others;
                return {
                    name: formatLabel(node.period_value),
                    'Auto Ticketing': auto,
                    '1912 Helpdesk': helpdesk,
                    Others: others,
                    total: sum
                };
            });
        }
        
        // 2. Comparison (Geographical)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => {
                const auto = node.auto_ticketing || 0;
                const helpdesk = node['1912_helpdesk'] || 0;
                const others = node.others || 0;
                const sum = auto + helpdesk + others;
                
                return {
                    name: node.label || 'Unknown',
                    'Auto Ticketing': auto,
                    '1912 Helpdesk': helpdesk,
                    Others: others,
                    value: sum,
                    total: sum
                };
            });
        }
        
        return { 
            trend, 
            distribution, 
            summary: {
                'Total Closed': (dashboardData.summary?.auto_ticketing || 0) + (dashboardData.summary?.['1912_helpdesk'] || 0) + (dashboardData.summary?.others || 0),
                'Auto Ticketing': dashboardData.summary?.auto_ticketing || 0,
                '1912 Helpdesk': dashboardData.summary?.['1912_helpdesk'] || 0,
                'Others': dashboardData.summary?.others || 0
            },
            category_breakdown: dashboardData.category_breakdown 
        };
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
