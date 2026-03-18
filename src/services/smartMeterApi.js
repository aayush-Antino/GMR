const BASE_URL = 'https://2nbdzssr-8000.inc1.devtunnels.ms';

/**
 * Build a URLSearchParams string from a params object, skipping null/undefined values.
 */
function buildQuery(params = {}) {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== '') {
            q.append(key, val);
        }
    });
    return q.toString();
}

async function apiFetch(path, params = {}) {
    const query = buildQuery(params);
    const url = `${BASE_URL}${path}${query ? `?${query}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`API error ${response.status} on ${path}`);
    }
    return response.json();
}

// ──────────────────────────────────────────────
// Dashboard Overview
// ──────────────────────────────────────────────
export async function fetchDashboardOverview(params = {}) {
    return apiFetch('/api/dashboard/overview', params);
}

// ──────────────────────────────────────────────
// KPI 1 – MI Progress
// Response: { total_progress, category_breakdown, period_breakdown: [{period_value, progress}] }
// ──────────────────────────────────────────────
export async function fetchMIProgress(params = {}) {
    return apiFetch('/api/mi/progress/summary', params);
}

export async function fetchMIProgressDetail(params = {}) {
    return apiFetch('/api/mi/progress', params);
}

// ──────────────────────────────────────────────
// KPI 2 – MI Productivity
// Response: [{ technician, period_value, daily_installations, discom }]
// ──────────────────────────────────────────────
export async function fetchMIProductivity(params = {}) {
    return apiFetch('/api/mi/productivity', params);
}

// ──────────────────────────────────────────────
// KPI 3 – Monthly Productivity
// Requires: period_value (YYYY-MM)
// Summary Response: { total_installations, period_value }
// ──────────────────────────────────────────────
export async function fetchMonthlyProductivitySummary(params = {}) {
    // period_value is REQUIRED for this endpoint in YYYY-MM format
    if (!params.period_value) {
        params.period_value = new Date().toISOString().slice(0, 7); // Default to current month
    }
    return apiFetch('/api/mi/monthly-productivity/summary', params);
}

export async function fetchMonthlyProductivityDetail(params = {}) {
    return apiFetch('/api/mi/monthly-productivity', params);
}

// ──────────────────────────────────────────────
// KPI 4 – Inventory Utilization
// Summary Response: { total_inventory, total_installed, utilization_rate_pct, remaining_stock }
// ──────────────────────────────────────────────
export async function fetchInventoryUtilizationSummary(params = {}) {
    return apiFetch('/api/mi/inventory-utilization/summary', params);
}

export async function fetchInventoryUtilizationDetail(params = {}) {
    return apiFetch('/api/mi/inventory-utilization', params);
}

// ──────────────────────────────────────────────
// KPI 5 – MI Pace vs Stock
// Summary Response: { total_inventory, total_installed, utilization_rate_pct, remaining_stock }
// ──────────────────────────────────────────────
export async function fetchPaceVsStockSummary(params = {}) {
    return apiFetch('/api/mi/pace-vs-stock/summary', params);
}

export async function fetchPaceVsStockDetail(params = {}) {
    return apiFetch('/api/mi/pace-vs-stock', params);
}

// ──────────────────────────────────────────────
// KPI 6 – Stock Ageing
// Response: [{ meter_serial_number, di_date, installed_ts, ageing_days }]
// ──────────────────────────────────────────────
export async function fetchStockAgeing(params = {}) {
    return apiFetch('/api/mi/stock-ageing', params);
}

// ──────────────────────────────────────────────
// KPI 7 – MI vs SAT
// Response: [{ total_mi, total_sat, sat_progress_pct }]
// ──────────────────────────────────────────────
export async function fetchMIvsSAT(params = {}) {
    return apiFetch('/api/mi/mi-vs-sat', params);
}

// ──────────────────────────────────────────────
// KPI 8 – O&M Team Productivity
// Params: period, om_category
// Response: [{ technician, agency, closed_tickets }]
// ──────────────────────────────────────────────
export async function fetchOMProductivityTeam(params = {}) {
    return apiFetch('/api/om/productivity-team', params);
}

// ──────────────────────────────────────────────
// KPI 9 – O&M Productivity Trend
// Response: [{ closed_month, total_closed_tickets }]
// ──────────────────────────────────────────────
export async function fetchOMProductivityTrend(params = {}) {
    return apiFetch('/api/om/productivity-trend', params);
}

// ──────────────────────────────────────────────
// KPI 10 – O&M Open Ageing
// Response: [{ ticket_id, created_date, ageing_days }]
// ──────────────────────────────────────────────
export async function fetchOMOpenAgeing(params = {}) {
    return apiFetch('/api/om/open-ageing', params);
}

