// Standalone test script to verify transformation logic
function transformAPIResponse(kpiName, trendData, distData, params = {}) {
    const n = kpiName.toLowerCase();
    let trend = [];
    let distribution = [];

    const formatLabel = (s) => s; // mock

    // MI vs SAT vs Invoice Funnel (KPI 11) - COPIED FROM smartMeterUtils.js after my fix
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
            const point = { name: st.label };
            const stageKey = `total_${st.key}`;
            const stageSummary = dashboardData.summary?.[stageKey];

            if (selCategory === 'TOTAL') {
                point.Consumer = Number(stageSummary?.CONSUMER || 0);
                point.DT = Number(stageSummary?.DT || 0);
                point.Feeder = Number(stageSummary?.FEEDER || 0);
            } else {
                const displayKey = selCategory.charAt(0) + selCategory.slice(1).toLowerCase();
                point[displayKey] = Number(stageSummary?.[selCategory] || 0);
            }
            return point;
        });

        // 2. Comparison (Right Chart)
        if (Array.isArray(dashboardData?.comparison)) {
            distribution = dashboardData.comparison.map(node => ({
                name: node.label || 'Unknown',
                'Total MI': Number(node.total_mi?.total ?? node.total_mi ?? 0),
                'Total SAT': Number(node.total_sat?.total ?? node.total_sat ?? 0),
                'Lumpsum Invoice': Number(node.total_lumpsum_invoice?.total ?? node.total_lumpsum_invoice ?? 0),
                'PMPM Invoice': Number(node.total_pmpm_invoice?.total ?? node.total_pmpm_invoice ?? 0)
            }));
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
}

const kpiName = "MI vs SAT vs Invoice Funnel";
const trendData = {
    "summary": {
        "total_mi": { "CONSUMER": 3090455, "FEEDER": 6700, "DT": 109324, "total": 3206479 },
        "total_sat": { "CONSUMER": 2239455, "FEEDER": 6419, "DT": 47207, "total": 2293081 },
        "total_lumpsum_invoice": { "CONSUMER": 1828790, "FEEDER": 6406, "DT": 38192, "total": 1873388 },
        "total_pmpm_invoice": { "CONSUMER": 1828790, "FEEDER": 6406, "DT": 38192, "total": 1873388 }
    },
    "comparison": [
        {
            "label": "AGRA",
            "total_mi": { "CONSUMER": 1215368, "FEEDER": 3079, "DT": 24457, "total": 1242904 },
            "total_sat": { "CONSUMER": 925994, "FEEDER": 2949, "DT": 13721, "total": 942664 },
            "total_lumpsum_invoice": { "CONSUMER": 737273, "FEEDER": 2947, "DT": 10297, "total": 750517 },
            "total_pmpm_invoice": { "CONSUMER": 737273, "FEEDER": 2947, "DT": 10297, "total": 750517 }
        }
    ]
};

console.log('Test 1: TOTAL category');
let res = transformAPIResponse(kpiName, trendData, [], { category: 'total' });
console.log('Trend[0]:', res.trend[0]); // MI
console.log('Distribution[0]:', res.distribution[0]);
console.log('Summary:', res.summary);

console.log('\nTest 2: CONSUMER category');
res = transformAPIResponse(kpiName, trendData, [], { category: 'consumer' });
console.log('Trend[0]:', res.trend[0]); 
