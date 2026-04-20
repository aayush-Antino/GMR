
import { transformAPIResponse } from './src/services/smartMeterUtils.js';

const mockApiResponse = {
  "total_non_sat": 250000,
  "category_breakdown": {
    "CONSUMER": 120000,
    "FEEDER": 80000,
    "DT": 50000
  },
  "period_breakdown": [
    {
      "period_value": "16-03-26",
      "age_gt_30": 5000,
      "age_gt_60": 3000,
      "age_gt_90": 1500,
      "age_gt_120": 800,
      "total_non_sat": 10000,
      "CONSUMER": 4000,
      "FEEDER": 4000,
      "DT": 2000
    }
  ],
  "comparison": [
    {
      "label": "KASHI",
      "CONSUMER": 40000,
      "FEEDER": 25000,
      "DT": 15000,
      "count": 80000
    }
  ]
};

console.log("--- Testing category=total ---");
const resultTotal = transformAPIResponse('non-sat ageing', mockApiResponse, null, { category: 'total', period: 'daily' });
console.log("Trend[0]:", JSON.stringify(resultTotal.trend[0], null, 2));
console.log("Distribution[0]:", JSON.stringify(resultTotal.distribution[0], null, 2));
console.log("Summary:", JSON.stringify(resultTotal.summary, null, 2));

console.log("\n--- Testing category=consumer ---");
const resultConsumer = transformAPIResponse('non-sat ageing', mockApiResponse, null, { category: 'consumer', period: 'daily' });
console.log("Trend[0] (Buckets):", JSON.stringify(resultConsumer.trend[0], null, 2));

// Non-cumulative check:
// total_non_sat: 10000
// age_gt_30: 5000  => 0-30 = 10000 - 5000 = 5000
// age_gt_60: 3000  => 31-60 = 5000 - 3000 = 2000
// age_gt_90: 1500  => 61-90 = 3000 - 1500 = 1500
// age_gt_120: 800  => 91-120 = 1500 - 800 = 700
// > 120 = 800