// ──────────────────────────────────────────────
// KPI 11 – O&M Avg Closure Time
// Response: [{ avg_resolution_days, period_value_closed }]
// ──────────────────────────────────────────────
export async function fetchOMAvgClosureTime(params = {}) {
    return apiFetch('/api/om/avg-closure-time', params);
}

// ──────────────────────────────────────────────
// KPI 12 – O&M Closed Analysis
// Response: [{ complaint_type, closed_tickets }]
// ──────────────────────────────────────────────
export async function fetchOMClosedAnalysis(params = {}) {
    return apiFetch('/api/om/closed-analysis', params);
}

// ──────────────────────────────────────────────
// KPI Name → API Fetcher resolver
// Returns: { fetchTrend, fetchDistribution }
// ──────────────────────────────────────────────
export function resolveKPIFetchers(kpiName) {
    const n = kpiName.toLowerCase();

    if (n.includes('mi-progress') || n.includes('mi progress')) {
        return {
            fetchTrend: (p) => fetchMIProgress(p),
            fetchDistribution: (p) => fetchMIProgress(p),
        };
    }
    if (n.includes('productivity per team') && !n.includes('o&m') && !n.includes('o\\&m')) {
        return {
            fetchTrend: (p) => fetchMIProductivity(p),
            fetchDistribution: (p) => fetchMIProductivity(p),
        };
    }
    if (n.includes('monthly productivity')) {
        return {
            fetchTrend: (p) => fetchMonthlyProductivityDetail(p),
            fetchDistribution: (p) => fetchMonthlyProductivitySummary(p),
        };
    }
    if (n.includes('inventory utilization')) {
        return {
            fetchTrend: (p) => fetchInventoryUtilizationDetail(p),
            fetchDistribution: (p) => fetchInventoryUtilizationSummary(p),
        };
    }
    if (n.includes('pace') && n.includes('stock')) {
        return {
            fetchTrend: (p) => fetchPaceVsStockDetail(p),
            fetchDistribution: (p) => fetchPaceVsStockSummary(p),
        };
    }
    if (n.includes('stock ageing') || n.includes('un-utilized stock ageing')) {
        return {
            fetchTrend: (p) => fetchStockAgeing(p),
            fetchDistribution: (p) => fetchStockAgeing(p),
        };
    }
    if (n.includes('mi vs sat') || n.includes('mi vs. sat')) {
        return {
            fetchTrend: (p) => fetchMIvsSAT(p),
            fetchDistribution: (p) => fetchMIvsSAT(p),
        };
    }
    // O&M KPIs
    if ((n.includes('o&m') || n.includes('om')) && n.includes('productivity') && n.includes('team')) {
        return {
            fetchTrend: (p) => fetchOMProductivityTeam(p),
            fetchDistribution: (p) => fetchOMProductivityTeam(p),
        };
    }
    if ((n.includes('o&m') || n.includes('om')) && n.includes('productivity trend')) {
        return {
            fetchTrend: (p) => fetchOMProductivityTrend(p),
            fetchDistribution: (p) => fetchOMProductivityTrend(p),
        };
    }
    if (n.includes('not closed') && n.includes('ageing')) {
        return {
            fetchTrend: (p) => fetchOMOpenAgeing(p),
            fetchDistribution: (p) => fetchOMOpenAgeing(p),
        };
    }
    if (n.includes('closure') && n.includes('avg')) {
        return {
            fetchTrend: (p) => fetchOMAvgClosureTime(p),
            fetchDistribution: (p) => fetchOMAvgClosureTime(p),
        };
    }
    if (n.includes('closed analysis')) {
        return {
            fetchTrend: (p) => fetchOMClosedAnalysis(p),
            fetchDistribution: (p) => fetchOMClosedAnalysis(p),
        };
    }
    return null; // No matching KPI
}

