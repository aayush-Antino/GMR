import { transformAPIResponse } from './src/services/smartMeterUtils.js';

const mockData = {
    "total_mi": 3090455,
    "total_sat": 2270850,
    "sat_progress_pct": 73.48,
    "summary": {
        "sat_1": {
            "1PH-Consumer_meter": 486116,
            "total": 490422
        },
        "sat_2": {
            "1PH-Consumer_meter": 233497,
            "total": 236677
        }
    },
    "comparison": [
        {
            "label": "AGRA",
            "total_mi": 1215368,
            "total_sat": 943646,
            "sat_1": { "1PH-Consumer_meter": 193322, "total": 195568 }
        }
    ]
};

// Test with Total
const resultTotal = transformAPIResponse('MI Vs SAT-Progress', mockData, null, { meter_category: 'total' });
console.log('Result (Total):', JSON.stringify(resultTotal.trend[0], null, 2));

// Test with Consumer
const resultConsumer = transformAPIResponse('MI Vs SAT-Progress', mockData, null, { meter_category: 'CONSUMER' });
console.log('Result (Consumer Breakdown):', JSON.stringify(resultConsumer.trend[0], null, 2));

if (resultTotal.trend[0].Consumer === 490422 || resultTotal.trend[0].total === 490422) {
    console.log('Test Passed for Total');
} else {
    console.log('Test Failed for Total');
}

if (resultConsumer.trend[0]['1PH-Consumer_meter'] === 486116) {
    console.log('Test Passed for Consumer Breakdown');
} else {
    console.log('Test Failed for Consumer Breakdown');
}
