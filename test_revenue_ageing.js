import { transformAPIResponse } from './src/services/smartMeterUtils.js';

const mockData = {
    "summary": {
        "age_61_90": { "1PH-Consumer_meter": 186576, "total": 188717 },
        "total_pending": 738667
    },
    "comparison": [
        {
            "label": "AGRA",
            "age_61_90": { "1PH-Consumer_meter": 186576, "total": 188717 },
            "total_pending": 314650
        }
    ]
};

// Test with Consumer
const result = transformAPIResponse('Revenue not realized ageing', mockData, null, { meter_category: 'CONSUMER' });
console.log('Result (Trend Stage 61-90):', JSON.stringify(result.trend.find(t => t.name === 'age 61-90'), null, 2));

if (result.trend.find(t => t.name === 'age 61-90')['1PH-Consumer_meter'] === 186576) {
    console.log('Test Passed: Trend found values');
} else {
    console.log('Test Failed: Trend mapping incorrect');
}

if (result.summary['age 61-90'] === 188717) {
    console.log('Test Passed: Summary tile correct');
} else {
    console.log('Test Failed: Summary tile incorrect');
}