// ──────────────────────────────────────────────
// Transform raw API response → SmartChart data shape
// { trend: [{name, value, ...}], distribution: [{name, value}] }
// ──────────────────────────────────────────────
export function transformAPIResponse(kpiName, trendData, distData) {
    const n = kpiName.toLowerCase();

    // MI Progress Summary
    if (n.includes('mi-progress') || n.includes('mi progress')) {
        const summary = trendData; // both trend and dist come from same summary call
        const trend = (summary?.period_breakdown || []).map(row => ({
            name: row.period_value,
            value: row.progress,
        }));
        const catBreakdown = summary?.category_breakdown || {};
        const distribution = Object.entries(catBreakdown).map(([name, value]) => ({ name, value }));
        return { trend, distribution };
    }

    // MI Productivity
    if (n.includes('productivity per team') && !n.includes('o&m') && !n.includes('o\\&m')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        const trend = rows.map(r => ({ name: r.period_value || r.technician, value: r.daily_installations }));
        // Aggregate by technician for distribution
        const byTech = rows.reduce((acc, r) => {
            acc[r.technician] = (acc[r.technician] || 0) + (r.daily_installations || 0);
            return acc;
        }, {});
        const distribution = Object.entries(byTech).map(([name, value]) => ({ name, value }));
        return { trend, distribution };
    }

    // Monthly Productivity
    if (n.includes('monthly productivity')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        const trend = rows.map(r => ({ name: r.period_value, value: r.total_installations || r.daily_installations }));
        const distSummary = distData;
        const distribution = distSummary?.total_installations != null
            ? [{ name: distSummary.period_value || 'Current', value: distSummary.total_installations }]
            : [];
        return { trend, distribution };
    }

    // Inventory Utilization
    if (n.includes('inventory utilization')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        const trend = rows.map(r => ({ name: r.period_value || r.discom || r.zone, value: r.utilization_rate_pct }));
        const summary = distData;
        const distribution = summary ? [
            { name: 'Installed', value: summary.total_installed },
            { name: 'Remaining', value: summary.remaining_stock },
        ] : [];
        return { trend, distribution };
    }

    // MI Pace vs Stock
    if (n.includes('pace') && n.includes('stock')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        const trend = rows.map(r => ({
            name: r.period_value || r.discom || r.zone,
            installations: r.total_installed,
            stock: r.remaining_stock,
        }));
        const summary = distData;
        const distribution = summary ? [
            { name: 'Installed', value: summary.total_installed },
            { name: 'Remaining', value: summary.remaining_stock },
        ] : [];
        return { trend, distribution };
    }

    // Stock Ageing
    if (n.includes('stock ageing') || n.includes('un-utilized stock ageing')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        // Buckets: 0-30, 31-60, 61-90, 90+
        const buckets = { '0–30 days': 0, '31–60 days': 0, '61–90 days': 0, '90+ days': 0 };
        rows.forEach(r => {
            const d = r.ageing_days || 0;
            if (d <= 30) buckets['0–30 days']++;
            else if (d <= 60) buckets['31–60 days']++;
            else if (d <= 90) buckets['61–90 days']++;
            else buckets['90+ days']++;
        });
        const trend = rows.slice(0, 30).map(r => ({ name: r.meter_serial_number, value: r.ageing_days }));
        const distribution = Object.entries(buckets).map(([name, value]) => ({ name, value }));
        return { trend, distribution };
    }

    // MI vs SAT
    if (n.includes('mi vs sat') || n.includes('mi vs. sat')) {
        const row = Array.isArray(trendData) ? trendData[0] : trendData;
        const trend = row ? [
            { name: 'Total MI', value: row.total_mi },
            { name: 'Total SAT', value: row.total_sat },
        ] : [];
        const distribution = row ? [
            { name: 'Installed', value: row.total_mi },
            { name: 'SAT Done', value: row.total_sat },
        ] : [];
        return { trend, distribution };
    }

    // O&M Team Productivity
    if ((n.includes('o&m') || n.includes('om')) && n.includes('productivity') && n.includes('team')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        const trend = rows.map(r => ({ name: r.technician || r.agency, value: r.closed_tickets }));
        const distribution = rows.map(r => ({ name: r.technician || r.agency, value: r.closed_tickets }));
        return { trend, distribution };
    }

    // O&M Productivity Trend
    if ((n.includes('o&m') || n.includes('om')) && n.includes('productivity trend')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        const trend = rows.map(r => ({ name: r.closed_month, value: r.total_closed_tickets }));
        const distribution = rows.map(r => ({ name: r.closed_month, value: r.total_closed_tickets }));
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
        const trend = [{ name: 'Open Tickets', value: rows.length }];
        const distribution = Object.entries(buckets).map(([name, value]) => ({ name, value }));
        return { trend, distribution };
    }

    // O&M Avg Closure Time
    if (n.includes('closure') && n.includes('avg')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        const trend = rows.map(r => ({ name: r.period_value_closed, value: r.avg_resolution_days }));
        const distribution = rows.map(r => ({ name: r.period_value_closed, value: r.avg_resolution_days }));
        return { trend, distribution };
    }

    // O&M Closed Analysis
    if (n.includes('closed analysis')) {
        const rows = Array.isArray(trendData) ? trendData : [];
        const trend = rows.map(r => ({ name: r.complaint_type, value: r.closed_tickets }));
        const distribution = rows.map(r => ({ name: r.complaint_type, value: r.closed_tickets }));
        return { trend, distribution };
    }

    return { trend: [], distribution: [] };
}
