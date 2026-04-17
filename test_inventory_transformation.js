const { transformAPIResponse } = require('./src/services/smartMeterUtils');

const kpiName = 'Total & Category wise Inventory Utilization rate (Meters & Cable)';
const mockData = {
  "total_inventory": 50000,
  "total_installed": 15000,
  "utilization_rate_pct": 30.0,
  "remaining_stock": 35000,
  "period_breakdown": {
    "01-01-25": {
      "CONSUMER": {
        "1PH-STSM": {
          "total_inventory": 5000,
          "total_installed": 1500,
          "utilization_rate_pct": 30.0
        }
      }
    }
  },
  "comparison": [
    {
      "label": "AGRA I",
      "total_inventory": 18000,
      "total_installed": 5400,
      "utilization_rate_pct": 30.0,
      "CONSUMER": 3200,
      "FEEDER": 1400,
      "DT": 800
    }
  ]
};

const params = { meter_category: 'Total' };
const result = transformAPIResponse(kpiName, mockData, mockData, params);

console.log('TRANSFORMED SUMMARY:', JSON.stringify(result.summary, null, 2));
console.log('TRANSFORMED TREND:', JSON.stringify(result.trend[0], null, 2));
console.log('TRANSFORMED DIST:', JSON.stringify(result.distribution[0], null, 2));
