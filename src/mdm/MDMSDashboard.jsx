import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { loadDashboardData } from "./loadDashboardData";
import Topbar from "../components/Topbar";
import "./mdm_styles.css";

// Material Symbols Icon component
function Icon({ name, className = "" }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

// Type definitions for ApexCharts options - using any for flexibility

// Helper to format date with month name (e.g., "Jan 15", "Feb 03")
const formatDateWithMonth = (dateStr) => {
  const date = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const day = date.getDate().toString().padStart(2, "0");
  return `${month} ${day}`;
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData()
      .then((d) => { 
        setData(d); 
        setLoading(false); 
      })
      .catch((err) => { 
        console.error("Failed to load:", err); 
        setError(err.message);
        setLoading(false); 
      });
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center flex-grow text-slate-700 text-xl pt-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-500">Loading MDMS Analytics...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center flex-grow text-slate-700 text-xl pt-20">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <div className="text-red-600 mb-2">Error loading dashboard</div>
            <div className="text-slate-400 text-sm">{error}</div>
          </div>
        </div>
      );
    }

    if (!data) return null;

    // Format numbers for display
    const formatMeters = (val) => {
      const num = parseInt(val);
      if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return val;
    };

    // Determine trend for KPI
    const getTrend = (label, value) => {
      const num = parseFloat(value);
      switch(label) {
        case "Billing Efficiency":
          return num >= 98 ? { trend: "+good", color: "green" } : { trend: "-warning", color: "red" };
        case "Smart Meters":
          return num >= 60 ? { trend: "+good", color: "green" } : { trend: "-warning", color: "red" };
        case "Avg Power Factor":
          return num >= 0.85 ? { trend: "+good", color: "green" } : { trend: "-warning", color: "red" };
        case "Non-Reporting":
          return num <= 5 ? { trend: "+good", color: "green" } : { trend: "-warning", color: "red" };
        default:
          return { trend: "neutral", color: "gray" };
      }
    };

    return (
      <main className="flex-grow p-8 pt-20 space-y-8 max-w-[1600px] mx-auto w-full">
        {/* KPI Row - 8 Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <KPICard 
            value={data.kpis.saidi} 
            label="SAIDI (min)" 
            subtitle="Avg outage duration"
            icon="timer"
            trend="-12%"
            trendColor="green"
          />
          <KPICard 
            value={data.kpis.saifi} 
            label="SAIFI" 
            subtitle="Avg outage frequency"
            icon="bolt"
            trend="-4%"
            trendColor="green"
          />
          <KPICard 
            value={formatMeters(data.kpis.totalMeters)} 
            label="Total Meters" 
            subtitle="Across 168 SDOs"
            icon="electric_meter"
            trend=""
            trendColor=""
          />
          <KPICard 
            value={`${data.kpis.billingEfficiency}%`} 
            label="Billing Eff." 
            subtitle="Target: 98%"
            icon="payments"
            trend={`Gap: ${(98 - parseFloat(data.kpis.billingEfficiency)).toFixed(1)}%`}
            trendColor="red"
          />
          <KPICard 
            value={formatMeters(data.kpis.smartMeterCount)} 
            label="Smart Meters" 
            subtitle={`${data.kpis.smartMeterTotal ? Math.round((parseInt(data.kpis.smartMeterCount) / parseInt(data.kpis.smartMeterTotal)) * 100) : 0}% of total`}
            icon="battery_charging_full"
            trend=""
            trendColor=""
          />
          <KPICard 
            value={data.kpis.powerFactor} 
            label="Power Factor" 
            subtitle="Target: >0.85"
            icon="speed"
            trend={parseFloat(data.kpis.powerFactor) >= 0.85 ? "Good" : "Low"}
            trendColor={parseFloat(data.kpis.powerFactor) >= 0.85 ? "green" : "red"}
          />
          <KPICard 
            value={`${data.kpis.solarExport}M`} 
            label="Solar Export" 
            subtitle="Fed back to grid"
            icon="solar_power"
            trend=""
            trendColor=""
          />
          <KPICard 
            value={formatMeters(data.kpis.nonReportingCount)} 
            label="Non-Reporting" 
            subtitle="Meters with comm failures"
            icon="signal_wifi_off"
            trend={parseFloat(data.kpis.nonReportingCount) <= 10000 ? "Good" : "High"}
            trendColor={parseFloat(data.kpis.nonReportingCount) <= 10000 ? "green" : "red"}
          />
        </section>

        {/* ── Main Charts Row ── */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <ChartCard title="System Outage Trend (SAIDI)">
              <ReactApexChart 
                type="area" 
                options={{
                  ...saidiChartOptions,
                  xaxis: {
                    ...saidiChartOptions.xaxis,
                    categories: data.saidiTrend.map((d) => formatDateWithMonth(d.date))
                  }
                }} 
                series={[{ 
                   name: "SAIDI (min)",
                   data: data.saidiTrend.map((d) => d.value) 
                }]} 
                height={300} 
              />
            </ChartCard>
          </div>
          <div className="col-span-1">
            <ChartCard title="SDO Rankings — Highest SAIDI">
              <ReactApexChart 
                type="bar" 
                options={sdoBarOptions(data.sdoRankings)} 
                series={[{ 
                   name: "SAIDI",
                   data: data.sdoRankings.map((d) => d.saidi) 
                }]} 
                height={300} 
              />
            </ChartCard>
          </div>
        </div>

        {/* ── Secondary Charts Row ── */}
        <div className="grid grid-cols-3 gap-6">
          <ChartCard title="Voltage Quality">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#e5e9eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#feae2c"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70 * (data.voltage.vdi * 20)} ${2 * Math.PI * 70}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-amber-500">{data.voltage.vdi}</span>
                  <span className="text-xs text-slate-500">VDI</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  <Icon name="check_circle" className="w-4 h-4 mr-1" />
                  Stable
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                {data.voltage.count} valid voltage readings analyzed
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Technology Split">
            <ReactApexChart 
              type="donut" 
              options={donutOptions} 
              series={[data.meterSplit.smart, data.meterSplit.legacy]} 
              height={280} 
            />
          </ChartCard>

          <ChartCard title="Daily Consumption (kWh)">
            <ReactApexChart 
              type="bar" 
              options={{
                 ...consumptionOptions(data.consumption),
                 xaxis: {
                    categories: data.consumption.map((d) => formatDateWithMonth(d.date)),
                    title: { text: "Date", style: { color: "#64748b" } },
                    labels: { style: { colors: "#64748b" } }
                 }
              }} 
              series={[{ 
                 name: "kWh (000s)",
                 data: data.consumption.map((d) => d.kwh) 
              }]} 
              height={280} 
            />
          </ChartCard>
        </div>

        {/* ── Tertiary Charts Row ── */}
        <div className="grid grid-cols-3 gap-6">
          <ChartCard title="Power Factor Trend">
            <ReactApexChart 
              type="area" 
              options={{
                 ...pfChartOptions,
                 xaxis: {
                    ...pfChartOptions.xaxis,
                    categories: data.pfTrend.map((d) => formatDateWithMonth(d.date))
                 }
              }} 
              series={[{ 
                 name: "Power Factor",
                 data: data.pfTrend.map((d) => d.value) 
              }]} 
              height={280} 
            />
          </ChartCard>

          <ChartCard title="Solar Export (kWh)">
            <ReactApexChart 
              type="bar" 
              options={{
                 ...solarChartOptions,
                 xaxis: {
                    ...solarChartOptions.xaxis,
                    categories: data.solarTrend.map((d) => formatDateWithMonth(d.date))
                 }
              }} 
              series={[{ 
                 name: "Export (000s kWh)",
                 data: data.solarTrend.map((d) => d.kwh) 
              }]} 
              height={280} 
            />
          </ChartCard>

          <ChartCard title="Meter Health">
            <ReactApexChart 
              type="bar" 
              options={{
                 ...healthChartOptions,
                 xaxis: {
                    ...healthChartOptions.xaxis,
                    categories: data.meterHealth.map((d) => formatDateWithMonth(d.date))
                 }
              }} 
              series={[
                 { name: "Communicating", data: data.meterHealth.map((d) => d.communicating / 1000) },
                 { name: "Non-Reporting", data: data.meterHealth.map((d) => d.nonReporting / 1000) },
                 { name: "Estimated", data: data.meterHealth.map((d) => d.estimated / 1000) },
              ]} 
              height={280} 
            />
          </ChartCard>
        </div>

        {/* ── Bottom Row ── */}
        <div className="grid grid-cols-2 gap-6">
          <ChartCard title="Peak Demand Trend">
            <ReactApexChart 
              type="line" 
              options={{
                 ...demandOptions,
                 xaxis: {
                    ...demandOptions.xaxis,
                    categories: data.demand.map((d) => formatDateWithMonth(d.date))
                 }
              }} 
              series={[
                 { name: "Avg Demand (kW)", data: data.demand.map((d) => d.avg) },
                 { name: "Peak Demand (kW)", data: data.demand.map((d) => d.peak) },
              ]} 
              height={280} 
            />
          </ChartCard>

          <ChartCard title="Billing Efficiency Trend">
            <ReactApexChart 
              type="area" 
              options={{
                 ...efficiencyOptions,
                 xaxis: {
                    ...efficiencyOptions.xaxis,
                    categories: data.efficiencyTrend.map((d) => formatDateWithMonth(d.date))
                 }
              }} 
              series={[{ 
                 name: "Efficiency %",
                 data: data.efficiencyTrend.map((d) => d.value) 
              }]} 
              height={280} 
            />
          </ChartCard>
        </div>
      </main>
    );
  };

  return (
    <div className="mdm-dashboard-root min-h-screen flex flex-col bg-mesh text-slate-700">
      <Topbar />
      {renderContent()}
    </div>
  );
}

