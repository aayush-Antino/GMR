import { transformAPIResponse } from './src/services/smartMeterUtils.js';

const mockData = {
  "summary": {
    "inventory": { "1PH-Consumer_meter": 1769634, "total": 1800696 },
    "invoice_done": { "1PH-Consumer_meter": 325584, "total": 328002 }
  },
  "comparison": [
    {
      "label": "AGRA",
      "inventory": { "1PH-Consumer_meter": 640417, "total": 650364 }
    }
  ]
};

// Test with Consumer
const result = transformAPIResponse('meters stage', mockData, null, { meter_category: 'CONSUMER' });
console.log('Result (Trend Inventory):', JSON.stringify(result.trend[0], null, 2));
console.log('Result (Trend Invoice):', JSON.stringify(result.trend[3], null, 2));

if (result.trend[0]['1PH-Consumer_meter'] === 1769634) {
    console.log('Test Passed: Trend Inventory found');
} else {
    console.log('Test Failed: Trend mapping incorrect');
}

if (result.summary['Invoice Done'] === 328002) {
    console.log('Test Passed: Summary tile correct');
} else {
    console.log('Test Failed: Summary tile incorrect');
}
