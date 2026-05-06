
import { useState, useEffect, useRef } from 'react';
import { resolveAssetKPIFetchers } from '../services/assetTrackingApi';
import { transformAssetAPIResponse } from '../services/assetTrackingUtils';

/**
 * useAssetTrackingKPI
 * 
 * Fetches live data for Asset Tracking KPIs from the new FastAPI backend.
 */
export function useAssetTrackingKPI(kpiName, params = {}, enabled = true) {
    const [trendData, setTrendData] = useState([]);
    const [distData, setDistData] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortRef = useRef(null);

    const fetchers = kpiName ? resolveAssetKPIFetchers(kpiName) : null;

    const fetch = async () => {
        if (!enabled || !fetchers) return;

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const signal = controller.signal;
            const rawData = await fetchers.fetchTrend(params, signal);
            
            // Note: The API returns all levels at once, so we pass the whole object to transform
            const transformed = transformAssetAPIResponse(kpiName, rawData, params);
            
            setTrendData(transformed.trend || []);
            setDistData(transformed.distribution || []);
            setSummary(transformed.summary || null);
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err.message || 'Failed to load asset data');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch();
        return () => {
            if (abortRef.current) abortRef.current.abort();
        };
    }, [kpiName, JSON.stringify(params), enabled]);

    return { trendData, distData, summary, loading, error, refetch: fetch };
}