// ── Components ──

function KPICard({ value, label, subtitle, icon, trend, trendColor }) {
  const getTrendBadge = () => {
    if (!trend) return null;
    const baseClasses = "text-[10px] font-bold px-1.5 py-0.5 rounded-full";
    if (trendColor === "green") {
      return <span className={`${baseClasses} text-green-700 bg-green-100`}>{trend}</span>;
    }
    if (trendColor === "red") {
      return <span className={`${baseClasses} text-red-700 bg-red-100`}>{trend}</span>;
    }
    return <span className={`${baseClasses} text-slate-600 bg-slate-100`}>{trend}</span>;
  };

  return (
    <div className="glass-card kpi-hover p-5 rounded-xl border border-white/60 flex flex-col justify-between cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <Icon name={icon} className="text-slate-600 opacity-60" />
        {getTrendBadge()}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        <div className="text-xs font-bold uppercase tracking-tighter text-slate-500">{label}</div>
      </div>
      <div className="text-[10px] mt-2 text-slate-400">{subtitle}</div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-white/60">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">{title}</h2>
      {children}
    </div>
  );
}

// ── ApexCharts Options (Light Theme) ──

const saidiChartOptions = {
  chart: { 
    type: "area",
    toolbar: { show: false } 
  },
  stroke: { curve: "smooth", width: 3 },
  markers: { size: 4, colors: ["#3B82F6"], strokeWidth: 2, strokeColors: ["#fff"] },
  fill: { 
    type: "gradient", 
    gradient: { 
      shadeIntensity: 1, 
      opacityFrom: 0.4, 
      opacityTo: 0.05, 
      stops: [0, 100] 
    } 
  },
  colors: ["#3B82F6"],
  xaxis: { 
    title: { text: "Date", style: { color: "#64748b" } },
    labels: { style: { colors: "#64748b" } } 
  },
  yaxis: { 
    title: { text: "SAIDI (minutes)", style: { color: "#64748b" } },
    labels: { style: { colors: "#64748b" } },
    min: 0,
    max: 60
  },
  annotations: { 
    yaxis: [{ 
      y: 60, 
      borderColor: "#F5A623", 
      strokeDashArray: 4, 
      label: { 
        text: "Threshold: 60m", 
        style: { color: "#fff", background: "#F5A623" } 
      } 
    }] 
  },
  grid: { 
    borderColor: "#e2e8f0", 
    strokeDashArray: 4 
  },
  dataLabels: { enabled: false }
};

