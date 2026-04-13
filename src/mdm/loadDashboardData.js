import { safeQuery } from "./athena_client";


export async function loadDashboardData() {
  const [
    saidiRes, saifiRes, metersRes, effRes, smartPctRes, pfRes, solarRes, nrRes,
    trendData, sdoRankings, voltageData, meterSplit,
    consumptionData, pfTrendData, solarTrendData, meterHealthData,
    demandData, efficiencyData, outageSummary,
  ] = await Promise.all([
    // ── KPI Cards ──
    safeQuery("SELECT ROUND(AVG(saidi_minutes), 2) AS saidi FROM mdms_gold.outage_summary"),
    safeQuery("SELECT ROUND(AVG(saifi), 3) AS saifi FROM mdms_gold.outage_summary"),
    safeQuery("SELECT ROUND(SUM(total_meters)) AS total_meters FROM mdms_gold.meter_coverage WHERE data_date = (SELECT MAX(data_date) FROM mdms_gold.meter_coverage)"),
    safeQuery("SELECT ROUND(AVG(billing_efficiency_pct), 1) AS avg_eff FROM mdms_gold.billing_efficiency WHERE uom = 'KWH'"),
    safeQuery("SELECT ROUND(SUM(total_meters * smart_meter_pct / 100)) AS smart_count, ROUND(SUM(total_meters)) AS total_count FROM mdms_gold.meter_coverage WHERE data_date = (SELECT MAX(data_date) FROM mdms_gold.meter_coverage)"),
    safeQuery("SELECT ROUND(AVG(power_factor), 2) AS avg_pf FROM mdms_gold.daily_meter_summary WHERE power_factor IS NOT NULL"),
    safeQuery("SELECT ROUND(SUM(kwh_export) / 1000000, 1) AS solar_m FROM mdms_gold.daily_meter_summary WHERE kwh_export > 0"),
    safeQuery("SELECT ROUND(SUM(non_reporting_count)) AS non_reporting_count, ROUND(SUM(total_meters)) AS total_count FROM mdms_gold.meter_coverage WHERE data_date = (SELECT MAX(data_date) FROM mdms_gold.meter_coverage)"),

    // ── SAIDI Trend ──
    safeQuery("SELECT data_date, ROUND(AVG(saidi_minutes), 2) AS saidi FROM mdms_gold.outage_summary WHERE data_date >= DATE '2026-01-16' GROUP BY data_date ORDER BY data_date ASC"),

    // ── SDO Rankings ──
    safeQuery("SELECT source_sdo, ROUND(AVG(saidi_minutes), 1) AS avg_saidi FROM mdms_gold.outage_summary WHERE data_date >= DATE '2026-03-01' GROUP BY source_sdo ORDER BY avg_saidi DESC LIMIT 10"),

    // ── Voltage Quality ──
    safeQuery("SELECT ROUND(AVG(avg_voltage), 2) AS avg_voltage, ROUND(AVG(voltage_deviation_index), 3) AS vdi, COUNT(*) AS reading_count FROM mdms_gold.voltage_quality_summary WHERE data_date >= DATE '2026-03-01'"),

    // ── Meter Split ──
    safeQuery("SELECT ROUND(AVG(smart_meter_pct), 1) AS smart_pct, ROUND(100 - AVG(smart_meter_pct), 1) AS legacy_pct FROM mdms_gold.meter_coverage WHERE data_date = (SELECT MAX(data_date) FROM mdms_gold.meter_coverage)"),

    // ── Consumption ──
    safeQuery("SELECT data_date, ROUND(SUM(total_kwh) / 1000, 1) AS total_kwh_k FROM mdms_gold.load_rise_trend WHERE data_date >= DATE '2026-03-01' GROUP BY data_date ORDER BY data_date ASC"),

    // ── Power Factor Trend ──
    safeQuery("SELECT data_date, ROUND(AVG(power_factor), 3) AS avg_pf FROM mdms_gold.daily_meter_summary WHERE power_factor IS NOT NULL AND data_date >= DATE '2026-03-01' GROUP BY data_date ORDER BY data_date ASC"),

    // ── Solar Export Trend ──
    safeQuery("SELECT data_date, ROUND(SUM(kwh_export) / 1000, 1) AS export_k FROM mdms_gold.daily_meter_summary WHERE data_date >= DATE '2026-03-01' GROUP BY data_date ORDER BY data_date ASC"),

    // ── Meter Health ──
    safeQuery("SELECT data_date, ROUND(SUM(total_meters - non_reporting_count - estimated_reading_count)) AS communicating, ROUND(SUM(non_reporting_count)) AS non_reporting, ROUND(SUM(estimated_reading_count)) AS estimated FROM mdms_gold.meter_coverage WHERE data_date >= DATE '2026-03-01' GROUP BY data_date ORDER BY data_date ASC"),

    // ── Demand ──
    safeQuery("SELECT data_date, ROUND(AVG(avg_demand_kw), 2) AS avg_demand, ROUND(AVG(peak_demand_kw), 2) AS peak_demand FROM mdms_gold.load_rise_trend WHERE data_date >= DATE '2026-03-01' GROUP BY data_date ORDER BY data_date ASC"),

    // ── Efficiency Trend ──
    safeQuery("SELECT data_date, ROUND(AVG(billing_efficiency_pct), 1) AS avg_efficiency FROM mdms_gold.billing_efficiency WHERE uom = 'KWH' AND data_date >= DATE '2026-03-01' GROUP BY data_date ORDER BY data_date ASC"),

    // ── Outage Summary ──
    safeQuery("SELECT SUM(affected_meters) AS total_affected, COUNT(DISTINCT source_sdo) AS sdos_with_outage, ROUND(MAX(saidi_minutes), 1) AS max_saidi FROM mdms_gold.outage_summary WHERE data_date = (SELECT MAX(data_date) FROM mdms_gold.outage_summary)"),
  ]);

  return {
    kpis: {
      saidi: saidiRes[0]?.saidi || "0.00",
      saifi: saifiRes[0]?.saifi || "0.000",
      totalMeters: metersRes[0]?.total_meters || "0",
      billingEfficiency: effRes[0]?.avg_eff || "0.0",
      smartMeterCount: smartPctRes[0]?.smart_count || "0",
      smartMeterTotal: smartPctRes[0]?.total_count || "0",
      powerFactor: pfRes[0]?.avg_pf || "0.00",
      solarExport: solarRes[0]?.solar_m || "0.0",
      nonReportingCount: nrRes[0]?.non_reporting_count || "0",
    },
    saidiTrend: trendData.map((r) => ({ date: r.data_date, value: parseFloat(r.saidi) })),
    sdoRankings: sdoRankings.map((r) => ({ sdo: r.source_sdo, saidi: parseFloat(r.avg_saidi) })),
    voltage: {
      avg: parseFloat(voltageData[0]?.avg_voltage || "0"),
      vdi: parseFloat(voltageData[0]?.vdi || "0"),
      count: parseInt(voltageData[0]?.reading_count || "0").toLocaleString(),
    },
    meterSplit: {
      smart: parseFloat(meterSplit[0]?.smart_pct || "0"),
      legacy: parseFloat(meterSplit[0]?.legacy_pct || "0"),
    },
    consumption: consumptionData.map((r) => ({ date: r.data_date, kwh: parseFloat(r.total_kwh_k) })),
    pfTrend: pfTrendData.map((r) => ({ date: r.data_date, value: parseFloat(r.avg_pf) })),
    solarTrend: solarTrendData.map((r) => ({ date: r.data_date, kwh: parseFloat(r.export_k) })),
    meterHealth: meterHealthData.map((r) => ({
      date: r.data_date,
      communicating: parseInt(r.communicating || "0"),
      nonReporting: parseInt(r.non_reporting || "0"),
      estimated: parseInt(r.estimated || "0"),
    })),
    demand: demandData.map((r) => ({ date: r.data_date, avg: parseFloat(r.avg_demand), peak: parseFloat(r.peak_demand) })),
    efficiencyTrend: efficiencyData.map((r) => ({ date: r.data_date, value: parseFloat(r.avg_efficiency) })),
    outageSummary: {
      affected: parseInt(outageSummary[0]?.total_affected || "0"),
      sdosWithOutage: parseInt(outageSummary[0]?.sdos_with_outage || "0"),
      maxSaidi: parseFloat(outageSummary[0]?.max_saidi || "0"),
    },
  };
}
