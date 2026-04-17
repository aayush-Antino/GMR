
import { transformAPIResponse } from './src/services/smartMeterUtils.js';

const mockStockAgeing = {
    total_stock: 837156,
    category_breakdown: {
        CONSUMER: { age_0_30: 0, age_31_60: 0, age_61_90: 61705, age_90_plus: 336882, total: 398587 }
    },
    period_breakdown: [
        { period_value: "01-05-24", age_0_30: 0, age_31_60: 0, age_61_90: 0, age_90_plus: 184, total_stock: 184 },
        { period_value: "01-06-24", age_0_30: 0, age_31_60: 0, age_61_90: 0, age_90_plus: 4428, total_stock: 4428 }
    ],
    comparison: [
        { label: "AGRA", age_0_30: 0, age_31_60: 10, age_61_90: 12000, age_90_plus: 50000, total_stock: 62010 },
        { label: "KASHI", age_0_30: 5, age_31_60: 0, age_61_90: 8000, age_90_plus: 35000, total_stock: 43005 }
    ]
};

const kpiName = "Un-utilized stock ageing";
const params = { period: "monthly", level_by: "discom", project: "all" };

try {
    const result = transformAPIResponse(kpiName, mockStockAgeing, mockStockAgeing, params);
    
    console.log("--- Transformation Result ---");
    console.log("Trend (first point):", JSON.stringify(result.trend?.[0], null, 2));
    console.log("Comparison (first point):", JSON.stringify(result.distribution?.[0], null, 2));
    console.log("Summary:", JSON.stringify(result.summary, null, 2));
    
    // Validations
    if (!result.trend || result.trend.length === 0) {
        throw new Error("Trend array is empty or missing");
    }
    const trendPoint = result.trend[0];
    if (trendPoint['0-30 Days'] === 0 && trendPoint['90+ Days'] === 184) {
        console.log("✅ Trend mapping successful");
    } else {
        console.log("❌ Trend mapping failed", trendPoint);
    }
    
    if (!result.distribution || result.distribution.length === 0) {
        throw new Error("Distribution array is empty or missing");
    }
    const distPoint = result.distribution[0];
    if (distPoint['31-60 Days'] === 10 && distPoint.name === "AGRA") {
        console.log("✅ Comparison mapping successful");
    } else {
        console.log("❌ Comparison mapping failed", distPoint);
    }

    if (result.summary?.['Total Stock'] === 837156) {
        console.log("✅ Summary mapping successful");
    } else {
        console.log("❌ Summary mapping failed", result.summary);
    }
    
} catch (err) {
    console.error("Test failed with error:", err);
    process.exit(1);
}
