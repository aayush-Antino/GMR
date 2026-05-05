import { transformAPIResponse } from './src/services/smartMeterUtils.js';

const mockData = {
    "total_stock": 418424,
    "summary": {
        "age_0_30": { "1PH-Consumer_meter": 0, "total": 0 },
        "age_61_90": { "1PH-Consumer_meter": 33907, "3PH-Consumer_meter": 649, "total": 34556 },
        "age_90_plus": { "1PH-Consumer_meter": 370646, "3PH-Consumer_meter": 12854, "total": 383779 }
    },
    "comparison": [
        {
            "label": "AGRA",
            "age_61_90": { "1PH-Consumer_meter": 168, "total": 168 },
            "age_90_plus": { "1PH-Consumer_meter": 15412, "total": 17255 }
        }
    ]
};

// Test with Consumer
const result = transformAPIResponse('Un-utilized stock ageing', mockData, null, { meter_category: 'CONSUMER' });
console.log('Result (Consumer Breakdown):', JSON.stringify(result.trend, null, 2));
console.log('Summary Tiles:', JSON.stringify(result.summary, null, 2));

const bucket61 = result.trend.find(t => t.name === '61-90 days');
if (bucket61 && bucket61['1PH-Consumer_meter'] === 33907) {
    console.log('Test Passed: Sub-categories found in Trend');
} else {
    console.log('Test Failed: Trend mapping incorrect');
}

if (result.summary['61-90 Days'] === 34556) {
    console.log('Test Passed: Summary tile correct');
} else {
    console.log('Test Failed: Summary tile incorrect');
}
