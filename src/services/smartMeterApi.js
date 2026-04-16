import { transformAPIResponse } from './smartMeterUtils';

// API Base URL from environment variables (Vite-specific)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://d2lsztcb5y4nf9.cloudfront.net/mdms';

export { transformAPIResponse };

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

async function apiFetch(path, params = {}, signal = null) {
    const query = buildQuery(params);
    const url = `${BASE_URL}${path}${query ? `?${query}` : ''}`;

    try {
        const response = await fetch(url, { signal });

        if (!response.ok) {
            console.error(`[API Error] ${response.status} on ${path}`, { params, url });
            throw new Error(`API error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw error; // Re-throw abort errors for the hook to handle
        }
        console.error(`[Fetch Error] on ${path}`, error);
        throw error;
    }
}

// ──────────────────────────────────────────────
// Dashboard Overview
// ──────────────────────────────────────────────
export async function fetchDashboardOverview(params = {}, signal = null) {
    return apiFetch('/api/dashboard/overview', params, signal);
}

// ──────────────────────────────────────────────
// KPI 1 – MI Progress
// Response: { total_progress, category_breakdown, period_breakdown: [{period_value, progress}] }
// ──────────────────────────────────────────────
export async function fetchMIProgressSummary(params = {}, signal = null) {
    return apiFetch('/api/mi/progress/summary', params, signal);
}

export async function fetchMIProgress(params = {}, signal = null) {
    return apiFetch('/api/mi/progress', params, signal);
}

export async function fetchMIProgressDashboard(params = {}, signal = null) {
    // Map internal parameter names to exact names required by the new dashboard endpoint
    const mappedParams = {
        duration: params.period || 'daily',
        category: params.meter_category || 'total',
        level: params.level_by || 'discom',
        project: (params.project && params.project !== 'All') ? params.project : 'all',
        start_date: params.from_date || '',
        end_date: params.to_date || '',
        ...params // preserve any other geo-filters or standard params
    };

    // Remove internal redundant keys to match the exact format requested
    delete mappedParams.period;
    delete mappedParams.level_by;
    delete mappedParams.meter_category;
    delete mappedParams.from_date;
    delete mappedParams.to_date;

    return apiFetch('/api/mi/progress/dashboard', mappedParams, signal);
}

// ──────────────────────────────────────────────
// KPI 2 – MI Productivity
// Response: [{ technician, period_value, daily_installations, discom }]
// ──────────────────────────────────────────────
export async function fetchMIProductivity(params = {}, signal = null) {
    return apiFetch('/api/mi/productivity', params, signal);
}

// ──────────────────────────────────────────────
// KPI 3 – Monthly Productivity
// Requires: period_value (YYYY-MM)
// Summary Response: { total_installations, period_value }
// ──────────────────────────────────────────────
export async function fetchMonthlyProductivitySummary(params = {}, signal = null) {
    // Default to current month only if no specific range or period_value is provided
    if (!params.period_value && !params.from_date) {
        params.period_value = new Date().toISOString().slice(0, 7); // Default to current month (YYYY-MM)
    }
    return apiFetch('/api/mi/monthly-productivity/summary', params, signal);
}

export async function fetchMonthlyProductivity(params = {}, signal = null) {
    // Some endpoints may require period_value even if they support range
    if (!params.period_value && !params.from_date) {
        params.period_value = new Date().toISOString().slice(0, 7);
    }
    return apiFetch('/api/mi/monthly-productivity', params, signal);
}

// ──────────────────────────────────────────────
// KPI 4 – Inventory Utilization
// Summary Response: { total_inventory, total_installed, utilization_rate_pct, remaining_stock }
// ──────────────────────────────────────────────
export async function fetchInventoryUtilizationSummary(params = {}, signal = null) {
    return apiFetch('/api/mi/inventory-utilization/summary', params, signal);
}

export async function fetchInventoryUtilization(params = {}, signal = null) {
    return apiFetch('/api/mi/inventory-utilization', params, signal);
}

// ──────────────────────────────────────────────
// KPI 5 – MI Pace vs Stock
// Summary Response: { total_inventory, total_installed, utilization_rate_pct, remaining_stock }
// ──────────────────────────────────────────────
export async function fetchPaceVsStockSummary(params = {}, signal = null) {
    return apiFetch('/api/mi/pace-vs-stock/summary', params, signal);
}

export async function fetchPaceVsStockDetail(params = {}, signal = null) {
    return apiFetch('/api/mi/pace-vs-stock', params, signal);
}

// ──────────────────────────────────────────────
// KPI 6 – Stock Ageing
// Response: [{ meter_serial_number, di_date, installed_ts, ageing_days }]
// ──────────────────────────────────────────────
export async function fetchStockAgeing(params = {}, signal = null) {
    return apiFetch('/api/mi/stock-ageing', params, signal);
}

export async function fetchStockAgeingSummary(params = {}, signal = null) {
    return apiFetch('/api/mi/stock-ageing/summary', params, signal);
}

// ──────────────────────────────────────────────
// KPI 7 – MI vs SAT
// Response: [{ total_mi, total_sat, sat_progress_pct }]
// ──────────────────────────────────────────────
export async function fetchMIvsSAT(params = {}, signal = null) {
    return apiFetch('/api/mi/mi-vs-sat', params, signal);
}

export async function fetchMIvsSATSummary(params = {}, signal = null) {
    return apiFetch('/api/mi/mi-vs-sat/summary', params, signal);
}

// ──────────────────────────────────────────────
// KPI 8 – Non-SAT Ageing
// ──────────────────────────────────────────────
export async function fetchNonSATAgeing(params = {}, signal = null) {
    return apiFetch('/api/mi/non-sat-ageing', params, signal);
}

// ──────────────────────────────────────────────
// KPI 9 – Meter Journey Average Time
// ──────────────────────────────────────────────
export async function fetchMeterJourney(params = {}, signal = null) {
    return apiFetch('/api/mi/meter-journey', params, signal);
}

// ──────────────────────────────────────────────
// KPI 10 – Meter Current Stage Distribution
// ──────────────────────────────────────────────
export async function fetchMeterStage(params = {}, signal = null) {
    return apiFetch('/api/mi/meter-stage', params, signal);
}

// ──────────────────────────────────────────────
// KPI 11 – MI vs SAT vs Invoice Funnel
// ──────────────────────────────────────────────
export async function fetchMIvsSATvsInvoiceSummary(params = {}, signal = null) {
    return apiFetch('/api/mi/mi-vs-sat-vs-invoice/summary', params, signal);
}

export async function fetchMIvsSATvsInvoice(params = {}, signal = null) {
    return apiFetch('/api/mi/mi-vs-sat-vs-invoice', params, signal);
}

// ──────────────────────────────────────────────
// KPI 12 – Revenue Realized
// ──────────────────────────────────────────────
export async function fetchRevenueRealizedSummary(params = {}, signal = null) {
    return apiFetch('/api/mi/revenue-realized/summary', params, signal);
}

export async function fetchRevenueRealized(params = {}, signal = null) {
    return apiFetch('/api/mi/revenue-realized', params, signal);
}

// ──────────────────────────────────────────────
// KPI 13 – Revenue Ageing
// ──────────────────────────────────────────────
export async function fetchRevenueAgeingSummary(params = {}, signal = null) {
    return apiFetch('/api/mi/revenue-ageing/summary', params, signal);
}

export async function fetchRevenueAgeing(params = {}, signal = null) {
    return apiFetch('/api/mi/revenue-ageing', params, signal);
}

// ──────────────────────────────────────────────
// KPI 14 – Defective Meters
// ──────────────────────────────────────────────
export async function fetchDefectiveMetersSummary(params = {}, signal = null) {
    return apiFetch('/api/mi/defective-meters/summary', params, signal);
}

export async function fetchDefectiveMeters(params = {}, signal = null) {
    return apiFetch('/api/mi/defective-meters', params, signal);
}

// ──────────────────────────────────────────────
// SAT Dashboard - Command Center
// ──────────────────────────────────────────────
export async function fetchCommandCenter(region, params = {}, signal = null) {
    return apiFetch(`/api/mi/command-center/${region}`, params, signal);
}

// ──────────────────────────────────────────────
// KPI 8 – O&M Team Productivity
// Params: period, om_category
// Response: [{ technician, agency, closed_tickets }]
// ──────────────────────────────────────────────
export async function fetchOMProductivityTeam(params = {}, signal = null) {
    return apiFetch('/api/om/productivity-team', params, signal);
}

// ──────────────────────────────────────────────
// KPI 9 – O&M Productivity Trend
// Response: [{ closed_month, total_closed_tickets }]
// ──────────────────────────────────────────────
export async function fetchOMProductivityTrend(params = {}, signal = null) {
    return apiFetch('/api/om/productivity-trend', params, signal);
}

// ──────────────────────────────────────────────
// KPI 10 – O&M Open Ageing
// Response: [{ ticket_id, created_date, ageing_days }]
// ──────────────────────────────────────────────
export async function fetchOMOpenAgeing(params = {}, signal = null) {
    return apiFetch('/api/om/open-ageing', params, signal);
}

// ──────────────────────────────────────────────
// KPI 11 – O&M Avg Closure Time
// Response: [{ avg_resolution_days, period_value_closed }]
// ──────────────────────────────────────────────
export async function fetchOMAvgClosureTime(params = {}, signal = null) {
    return apiFetch('/api/om/avg-closure-time', params, signal);
}

// ──────────────────────────────────────────────
// KPI 12 – O&M Closed Analysis
// Response: [{ complaint_type, closed_tickets }]
// ──────────────────────────────────────────────
export async function fetchOMClosedAnalysis(params = {}, signal = null) {
    return apiFetch('/api/om/closed-analysis', params, signal);
}

// ──────────────────────────────────────────────
// KPI Name → API Fetcher resolver
// Returns: { fetchTrend, fetchDistribution }
// ──────────────────────────────────────────────
export function resolveKPIFetchers(kpiName) {
    const n = kpiName.toLowerCase();

    if (n.includes('mi-progress') || n.includes('mi progress')) {
        return {
            fetchTrend: (p, s) => fetchMIProgressDashboard(p, s),
            fetchDistribution: (p, s) => fetchMIProgressDashboard(p, s),
            shared: true,
        };
    }
    if (n.includes('productivity per team') && !n.includes('o&m') && !n.includes('o\\&m')) {
        return {
            fetchTrend: (p, s) => fetchMIProductivity(p, s),
            fetchDistribution: (p, s) => fetchMIProductivity(p, s),
            shared: false,
        };
    }
    if (n.includes('monthly productivity')) {
        return {
            fetchTrend: (p, s) => fetchMonthlyProductivitySummary(p, s),
            fetchDistribution: (p, s) => fetchMonthlyProductivity(p, s),
            shared: false,
        };
    }
    if (n.includes('inventory utilization')) {
        return {
            fetchTrend: (p, s) => fetchInventoryUtilizationSummary(p, s),
            fetchDistribution: (p, s) => fetchInventoryUtilization(p, s),
            shared: false,
        };
    }
    if (n.includes('pace') && n.includes('stock')) {
        return {
            fetchTrend: (p, s) => fetchPaceVsStockSummary(p, s),
            fetchDistribution: (p, s) => fetchPaceVsStockDetail(p, s),
            shared: false,
        };
    }
    if (n.includes('stock ageing') || n.includes('un-utilized stock ageing')) {
        return {
            fetchTrend: (p, s) => fetchStockAgeing(p, s),
            fetchDistribution: (p, s) => fetchStockAgeingSummary(p, s),
            shared: false,
        };
    }
    if (n.includes('mi vs sat vs invoice') || n.includes('funnel')) {
        return {
            fetchTrend: (p, s) => fetchMIvsSATvsInvoiceSummary(p, s),
            fetchDistribution: (p, s) => fetchMIvsSATvsInvoiceSummary(p, s),
            shared: true,
        };
    }
    if (n.includes('mi vs sat') || n.includes('mi vs. sat')) {
        return {
            fetchTrend: (p, s) => fetchMIvsSATSummary(p, s),
            fetchDistribution: (p, s) => fetchMIvsSAT(p, s),
            shared: false,
        };
    }
    if (n.includes('non-sat ageing') || n.includes('non sat ageing')) {
        return {
            fetchTrend: (p, s) => fetchNonSATAgeing(p, s),
            fetchDistribution: (p, s) => fetchNonSATAgeing(p, s),
            shared: true,
        };
    }
    if (n.includes('meter journey') || n.includes('meters journey')) {
        return {
            fetchTrend: (p, s) => fetchMeterJourney(p, s),
            fetchDistribution: (p, s) => fetchMeterJourney(p, s),
            shared: false,
        };
    }
    if (n.includes('meter stage') || n.includes('meters stage') || n.includes('meter current stage') || n.includes('meters current stage')) {
        return {
            fetchTrend: (p, s) => fetchMeterStage(p, s),
            fetchDistribution: (p, s) => fetchMeterStage(p, s),
            shared: true,
        };
    }
    // Moved up
    if (n.includes('revenue realized')) {
        return {
            fetchTrend: (p, s) => fetchRevenueRealizedSummary(p, s),
            fetchDistribution: (p, s) => fetchRevenueRealized(p, s),
            shared: false,
        };
    }
    if (n.includes('revenue') && n.includes('ageing')) {
        return {
            fetchTrend: (p, s) => fetchRevenueAgeingSummary(p, s),
            fetchDistribution: (p, s) => fetchRevenueAgeingSummary(p, s),
            shared: true,
        };
    }
    if (n.includes('defective meters')) {
        return {
            fetchTrend: (p, s) => fetchDefectiveMetersSummary(p, s),
            fetchDistribution: (p, s) => fetchDefectiveMeters(p, s),
            shared: false,
        };
    }
    // O&M KPIs
    if ((n.includes('o&m') || n.includes('om')) && n.includes('productivity') && n.includes('team')) {
        return {
            fetchTrend: (p, s) => fetchOMProductivityTeam(p, s),
            fetchDistribution: (p, s) => fetchOMProductivityTeam(p, s),
            shared: true,
        };
    }
    if ((n.includes('o&m') || n.includes('om')) && n.includes('productivity trend')) {
        return {
            fetchTrend: (p, s) => fetchOMProductivityTrend(p, s),
            fetchDistribution: (p, s) => fetchOMProductivityTrend(p, s),
            shared: true,
        };
    }
    if (n.includes('not closed') && n.includes('ageing')) {
        return {
            fetchTrend: (p, s) => fetchOMOpenAgeing(p, s),
            fetchDistribution: (p, s) => fetchOMOpenAgeing(p, s),
            shared: true,
        };
    }
    if (n.includes('closure') && n.includes('avg')) {
        return {
            fetchTrend: (p, s) => fetchOMAvgClosureTime(p, s),
            fetchDistribution: (p, s) => fetchOMAvgClosureTime(p, s),
            shared: true,
        };
    }
    if (n.includes('closed analysis')) {
        return {
            fetchTrend: (p, s) => fetchOMClosedAnalysis(p, s),
            fetchDistribution: (p, s) => fetchOMClosedAnalysis(p, s),
            shared: true,
        };
    }
    return null; // No matching KPI
}

