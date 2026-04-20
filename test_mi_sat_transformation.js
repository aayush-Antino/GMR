
import { transformAPIResponse } from './src/services/smartMeterUtils.js';

const mockMIvsSAT = {
  "total_mi": 1086387,
  "total_sat": 696186,
  "sat_progress_pct": 64.08,
  "sat_1": 228242, "sat_2": 171406, "sat_3": 169023,
  "sat_4": 57999, "sat_5": 28179, "sat_6": 20990,
  "sat_7": 20347, "sat_8": 0, "sat_9": 0,
  "category_breakdown": {
    "CONSUMER": { "total": { "total_mi": 800000, "total_sat": 512000 } }
  },
  "period_breakdown": {
    "01-01-24": {
      "CONSUMER": {
        "total": {
          "total_sat": 5000,
          "sat_1": 1500, "sat_2": 1200, "sat_3": 1000
        }
      },
      "FEEDER": {
        "total": { "total_sat": 2000 }
      }
    },
    "01-02-24": {
      "CONSUMER": {
        "total": { "total_sat": 6000 }
      }
    }
  },
  "comparison": [
    {
      "label": "AGRA",
      "CONSUMER": 400000,
      "FEEDER": 100000,
      "DT": 40000,
      "total_mi": 540000,
      "total_sat": 345600,
      "sat_progress_pct": 64.0
    }
  ]
};

const kpiName = "MI Vs SAT-Progress";

try {
    console.log("--- Testing TOTAL Category ---");
    const resultTotal = transformAPIResponse(kpiName, mockMIvsSAT, mockMIvsSAT, { category: 'Total' });
    console.log("Trend (Total SAT - expected 7000):", resultTotal.trend[0]['Total SAT']);
    console.log("Trend (Consumer - expected 5000):", resultTotal.trend[0].Consumer);
    console.log("Trend length:", resultTotal.trend.length);
    
    if (resultTotal.trend[0]['Total SAT'] === 7000 && resultTotal.trend.length === 2) {
        console.log("✅ Total Trend mapping successful");
    } else {
        console.log("❌ Total Trend mapping failed", resultTotal.trend[0]);
    }

    console.log("\n--- Testing CONSUMER Category ---");
    const resultConsumer = transformAPIResponse(kpiName, mockMIvsSAT, mockMIvsSAT, { category: 'Consumer' });
    console.log("Trend (SAT Stage 1 - expected 1500):", resultConsumer.trend[0]['Stage 1']);
    
    if (resultConsumer.trend[0]['Stage 1'] === 1500) {
        console.log("✅ Category-specific Stage mapping successful");
    } else {
        console.log("❌ Category-specific Stage mapping failed", resultConsumer.trend[0]);
    }

    console.log("\n--- Testing Comparison ---");
    const distPoint = resultTotal.distribution[0];
    if (distPoint.name === "AGRA" && distPoint.Consumer === 400000) {
        console.log("✅ Comparison mapping successful");
    } else {
        console.log("❌ Comparison mapping failed", distPoint);
    }

    console.log("\n--- Testing Summary ---");
    if (resultTotal.summary?.['Total MI'] === 1086387 && resultTotal.summary?.['SAT Stage 1'] === 228242) {
        console.log("✅ Summary mapping successful");
    } else {
        console.log("❌ Summary mapping failed", resultTotal.summary);
    }

} catch (err) {
    console.error("Test failed with error:", err);
    process.exit(1);
}
