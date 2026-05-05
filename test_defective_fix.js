import { transformAPIResponse } from './src/services/smartMeterUtils.js';

const mockData = {
    "summary": {
        "total_defective": { "CONSUMER": 41, "FEEDER": 0, "DT": 0, "total": 41 },
        "total_burnt": { "CONSUMER": 12, "FEEDER": 0, "DT": 0, "total": 12 },
        "total_faulty": { "CONSUMER": 4, "FEEDER": 0, "DT": 0, "total": 4 },
        "total_others": { "CONSUMER": 25, "FEEDER": 0, "DT": 0, "total": 25 }
    },
    "period_breakdown": [
        {
            "period_value": "2026-02-09",
            "total_defective": { "CONSUMER": 41, "FEEDER": 0, "DT": 0, "total": 41 },
            "total_burnt": { "CONSUMER": 12, "FEEDER": 0, "DT": 0, "total": 12 },
            "total_faulty": { "CONSUMER": 4, "FEEDER": 0, "DT": 0, "total": 4 },
            "total_others": { "CONSUMER": 25, "FEEDER": 0, "DT": 0, "total": 25 }
        }
    ],
    "comparison": [
        {
            "label": "AGRA",
            "total_defective": { "CONSUMER": 21, "FEEDER": 0, "DT": 0, "total": 21 },
            "total_burnt": { "CONSUMER": 8, "FEEDER": 0, "DT": 0, "total": 8 },
            "total_faulty": { "CONSUMER": 2, "FEEDER": 0, "DT": 0, "total": 2 },
            "total_others": { "CONSUMER": 11, "FEEDER": 0, "DT": 0, "total": 11 }
        }
    ]
};

// Test with Total category (default)
const resultTotal = transformAPIResponse('Defective Meters', mockData, null, { meter_category: 'total' });
console.log('Result (Total):', JSON.stringify(resultTotal.trend[0], null, 2));

// Test with Consumer category
const resultConsumer = transformAPIResponse('Defective Meters', mockData, null, { meter_category: 'CONSUMER' });
console.log('Result (Consumer):', JSON.stringify(resultConsumer.trend[0], null, 2));

if (resultTotal.trend[0].Burnt === 12 && resultTotal.trend[0].Faulty === 4) {
    console.log('Test Passed for Total');
} else {
    console.log('Test Failed for Total');
}