function sdoBarOptions(data) {
  return {
    chart: { 
      type: "bar",
      toolbar: { show: false } 
    },
    plotOptions: { 
      bar: { 
        horizontal: true, 
        borderRadius: 4
      } 
    },
    colors: ["#3B82F6"],
    xaxis: { 
      categories: data.map(d => d.sdo),
      title: { text: "SAIDI (minutes)", style: { color: "#64748b" } },
      labels: { style: { colors: "#64748b" } } 
    },
    yaxis: {
      title: { text: "SDO", style: { color: "#64748b" } }
    },
    grid: { 
      borderColor: "#e2e8f0" 
    },
    dataLabels: { enabled: false }
  };
}

const donutOptions = {
  chart: { type: "donut" },
  labels: ["Smart Meters", "Legacy Meters"],
  colors: ["#3B82F6", "#94a3b8"],
  legend: { 
    position: "bottom",
    labels: { colors: "#64748b" }
  },
  plotOptions: { 
    pie: { 
      donut: { 
        size: "70%", 
        labels: { 
          show: true, 
          total: { 
            show: true, 
            label: "Smart %", 
            color: "#64748b" 
          } 
        } 
      } 
    } 
  },
  dataLabels: { enabled: false }
};

function consumptionOptions(data) {
  return {
    chart: { 
      type: "bar",
      toolbar: { show: false } 
    },
    colors: data.map((_, i) => i === data.length - 1 ? "#F5A623" : "#3B82F6"),
    xaxis: { 
      categories: data.map(d => d.date.slice(5)),
      title: { text: "Date", style: { color: "#64748b" } },
      labels: { style: { colors: "#64748b" } } 
    },
    yaxis: {
      title: { text: "Consumption (kWh in thousands)", style: { color: "#64748b" } },
      labels: { style: { colors: "#64748b" } }
    },
    grid: { 
      borderColor: "#e2e8f0" 
    },
    dataLabels: { enabled: false }
  };
}

