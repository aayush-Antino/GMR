/**
 * regionUtils.js
 * Utilities to derive deterministic, region-specific chart data
 * from a KPI's base chartData without bloating dashboardData.js.
 *
 * Regions: Kashi | Agra | Triveni
 */

// Fixed scaling multipliers so each region always shows consistent values
const REGION_CONFIG = {
    Kashi: {
        trendMultiplier: 0.82,
        distributionShifts: [0.9, 1.05, 1.1],  // applied per distribution slice
        colorShift: 0,                            // no colour change
    },
    Agra: {
        trendMultiplier: 1.15,
        distributionShifts: [1.2, 0.85, 0.95],
        colorShift: 0,
    },
    Triveni: {
        trendMultiplier: 0.95,
        distributionShifts: [0.95, 1.1, 0.9],
        colorShift: 0,
    },
};

/**
 * Returns a scaled copy of a numeric trend-point value.
 * Keeps object keys other than numeric values (name, color, etc.) intact.
 * Works for both simple { name, value } shapes and multi-key shapes
 * like { name, critical, major, minor } or { name, min, avg, max }.
 */
function scalePoint(point, multiplier) {
    const scaled = {};
    for (const [key, val] of Object.entries(point)) {
        if (key === 'name') {
            scaled[key] = val;
        } else if (typeof val === 'number') {
            // Round to 1 decimal place; handle negative values (e.g. dBm signal)
            const sign = val < 0 ? -1 : 1;
            scaled[key] = parseFloat((val * multiplier * sign * sign).toFixed(1));
        } else {
            scaled[key] = val;
        }
    }
    return scaled;
}

/**
 * Returns region-specific chart data derived from the base chartData.
 * If region is 'All' or not recognised, returns the original chartData as-is.
 *
 * @param {object} chartData  - base chartData from dashboardData
 * @param {string} region     - 'All' | 'Kashi' | 'Agra' | 'Triveni'
 * @returns {object}          - chartData object to pass to modal charts
 */
export function getRegionChartData(chartData, region) {
    if (!chartData || !region || region === 'All' || !REGION_CONFIG[region]) {
        return chartData;
    }

    const { trendMultiplier, distributionShifts } = REGION_CONFIG[region];

    const scaledTrend = (chartData.trend || []).map(pt =>
        scalePoint(pt, trendMultiplier)
    );

    const scaledDistribution = (chartData.distribution || []).map((pt, idx) => {
        const shift = distributionShifts[idx % distributionShifts.length];
        return {
            ...pt,
            value: parseFloat((pt.value * shift).toFixed(1)),
        };
    });

    return {
        ...chartData,
        trend: scaledTrend,
        distribution: scaledDistribution,
        // append region label to titles so user sees which region is active
        trendTitle: chartData.trendTitle
            ? `${chartData.trendTitle} — ${region}`
            : chartData.trendTitle,
        distTitle: chartData.distTitle
            ? `${chartData.distTitle} — ${region}`
            : chartData.distTitle,
    };
}

export const REGIONS = ['All', 'Kashi', 'Agra', 'Triveni'];
