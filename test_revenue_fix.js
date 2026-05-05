import { transformAPIResponse } from './src/services/smartMeterUtils.js';

const mockData = {
    "summary": {
        "total_lumpsum_invoice": { "CONSUMER": 1828790, "total": 1873388 },
        "total_pmpm_collection": { "CONSUMER": 1500788, "total": 1536780 }
    },
    "comparison": [
        {
            "label": "AGRA",
            "total_pmpm_collection": { "CONSUMER": 611344, "total": 621264 }
        }
    ]
};

// Test with Total
const resultTotal = transformAPIResponse('invoice vs revenue released', mockData, null, { meter_category: 'total' });
console.log('Result (Trend Stage 1):', JSON.stringify(resultTotal.trend[0], null, 2));
console.log('Result (Comparison):', JSON.stringify(resultTotal.distribution[0], null, 2));

if (resultTotal.trend[0].Consumer === 1828790 || resultTotal.trend[0].total === 1873388) {
    console.log('Test Passed: Trend found values');
} else {
    console.log('Test Failed: Trend mapping incorrect');
}

if (resultTotal.distribution[0].Realized === 621264) {
    console.log('Test Passed: Comparison found values');
} else {
    console.log('Test Failed: Comparison mapping incorrect');
}
