
// API Base URL from environment variables
const BASE_URL = import.meta.env.VITE_ASSET_TRACKING_API_URL || 'http://localhost:8000';

/**
 * Build a URLSearchParams string from a params object.
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
            console.error(`[Asset Tracking API Error] ${response.status} on ${path}`, { params, url });
            throw new Error(`API error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw error;
        }
        console.error(`[Asset Tracking Fetch Error] on ${path}`, error);
        throw error;
    }
}

/**
 * Fetch all KPIs
 */
export async function fetchAllAssetKPIs(params = {}, signal = null) {
    return apiFetch('/kpis', params, signal);
}

/**
 * Fetch a specific KPI by ID or name
 */
export async function fetchSpecificAssetKPI(kpiQuery, params = {}, signal = null) {
    // kpiQuery can be 'kpi_1' or 'Total Assets Tracked'
    return apiFetch(`/kpis/${encodeURIComponent(kpiQuery)}`, params, signal);
}

/**
 * Fetch status of calculation
 */
export async function fetchAssetAPIStatus(signal = null) {
    return apiFetch('/status', {}, signal);
}

/**
 * Trigger update
 */
export async function triggerAssetUpdate(signal = null) {
    const url = `${BASE_URL}/update-kpis`;
    const response = await fetch(url, { method: 'POST', signal });
    return await response.json();
}

/**
 * Resolver for Asset Tracking KPIs
 */
export function resolveAssetKPIFetchers(kpiName) {
    // Mapping of descriptive names to IDs if needed, or just use the name
    // The API accepts both
    return {
        fetchTrend: (p, s) => fetchSpecificAssetKPI(kpiName, p, s),
        fetchDistribution: (p, s) => fetchSpecificAssetKPI(kpiName, p, s),
        shared: true
    };
}
