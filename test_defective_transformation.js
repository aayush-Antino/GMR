const { transformAPIResponse } = require('./src/services/smartMeterUtils');

const kpiName = 'Defective Meters';
const mockData = {
  "total_defective": 484,
  "total_burnt": 67,
  "total_faulty": 36,
  "total_others": 381,
  "trend": [
    {
      "period_value": "2026-04-16",
      "CONSUMER": 120,
      "FEEDER": 30,
      "DT": 15,
      "burnt": 10,
      "faulty": 25,
      "others": 130
    }
  ],
  "comparison": [
    {
      "label": "AGRA",
      "CONSUMER": 148,
      "FEEDER": 5,
      "DT": 0,
      "burnt": 38,
      "faulty": 9,
      "others": 108,
      "total_defective": 153
    }
  ]
};

const params = { period: 'daily' };
const result = transformAPIResponse(kpiName, mockData, mockData, params);

console.log('TRANSFORMED SUMMARY:', JSON.stringify(result.summary, null, 2));
console.log('TRANSFORMED TREND:', JSON.stringify(result.trend[0], null, 2));
console.log('TRANSFORMED DIST:', JSON.stringify(result.distribution[0], null, 2));
