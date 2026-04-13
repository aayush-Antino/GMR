import { transformAPIResponse } from './src/services/smartMeterUtils.js';
import fs from 'fs';

const results = {};

const mockDetailedRows = [
    { project: 'AGRA', zone: 'AGRA I', circle: 'EDC FATEHABAD', total_meters_installed: 100 },
    { project: 'AGRA', zone: 'AGRA II', circle: 'EDC AGRA', total_meters_installed: 150 },
    { project: 'MEERUT', zone: 'MEERUT I', circle: 'EDC MEERUT', total_meters_installed: 200 },
];

console.log('Testing Geographical Comparison...');

// Test MI Progress Stacked (Total)
const mockMIProgressSummary = {
    "period_breakdown": {
        "01-01-25": {
            "CONSUMER": { "1PH": 10, "3PH": 5 },
            "DT": { "3PH": 2 },
            "FEEDER": { "HT": 1 }
        },
        "01-02-25": {
            "CONSUMER": { "1PH": 12, "3PH": 8 },
            "DT": { "3PH": 4 },
            "FEEDER": { "HT": 2 }
        }
    }
};

results.miProgressStacked = transformAPIResponse('mi progress', mockMIProgressSummary, [], { meter_category: 'Total' });
results.miProgressDT = transformAPIResponse('mi progress', mockMIProgressSummary, [], { meter_category: 'DT' });

fs.writeFileSync('test_results.json', JSON.stringify(results, null, 2));
console.log('Results written to test_results.json');
