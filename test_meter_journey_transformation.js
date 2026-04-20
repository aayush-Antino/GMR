
import { transformAPIResponse } from './src/services/smartMeterUtils.js';

const mockApiResponse = {
  "summary": {
    "inventory_to_store": 5,
    "store_to_agency": 3,
    "agency_to_meter_installation": 6,
    "meter_installation_to_sat": 12,
    "sat_to_invoice": 4,
    "invoice_to_revenue": 5,
    "total_journey": 35,
    "meter_count": 5000
  },
  "trend": [
    {
      "period_value": "01-03-26",
      "inventory_to_store": 5,
      "store_to_agency": 3,
      "agency_to_meter_installation": 6,
      "meter_installation_to_sat": 12,
      "sat_to_invoice": 4,
      "invoice_to_revenue": 5,
      "total_journey": 34,
      "meter_count": 120
    }
  ],
  "comparison": [
    {
      "label": "AGRA",
      "inventory_to_store": 5,
      "store_to_agency": 3,
      "agency_to_meter_installation": 6,
      "meter_installation_to_sat": 12,
      "sat_to_invoice": 4,
      "invoice_to_revenue": 4,
      "total_journey": 35,
      "meter_count": 1800
    }
  ]
};

import fs from 'fs';

console.log("--- Testing meter journey ---");
try {
    const result = transformAPIResponse('meter journey', mockApiResponse, null, { period: 'daily' });
    fs.writeFileSync('test_result.json', JSON.stringify(result, null, 2));
    console.log("SUCCESS: test_result.json written");
} catch (e) {
    fs.writeFileSync('test_error.txt', e.stack);
    console.error("FAILED: test_error.txt written");
}
