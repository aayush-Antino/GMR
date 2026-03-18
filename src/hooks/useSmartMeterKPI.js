import { useState, useEffect, useRef } from 'react';
import { resolveKPIFetchers, transformAPIResponse } from '../services/smartMeterApi';

/**
 * useSmartMeterKPI
 *
 * Fetches live data for a Business-department KPI and returns
 * { trendData, distData, loading, error, refetch }.
 *
 * @param {string} kpiName  – KPI display name (used to resolve the right fetcher)
 * @param {object} params   – Filter params: { period, meter_category, discom, zone, ... }
 * @param {boolean} enabled – Set to false to skip fetching (e.g. for non-Business KPIs)
 */
export function useSmartMeterKPI(kpiName, params = {}, enabled = true) {
    const [trendData, setTrendData] = useState([]);
    const [distData, setDistData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortRef = useRef(null);

    const fetchers = kpiName ? resolveKPIFetchers(kpiName) : null;

    const fetch = async () => {
        if (!enabled || !fetchers) return;

        // Abort any in-flight request
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const [rawTrend, rawDist] = await Promise.all([
                fetchers.fetchTrend(params),
                fetchers.fetchDistribution(params),
            ]);

            const { trend, distribution } = transformAPIResponse(kpiName, rawTrend, rawDist);
            setTrendData(trend);
            setDistData(distribution);
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err.message || 'Failed to load data');
            }
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetch();
        return () => {
            if (abortRef.current) abortRef.current.abort();
        };
    // Stringify params to avoid infinite loop from object identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kpiName, JSON.stringify(params), enabled]);

    return { trendData, distData, loading, error, refetch: fetch };
}