const pfChartOptions = {
  chart: { 
    type: "line",
    toolbar: { show: false } 
  },
  stroke: { curve: "smooth", width: 3 },
  markers: { size: 5, colors: ["#10B981"], strokeWidth: 2, strokeColors: ["#fff"] },
  colors: ["#10B981"],
  xaxis: { 
    title: { text: "Date", style: { color: "#64748b" } },
    labels: { style: { colors: "#64748b" } } 
  },
  yaxis: { 
    title: { text: "Power Factor", style: { color: "#64748b" } },
    labels: { style: { colors: "#64748b" } },
    min: 0.7,
    max: 1.0
  },
  annotations: { 
    yaxis: [{ 
      y: 0.85, 
      borderColor: "#F5A623", 
      strokeDashArray: 4, 
      label: { 
        text: "Target: 0.85", 
        style: { color: "#fff", background: "#F5A623" } 
      } 
    }] 
  },
  grid: { 
    borderColor: "#e2e8f0" 
  },
  dataLabels: { enabled: false }
};

const solarChartOptions = {
  chart: { 
    type: "bar",
    toolbar: { show: false } 
  },
  colors: ["#F59E0B"],
  xaxis: { 
    title: { text: "Date", style: { color: "#64748b" } },
    labels: { style: { colors: "#64748b" } } 
  },
  yaxis: {
    title: { text: "Solar Export (kWh in thousands)", style: { color: "#64748b" } },
    labels: { style: { colors: "#64748b" } }
  },
  grid: { 
    borderColor: "#e2e8f0" 
  },
  dataLabels: { enabled: false }
};

const healthChartOptions = {
  chart: { 
    type: "bar",
    toolbar: { show: false },
    stacked: true 
  },
  colors: ["#10B981", "#EF4444", "#F5A623"],
  xaxis: { 
    title: { text: "Date", style: { color: "#64748b" } },
    labels: { style: { colors: "#64748b" } } 
  },
  yaxis: {
    title: { text: "Meter Count", style: { color: "#64748b" } },
    labels: { style: { colors: "#64748b" } }
  },
  grid: { 
    borderColor: "#e2e8f0" 
  },
  legend: { 
    labels: { colors: "#64748b" } 
  },
  dataLabels: { enabled: false }
};

const demandOptions = {
  chart: { 
    type: "line",
    toolbar: { show: false } 
  },
  stroke: { curve: "smooth", width: 3 },
  markers: { size: 5, strokeWidth: 2, strokeColors: ["#fff"] },
  colors: ["#3B82F6", "#F5A623"],
  xaxis: { 
    title: { text: "Date", style: { color: "#64748b" } },
    labels: { style: { colors: "#64748b" } } 
  },
  yaxis: {
    title: { text: "Demand (kW)", style: { color: "#64748b" } },
    labels: { style: { colors: "#64748b" } }
  },
  grid: { 
    borderColor: "#e2e8f0" 
  },
  legend: { 
    labels: { colors: "#64748b" } 
  },
  dataLabels: { enabled: false }
};

const efficiencyOptions = {
  chart: { 
    type: "line",
    toolbar: { show: false } 
  },
  stroke: { curve: "smooth", width: 3 },
  markers: { size: 5, colors: ["#10B981"], strokeWidth: 2, strokeColors: ["#fff"] },
  colors: ["#10B981"],
  xaxis: { 
    title: { text: "Date", style: { color: "#64748b" } },
    labels: { style: { colors: "#64748b" } } 
  },
  yaxis: { 
    title: { text: "Efficiency (%)", style: { color: "#64748b" } },
    labels: { style: { colors: "#64748b" } },
    min: 80,
    max: 100
  },
  annotations: {
    yaxis: [{
      y: 98,
      borderColor: "#F5A623",
      strokeDashArray: 4,
      label: {
        text: "Target: 98%",
        style: { color: "#fff", background: "#F5A623" }
      }
    }]
  },
  grid: { 
    borderColor: "#e2e8f0" 
  },
  dataLabels: { enabled: false }
};
