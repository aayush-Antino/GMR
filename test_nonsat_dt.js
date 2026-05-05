import { transformAPIResponse } from './src/services/smartMeterUtils.js';

const mockDataDT = {
    "total_non_sat": 72778,
    "summary": {
        "age_0_30": 0,
        "age_31_60": 2982,
        "age_61_90": 10389,
        "age_91_120": 13881,
        "age_120_plus": 45526,
        "total_non_sat": 72778
    },
    "comparison": [
        {
            "label": "AGRA",
            "age_31_60": 511,
            "total_non_sat": 13237
        }
    ]
};

// Test with DT
const result = transformAPIResponse('Non-SAT ageing', mockDataDT, null, { meter_category: 'DT' });
console.log('Result (DT Trend):', JSON.stringify(result.trend, null, 2));
console.log('Summary Tiles:', JSON.stringify(result.summary, null, 2));

const bucket31 = result.trend.find(t => t.name === 'age 31-60');
if (bucket31 && bucket31.DT === 2982) {
    console.log('Test Passed: DT value found in Trend');
} else {
    console.log('Test Failed: Trend mapping incorrect for DT');
}

if (result.summary['age 31-60'] === 2982) {
    console.log('Test Passed: Summary tile correct');
} else {
    console.log('Test Failed: Summary tile incorrect');
}
