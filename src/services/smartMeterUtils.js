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
        
        // 1. Trend Analysis
        if (Array.isArray(dashboardData?.trend)) {
            trend = dashboardData.trend.map(node => ({
                name: formatLabel(node.period_value),
                Burnt: node.burnt || 0,
                Faulty: node.faulty || 0,
                Others: node.others || 0
            }));
        }
        
        // 2. Comparison
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => ({
                name: node.label,
                Burnt: node.burnt || 0,
                Faulty: node.faulty || 0,
                Others: node.others || 0,
                value: node.total_defective || 0
            }));
        }

        return { 
            trend, 
            distribution, 
            summary: {
                'Total Defective': dashboardData.total_defective,
                'Meter Burnt': dashboardData.total_burnt,
                'Meter Faulty': dashboardData.total_faulty,
                'Others': dashboardData.total_others
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
            const point = { name: b.label };
            // Since it's a snapshot, we use the top-level or summary breakdown for the trend bars
            if (selCategory === 'TOTAL') {
                ['CONSUMER', 'DT', 'FEEDER'].forEach(cat => {
                    const catData = dashboardData.category_breakdown?.[cat];
                    const summary = catData?.total || catData;
                    const displayKey = cat === 'DT' ? 'DT' : (cat.charAt(0) + cat.slice(1).toLowerCase());
                    point[displayKey] = Number(summary?.[b.key] || 0);
                });
            } else {
                const catData = dashboardData.category_breakdown?.[selCategory];
                const summary = catData?.total || catData;
                const displayKey = selCategory === 'DT' ? 'DT' : (selCategory.charAt(0) + selCategory.slice(1).toLowerCase());
                point[displayKey] = Number(summary?.[b.key] || 0);
            }
            return point;
        });

        // 2. Comparison (Geographical / Comparison Array)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => {
                const point = { name: node.label || 'Unknown' };
                bucketKeys.forEach(b => {
                    point[b.label] = getBucketVal(node, b.key, selCategory);
                });
                return point;
            });
        }

        return { 
            trend, 
            distribution,
            summary: {
                'Total Stock': dashboardData.total_stock || 0,
                '0-30 Days': dashboardData.age_0_30 || 0,
                '31-60 Days': dashboardData.age_31_60 || 0,
                '61-90 Days': dashboardData.age_61_90 || 0,
                '90+ Days': dashboardData.age_90_plus || 0
            }
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
            const point = { name: label };
            
            if (selCategory === 'TOTAL') {
                point.Consumer = dashboardData.category_breakdown?.CONSUMER?.total?.[s] || 0;
                point.DT = dashboardData.category_breakdown?.DT?.total?.[s] || 0;
                point.Feeder = dashboardData.category_breakdown?.FEEDER?.total?.[s] || 0;
            } else {
                const catData = dashboardData.category_breakdown?.[selCategory];
                point[selCategory.charAt(0) + selCategory.slice(1).toLowerCase()] = catData?.total?.[s] || 0;
            }
            return point;
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
                'SAT Stage 1': dashboardData.sat_1 || 0,
                'SAT Stage 2': dashboardData.sat_2 || 0,
                'SAT Stage 3': dashboardData.sat_3 || 0,
                'SAT Stage 4': dashboardData.sat_4 || 0,
                'SAT Stage 5': dashboardData.sat_5 || 0,
                'SAT Stage 6': dashboardData.sat_6 || 0,
                'SAT Stage 7': dashboardData.sat_7 || 0,
                'SAT Stage 8': dashboardData.sat_8 || 0,
                'SAT Stage 9': dashboardData.sat_9 || 0,
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

        // Use shared getBucketVal for robust extraction

        trend = buckets.map(b => {
            const point = { name: b.label };
            const bucketSummary = dashboardData.summary?.[b.key];

            if (selCategory === 'TOTAL') {
                // If summary has nested categories, use them
                if (bucketSummary && typeof bucketSummary === 'object' && bucketSummary.total !== undefined) {
                    ['CONSUMER', 'DT', 'FEEDER'].forEach(cat => {
                        const val = Number(bucketSummary[cat] || 0);
                        const displayKey = cat === 'DT' ? 'DT' : (cat.charAt(0) + cat.slice(1).toLowerCase());
                        point[displayKey] = val;
                    });
                } else {
                    // Fallback if summary is flat
                    point.Value = Number(dashboardData.summary?.[b.key] || 0);
                }
            } else {
                // Specific category selection
                if (bucketSummary && typeof bucketSummary === 'object' && bucketSummary[selCategory] !== undefined) {
                    const val = Number(bucketSummary[selCategory] || 0);
                    const displayKey = selCategory === 'DT' ? 'DT' : (selCategory.charAt(0) + selCategory.slice(1).toLowerCase());
                    point[displayKey] = val;
                } else {
                    const catData = dashboardData.category_breakdown?.[selCategory];
                    const displayKey = selCategory === 'DT' ? 'DT' : (selCategory.charAt(0) + selCategory.slice(1).toLowerCase());
                    point[displayKey] = getVal(catData, b.key);
                }
            }
            return point;
        });

        // 2. Comparison (Geographical Array)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => {
                const point = {
                    name: node.label,
                    value: Number(node.count || 0),
                };
                
                // Add buckets for stacked geographical comparison
                buckets.forEach(b => {
                    point[b.label] = getBucketVal(node, b.key, selCategory);
                });

                return point;
            });
        }

        return { 
            trend, 
            distribution,
            summary: {
                'Total Non-SAT': dashboardData.total_non_sat || 0,
                'Consumer': dashboardData.category_breakdown?.CONSUMER || 0,
                'DT': dashboardData.category_breakdown?.DT || 0,
                'Feeder': dashboardData.category_breakdown?.FEEDER || 0
            }
        };
    }

    // MI vs SAT vs Invoice Funnel (KPI 11)
    if (n.includes('mi vs sat vs invoice') || n.includes('funnel')) {
        const dashboardData = trendData; // shared: true
        const selCategory = (params?.category || params?.meter_category || 'total').toUpperCase();

        const stages = [
            { key: 'mi', label: 'mi' },
            { key: 'sat', label: 'sat' },
            { key: 'lumpsum_invoice', label: 'lumpsum_invoice' },
            { key: 'pmpm_invoice', label: 'pmpm_invoice' }
        ];

        // 1. Snapshot Funnel (Left Chart)
        trend = stages.map(st => {
            const point = { name: st.label };
            if (selCategory === 'TOTAL') {
                ['CONSUMER', 'DT', 'FEEDER'].forEach(cat => {
                    const catData = dashboardData.category_breakdown?.[cat];
                    const catLabel = cat.charAt(0) + cat.slice(1).toLowerCase();
                    if (catData) {
                        const m = catData.total || catData;
                        point[catLabel] = Number(m[st.key] || m[`total_${st.key}`] || 0);
                    } else {
                        point[catLabel] = 0;
                    }
                });
            } else {
                const catData = dashboardData.category_breakdown?.[selCategory];
                const catLabel = selCategory.charAt(0) + selCategory.slice(1).toLowerCase();
                if (catData) {
                    const m = catData.total || catData;
                    point[catLabel] = Number(m[st.key] || m[`total_${st.key}`] || 0);
                } else {
                    point[catLabel] = 0;
                }
            }
            return point;
        });

        // 2. Comparison (Right Chart)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => ({
                name: node.label || 'Unknown',
                'total_mi': Number(node.total_mi || 0),
                'total_sat': Number(node.total_sat || 0),
                'total_lumpsum_invoice': Number(node.total_lumpsum_invoice || 0),
                'total_pmpm_invoice': Number(node.total_pmpm_invoice || 0)
            }));
        }

        return { 
            trend, 
            distribution,
            summary: {
                'Total MI': dashboardData.total_mi || 0,
                'Total SAT': dashboardData.total_sat || 0,
                'Total Invoiced': dashboardData.total_invoice || (Number(dashboardData.total_lumpsum_invoice || 0) + Number(dashboardData.total_pmpm_invoice || 0))
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
            const point = { name: st.label };
            if (selCategory === 'TOTAL') {
                point.Consumer = Number(dashboardData.category_breakdown?.CONSUMER?.total?.[st.key] || 0);
                point.DT = Number(dashboardData.category_breakdown?.DT?.total?.[st.key] || 0);
                point.Feeder = Number(dashboardData.category_breakdown?.FEEDER?.total?.[st.key] || 0);
            } else {
                const catData = dashboardData.category_breakdown?.[selCategory];
                const catLabel = selCategory.charAt(0) + selCategory.slice(1).toLowerCase();
                point[catLabel] = Number(catData?.total?.[st.key] || catData?.[st.key] || 0);
            }
            return point;
        });

        // 2. Comparison (Right Chart)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => {
                const point = { name: node.label || 'Unknown' };
                // Use pmpm_collection as the metric for comparison
                const val = Number(node.count?.pmpm_collection || 0);
                if (selCategory === 'TOTAL') {
                    point.Realized = val;
                } else {
                    const catLabel = selCategory.charAt(0) + selCategory.slice(1).toLowerCase();
                    point[catLabel] = val;
                }
                return point;
            });
        }

        return { 
            trend, 
            distribution,
            summary: {
                'Total Realized': dashboardData.total_pmpm_collection || 0
            }
        };
    }

    // Revenue Ageing Summary
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
            const point = { name: bucket.label };
            if (selCategory === 'TOTAL') {
                ['CONSUMER', 'DT', 'FEEDER'].forEach(cat => {
                    const catData = dashboardData.category_breakdown?.[cat];
                    const catLabel = cat.charAt(0) + cat.slice(1).toLowerCase();
                    let total = 0;
                    if (catData) {
                        Object.values(catData).forEach(techData => {
                            total += Number(techData?.[bucket.key] || techData?.total?.[bucket.key] || 0);
                        });
                    }
                    point[catLabel] = total;
                });
            } else {
                const catData = dashboardData.category_breakdown?.[selCategory];
                const catLabel = selCategory.charAt(0) + selCategory.slice(1).toLowerCase();
                let total = 0;
                if (catData) {
                    Object.values(catData).forEach(techData => {
                        total += Number(techData?.[bucket.key] || techData?.total?.[bucket.key] || 0);
                    });
                }
                point[catLabel] = total;
            }
            return point;
        });

        // 2. Comparison (Right Chart)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => {
                const point = { name: node.label || 'Unknown' };
                point['age 0-30'] = Number(node.age_0_30 || 0);
                point['age 31-60'] = Number(node.age_31_60 || 0);
                point['age 61-90'] = Number(node.age_61_90 || 0);
                point['age 90+'] = Number(node.age_90_plus || 0);
                return point;
            });
        }

        return { 
            trend, 
            distribution,
            summary: {
                'Total Overdue': dashboardData.total_overdue || trend.reduce((acc, p) => acc + (p.Value || 0), 0)
            }
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
        trend = stages.map(st => ({
            name: st.label,
            'Avg Days': Number(summaryData[st.key] ?? 0)
        }));

        // 2. Comparison (Right Chart - Hierarchical)
        if (Array.isArray(dashboardData?.comparison) && dashboardData.comparison.length > 0) {
            distribution = dashboardData.comparison.map(node => ({
                name: node.label || formatLabel(node.period_value),
                'Inv to Store': Number(node.inventory_to_store || 0),
                'Store to Agency': Number(node.store_to_agency || 0),
                'Agency to Install': Number(node.agency_to_meter_installation || 0),
                'Install to SAT': Number(node.meter_installation_to_sat || 0),
                'SAT to Invoice': Number(node.sat_to_invoice || 0),
                'Invoice to Revenue': Number(node.invoice_to_revenue || 0),
                'Total Journey': Number(node.total_journey || 0)
            }));
        }

        return {
            trend,
            distribution,
            summary: {
                'Avg Store Time': summaryData.inventory_to_store || 0,
                'Avg Agency allocation': summaryData.store_to_agency || 0,
                'Avg Installation': summaryData.agency_to_meter_installation || 0,
                'Avg SAT': summaryData.meter_installation_to_sat || 0,
                'Avg Invoicing': summaryData.sat_to_invoice || 0,
                'Avg Revenue': summaryData.invoice_to_revenue || 0,
                'Total Journey': summaryData.total_journey || 0,
                'Total Meters': summaryData.meter_count || 0
            }
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
            { key: 'revenue_collected', label: 'Revenue Realized' }
        ];

        // 1. Funnel/Trend (Left Chart)
        trend = stages.map(st => {
            const point = { name: st.label };
            if (selCategory === 'TOTAL') {
                point.Count = Number(dashboardData[st.key] || 0);
            } else {
                const catData = dashboardData.category_breakdown?.[selCategory];
                const catLabel = selCategory.charAt(0) + selCategory.slice(1).toLowerCase();
                point[catLabel] = Number(catData?.total?.[st.key] || 0);
            }
            return point;
        });

        // 2. Comparison (Right Chart)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => ({
                name: node.label || 'Unknown',
                'Inventory': Number(node.inventory || 0),
                'Installed': Number(node.installed || 0),
                'SAT Done': Number(node.sat_done || 0),
                'Revenue Realized': Number(node.revenue_collected || 0)
            }));
        }

        return { 
            trend, 
            distribution,
            summary: {
                'Total Inventory': dashboardData.inventory || 0,
                'Total Installed': dashboardData.installed || 0,
                'SAT Done': dashboardData.sat_done || 0,
                'Revenue Realized': dashboardData.revenue_collected || 0
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
                Others: node.others || 0
            }));
        }

        // 2. Ageing Distribution (Bar Chart)
        const summaryObj = (selCategory === 'TOTAL') ? dashboardData.summary : dashboardData.category_breakdown?.[selCategory];
        const ageBuckets = summaryObj?.age_buckets || {};
        
        distribution = buckets.map(b => ({
            name: b.label,
            'Auto Ticketing': ageBuckets[b.key]?.auto_ticketing || 0,
            '1912 Helpdesk': ageBuckets[b.key]?.['1912_helpdesk'] || 0,
            'Others': ageBuckets[b.key]?.others || 0
        }));

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
        
        // 1. Trend Analysis
        if (Array.isArray(dashboardData?.trend)) {
            trend = dashboardData.trend.map(node => ({
                name: formatLabel(node.period_value),
                'Auto Ticketing': node.auto_ticketing || 0,
                '1912 Helpdesk': node['1912_helpdesk'] || 0,
                Others: node.others || 0
            }));
        }
        
        // 2. Comparison (Geographical)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => ({
                name: node.label,
                'Auto Ticketing': node.auto_ticketing || 0,
                '1912 Helpdesk': node['1912_helpdesk'] || 0,
                Others: node.others || 0,
                value: (node.auto_ticketing || 0) + (node['1912_helpdesk'] || 0) + (node.others || 0)
            }));
        }
        
        return { 
            trend, 
            distribution, 
            summary: dashboardData?.summary, 
            category_breakdown: dashboardData?.category_breakdown 
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
