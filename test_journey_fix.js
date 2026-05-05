import { transformAPIResponse } from './src/services/smartMeterUtils.js';

const mockData = {
    "summary": {
        "inventory_to_store": { "1PH-Consumer_meter": 11, "total": 22 },
        "total_journey": { "1PH-Consumer_meter": 141, "total": 209 }
    },
    "comparison": [
        {
            "label": "AGRA",
            "inventory_to_store": { "1PH-Consumer_meter": 5, "total": 16 }
        }
    ]
};

// Test with Total
const resultTotal = transformAPIResponse('meters journey', mockData, null, { meter_category: 'total' });
console.log('Result (Trend Stage 1):', JSON.stringify(resultTotal.trend[0], null, 2));

// Test with Consumer
const resultConsumer = transformAPIResponse('meters journey', mockData, null, { meter_category: 'CONSUMER' });
console.log('Result (Consumer Breakdown):', JSON.stringify(resultConsumer.trend[0], null, 2));

if (resultTotal.trend[0].Consumer === 22 || resultTotal.trend[0].total === 22) {
    console.log('Test Passed: Trend found values');
} else {
    console.log('Test Failed: Trend mapping incorrect');
}

if (resultConsumer.trend[0]['1PH-Consumer_meter'] === 11) {
    console.log('Test Passed: Consumer Breakdown found values');
} else {
    console.log('Test Failed: Consumer Breakdown mapping incorrect');
}
