import { transformAPIResponse } from './src/services/smartMeterUtils.js';

const mockData = {
    trend: [
        { 
            period_value: '2026-05-01', 
            CONSUMER: 100,
            DT: 5,
            FEEDER: 10
        }
    ]
};

// Test DT selection
const resultDT = transformAPIResponse('MI Progress', mockData, null, { meter_category: 'DT' });
console.log('Result (DT Selection):', JSON.stringify(resultDT.trend[0], null, 2));

if (resultDT.trend[0].DT === 5) {
    console.log('Test Passed: DT count found');
} else {
    console.log('Test Failed: DT count missing');
}

// Test Consumer selection (should still have breakdown if data exists)
const mockBreakdown = {
    trend: [
        {
            period_value: '2026-05-01',
            CONSUMER: 100,
            "1PH-Consumer_meter": 80,
            "3PH-Consumer_meter": 20
        }
    ]
};
const resultConsumer = transformAPIResponse('MI Progress', mockBreakdown, null, { meter_category: 'CONSUMER' });
console.log('Result (Consumer Selection):', JSON.stringify(resultConsumer.trend[0], null, 2));
