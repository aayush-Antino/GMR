import { transformAPIResponse } from './src/services/smartMeterUtils.js';

const mockData = {
    "total_non_sat": 984269,
    "summary": {
        "age_0_30": { "1PH-Consumer_meter": 0, "total": 0 },
        "age_31_60": { "1PH-Consumer_meter": 16488, "total": 17400 },
        "age_120_plus": { "1PH-Consumer_meter": 360292, "total": 365629 }
    },
    "comparison": [
        {
            "label": "AGRA",
            "age_31_60": { "1PH-Consumer_meter": 925, "total": 1177 },
            "total_non_sat": 308442
        }
    ]
};

// Test with Consumer
const result = transformAPIResponse('Non-SAT ageing', mockData, null, { meter_category: 'CONSUMER' });
console.log('Result (Consumer Trend):', JSON.stringify(result.trend, null, 2));
console.log('Summary Tiles:', JSON.stringify(result.summary, null, 2));

const bucket31 = result.trend.find(t => t.name === 'age 31-60');
if (bucket31 && bucket31['1PH-Consumer_meter'] === 16488) {
    console.log('Test Passed: Sub-categories found in Trend');
} else {
    console.log('Test Failed: Trend mapping incorrect');
}

if (result.summary['age 31-60'] === 17400) {
    console.log('Test Passed: Summary tile correct');
} else {
    console.log('Test Failed: Summary tile incorrect');
}
