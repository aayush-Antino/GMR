import { useState, useEffect, useRef } from 'react';
import { resolveKPIFetchers } from '../services/smartMeterApi';
import { transformAPIResponse } from '../services/smartMeterUtils';

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
            let rawTrend, rawDist;
            const signal = controller.signal;

            if (fetchers.shared) {
                // Single request for both trend and distribution
                rawTrend = await fetchers.fetchTrend(params, signal);
                rawDist = rawTrend;
            } else {
                // Separate requests - handle partial failures so one failing API doesn't kill the whole UI
                const results = await Promise.allSettled([
                    fetchers.fetchTrend(params, signal),
                    fetchers.fetchDistribution(params, signal),
                ]);
                
                rawTrend = results[0].status === 'fulfilled' ? results[0].value : null;
                rawDist = results[1].status === 'fulfilled' ? results[1].value : null;

                if (results[0].status === 'rejected' && results[1].status === 'rejected') {
                    throw results[0].reason || results[1].reason || new Error('All API calls failed');
                }
            }

            const { trend, distribution } = transformAPIResponse(kpiName, rawTrend, rawDist, params);
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
