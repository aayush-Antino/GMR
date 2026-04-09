import { useMemo, useState, useEffect } from "react";
import {
  ComposedChart,
  BarChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
  ReferenceLine,
} from "recharts";
import {
  AlertTriangle,
  CheckCircle,
  Package,
  Activity,
  Zap,
  Moon,
  Sun,
} from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

import { generateRegionData } from "./utils/generateRegionData";
import { AGRA_RAW, AGRA_SAT_MILESTONES } from "./utils/agra_constants";
import { KASHI_RAW, KASHI_SAT_MILESTONES } from "./utils/kashi_constants";
import {
  TRIVENI_RAW,
  TRIVENI_SAT_MILESTONES,
} from "./utils/triveni_constants";
import { buildQuarterWiseInventory } from "./utils/generateQuarterWiseInventory";
import SatBlueDiagram from "./Charts/SatBlueDiagram";
import QuarterAbsorptionChart from "./Charts/QuarterAbsorptionChart";
import { satBlueData, aggregateQuarterlyData } from "./data/satAnalysis";
import Topbar from "../components/Topbar";
import gmrLogoAsset from "../assets/gmr_logo.png";

const gmrLogo = gmrLogoAsset;

// Utility for Tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Theme configuration
const THEMES = {
  blue: {
    primary: "#2563eb",
    light: "#dbeafe",
    text: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  purple: {
    primary: "#9333ea",
    light: "#f3e8ff",
    text: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  teal: {
    primary: "#0d9488",
    light: "#ccfbf1",
    text: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
};

// SAT Stage labels
const SAT_STAGES = [
  { key: "s1", name: "S1", fullName: "Network Latch", short: "Net" },
  { key: "s2", name: "S2", fullName: "Instantaneous", short: "Inst" },
  { key: "s3", name: "S3", fullName: "Load Survey", short: "Load" },
  { key: "s4", name: "S4", fullName: "Daily Profile", short: "Prof" },
  { key: "s5", name: "S5", fullName: "Midnight Snapshot", short: "Mid" },
  { key: "s6", name: "S6", fullName: "Events", short: "Evt" },
  { key: "s7", name: "S7", fullName: "Billing (Cleared)", short: "Bill" },
];

const parseDate = (d) => {
  if (!d) return null;
  const [m, day, y] = d.split("/").map(Number);
  return new Date(y, m - 1, day);
};

const diffDays = (from, to) => {
  if (!from || !to) return null;
  const start = parseDate(from);
  const end = parseDate(to);
  if (!start || !end) return null;
  return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
};

// Risk Badge Component
const RiskBadge = ({ type, text }) => {
  const styles = {
    risk: "bg-red-50 text-red-700 border-red-100",
    good: "bg-emerald-50 text-emerald-700 border-emerald-100",
    neutral: "bg-slate-50 text-slate-600 border-slate-100",
  };
  const Icons = {
    risk: AlertTriangle,
    good: CheckCircle,
    neutral: Activity,
  };
  const Icon = Icons[type];

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-medium",
        styles[type],
      )}
    >
      {/* <Icon className="w-3 h-3" /> */}
      <Icon size={12} color="white" fill="green" />
      <span>{text}</span>
    </div>
  );
};

// Reusable KPI Tile Component
const KpiTile = ({
  label,
  value,
  isDarkMode,
  accentColor,
  panelBg,
  tooltip
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative kpi-card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: "relative", zIndex: isHovered ? 40 : 1 }}
    >
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "34px",
          padding: "2px 4px",
          transition: "all 0.2s ease",
          border: isDarkMode ? "1px solid #334155" : `1.5px solid ${accentColor}`,
          backgroundColor: isDarkMode ? "#1e293b" : panelBg,
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.1)",
          borderRadius: "10px",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            fontWeight: "800",
            lineHeight: "1",
            fontSize: "12px",
            color: isDarkMode ? "#ffffff" : "#1e293b"
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "11px",
            color: isDarkMode ? "#ffffff" : "#1e293b",
            opacity: "0.8"
          }}
        >
          {label}
        </div>
      </div>
      
      {/* TOOLTIP */}
      {tooltip && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: isDarkMode ? "#1e293b" : "#0f172a",
            color: "#ffffff",
            fontSize: "10px",
            padding: "4px 8px",
            borderRadius: "4px",
            whiteSpace: "nowrap",
            zIndex: 45,
            pointerEvents: "none",
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            border: "1px solid #334155",
            opacity: isHovered ? 1 : 0,
            visibility: isHovered ? "visible" : "hidden",
            transition: "all 0.2s ease"
          }}
        >
          {tooltip}
          {/* Arrow */}
          <div 
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              border: "6px solid transparent",
              borderTopColor: isDarkMode ? "#1e293b" : "#0f172a"
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

// Region Column Component - Redesigned for single screen, no scrolling
const RegionColumn = ({ data, name, isDarkMode }) => {
  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="flex flex-col h-full bg-white border-r border-slate-200 p-4 items-center justify-center">
        <p className="text-slate-500">No data available</p>
      </div>
    );
  }

  const theme = THEMES[data.theme] || THEMES.blue;
  const gid = `${data.name}-${data.theme}`;
  const latest = data.data[data.data.length - 1];

  const previous =
    data.data.length > 1 ? data.data[data.data.length - 2] : latest;

  // Calculate metrics
  const revenueGap = latest.cumInstalled - latest.cumSatCleared;
  const stockRisk = latest.stockInHand > latest.installed * 3;
  const velocityTrend = latest.installed > previous.installed ? "up" : "down";

  // Post-SAT data for SAT analysis
  const postSatData = data.data.filter((d, i) => i >= 9);
  const satAnalysisData = postSatData.map((d) => ({
    month: d.month,
    installed: d.installed,
    satCleared: d.satCleared,
    SAT_1: d.satBreakdown.s1,
    SAT_2: d.satBreakdown.s2,
    SAT_3: d.satBreakdown.s3,
    SAT_4: d.satBreakdown.s4,
    SAT_5: d.satBreakdown.s5,
    SAT_6: d.satBreakdown.s6,
    SAT_7: d.satBreakdown.s7,
  }));

  const satEligibilityData = useMemo(() => {
    // const latest = data.data[data.data.length - 1];
    const latest = data?.data?.find((d) => d.month === "Feb-25");
    const s = latest.satBreakdown;
    // console.log("Latest SAT Breakdown:", latest);
    return [
      { stage: "SAT-1", eligible: latest.installed, completed: s.s1 },
      { stage: "SAT-2", eligible: latest.installed, completed: s.s2 },
      { stage: "SAT-3", eligible: latest.installed, completed: s.s3 },
      { stage: "SAT-4", eligible: latest.installed, completed: s.s4 },
      { stage: "SAT-5", eligible: latest.installed, completed: s.s5 },
      { stage: "SAT-6", eligible: latest.installed, completed: s.s6 },
      { stage: "SAT-7", eligible: latest.installed, completed: s.s7 },
    ].map((d) => ({
      ...d,
      gap: Math.max(d.eligible - d.completed, 0),
      pct:
        d.eligible > 0
          ? Number(((d.completed / d.eligible) * 100).toFixed(1))
          : 0,
    }));
  }, [data.data]);

  // console.log("SAT Eligibility Data:", satEligibilityData);

  const satCashCycleData = useMemo(() => {
    if (!data.satMilestones) return [];

    return SAT_STAGES.map((stage, idx) => {
      const milestone =
        data.satMilestones[stage.key] || // s1, s2
        data.satMilestones[idx + 1]; // 1, 2 (Agra fallback)

      if (!milestone?.start || !milestone?.lumpsumInv) {
        return {
          sat: stage.name,
          op: null,
          fin: null,
          total: null,
        };
      }

      const op = diffDays(milestone.start, milestone.lumpsumInv);
      // const fin = milestone.lumpsumCol
      //     ? diffDays(milestone.lumpsumInv, milestone.lumpsumCol)
      //     : null;
      const fin = diffDays(milestone.lumpsumInv, milestone.scCol);

      return {
        sat: stage.name,
        op,
        fin,
        total: fin !== null ? op + fin : null,
      };
    });
  }, [data.satMilestones]);

  // const satEligibilityData = useMemo(() => {
  //     const latest = data.data[data.data.length - 1];
  //     const s = latest.satBreakdown;

  //     return [
  //         { stage: "SAT-1", eligible: latest.installed, completed: s.s1 },
  //         { stage: "SAT-2", eligible: s.s1, completed: s.s2 },
  //         { stage: "SAT-3", eligible: s.s2, completed: s.s3 },
  //         { stage: "SAT-4", eligible: s.s3, completed: s.s4 },
  //         { stage: "SAT-5", eligible: s.s4, completed: s.s5 },
  //         { stage: "SAT-6", eligible: s.s5, completed: s.s6 },
  //         { stage: "SAT-7", eligible: s.s6, completed: s.s7 },
  //     ].map((d) => ({
  //         ...d,
  //         pct: d.eligible > 0 ? Math.round((d.completed / d.eligible) * 100) : 0,
  //     }));
  // }, [data.data]);

  const quarterWiseInventoryData = useMemo(() => {
    return aggregateQuarterlyData(data.data);
  }, [data.data]);

  // Section background by region (light mode only)
  // Section background — kept for sectionBg variable (now unused directly, but passed to charts)
  const sectionBg =
    data.name === "Kashi" ? "#cde8f8"
    : data.name === "Triveni" ? "#c5ede9"
    : "#f0d8f7";

  // Region accent colors — exactly matching reference vibrant colors
  const regionAccent =
    data.name === "Kashi"
      ? { border: "#D1E2EB", headerBg: "#D1E2EB", title: "#334155", panelBg: "#ffffff", kpiBg: "#E1EBF1" }
      : data.name === "Triveni"
        ? { border: "#BFE8E6", headerBg: "#BFE8E6", title: "#065f46", panelBg: "#ffffff", kpiBg: "#D9F1F0" }
        : { border: "#F8DFF6", headerBg: "#F8DFF6", title: "#701a75", panelBg: "#ffffff", kpiBg: "#FBEBFB" };

  // console.log("quarterWiseInventoryData", quarterWiseInventoryData)

  const chartData = useMemo(() => {
    if (!data || !data.data) return [];

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return data.data.map((d) => {
      const [mStr, yStr] = d.month.split("-");
      let year = parseInt(yStr);
      if (year < 100) year += 2000;
      const monthIndex = months.indexOf(mStr);

      // SAT starts Mar-2025
      const isPostSat = year > 2025 || (year === 2025 && monthIndex >= 2);

      return {
        ...d,
        cumSatCleared: isPostSat ? d.cumSatCleared : null,
      };
    });
  }, [data.data]);

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: isDarkMode ? "#0f172a" : regionAccent.panelBg,
        border: !isDarkMode ? `1.5px solid ${regionAccent.border}` : "none",
        borderRadius: "12px",
        margin: "1px",
        paddingBottom: "0px",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      }}
    >
      {/* Header Bar */}
      <div 
        style={{
          padding: "2px 0",
          borderBottom: "1px solid " + (isDarkMode ? "#334155" : regionAccent.border),
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          backgroundColor: isDarkMode ? "#1e293b" : regionAccent.headerBg
        }}
      >
        <h2 
          style={{
            fontSize: "13px",
            fontWeight: "800",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            textAlign: "center",
            color: !isDarkMode ? regionAccent.title : "#cbd5e1"
          }}
        >
          {data.name}
        </h2>
      </div>

      <div style={{ paddingBottom: "4px", paddingLeft: "8px", paddingRight: "8px", paddingTop: "8px" }}>
        {/* KPI Tiles grid */}
        <div
          className="grid grid-cols-4"
          style={{ gap: "2px" }}
        >
          {/* 1. Inventory */}
          <KpiTile
            label="Inventory"
            value={(() => {
              // Hardcoded values for Agra KPI
              if (data.name === "Agra") {
                return (1338954).toLocaleString();
              }
              return latest.cumReceived.toLocaleString();
            })()}
            isDarkMode={isDarkMode}
            accentColor={regionAccent.border}
            panelBg={regionAccent.kpiBg}
            tooltip={data.name === "Agra" ? "Inventory as on 10/02/2026" : "Inventory as on 10/02/2026"}
          />

          {/* 2. Installed */}
          <KpiTile
            label="Installed"
            value={(() => {
              // Hardcoded values for Agra KPI
              if (data.name === "Agra") {
                return (1242909).toLocaleString();
              }
              return latest.cumInstalled.toLocaleString();
            })()}
            isDarkMode={isDarkMode}
            accentColor={regionAccent.border}
            panelBg={regionAccent.kpiBg}
            tooltip={data.name === "Agra" ? "Meters Installed as on 10/02/2026" : "Meters Installed as on 10/02/2026"}
          />

          {/* 3. Total SAT */}
          <KpiTile
            label="Total SAT"
            value={(() => {
              // Hardcoded values for Agra KPI
              if (data.name === "Agra") {
                return (960317).toLocaleString();
              }
              return latest.cumSatCleared.toLocaleString();
            })()}
            isDarkMode={isDarkMode}
            accentColor={regionAccent.border}
            panelBg={regionAccent.kpiBg}
            tooltip={data.name === "Agra" ? "Total SAT as on 28/02/2026" : "Total SAT as on 28/02/2026"}
          />

          {/* 4. Total Invoice */}
          <KpiTile
            label="Total Invoice"
            value={(() => {
              // Hardcoded values for each region
              const totalInvoiceValues = {
                Kashi: 692228,
                Triveni: 671932,
                Agra: 960317,
              };
              return (totalInvoiceValues[data.name] || 0).toLocaleString();
            })()}
            isDarkMode={isDarkMode}
            accentColor={regionAccent.border}
            panelBg={regionAccent.kpiBg}
            tooltip={data.name === "Agra" ? "Total Invoice as on 05/03/2026" : "Total Invoice as on 05/03/2026"}
          />
        </div>
      </div>
      <div
        style={{
          flex: "1",
          gap: "6px",
          overflow: "hidden",
          display: "grid",
          gridTemplateRows: "repeat(3, minmax(0, 1fr))",
          minHeight: "0",
          backgroundColor: isDarkMode ? "#0f172a" : regionAccent.panelBg,
          paddingLeft: "8px", 
          paddingRight: "8px",
          paddingTop: "2px",
          paddingBottom: "8px",
          borderBottomLeftRadius: "12px",
          borderBottomRightRadius: "12px",
        }}
      >
        {/* Chart 1: Inventory vs Installation vs SAT */}
        <div
          style={{
            width: "calc(100% - 2px)",
            height: "calc(100% - 2px)",
            margin: "1px",
            minHeight: "0",
            flexShrink: 0,
            borderRadius: "10px",
            padding: "2px 4px",
            display: "flex",
            flexDirection: "column",
            border: isDarkMode ? "1px solid #334155" : `1.5px solid ${regionAccent.border}`,
            backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            boxSizing: "border-box"
          }}
        >
          <div className="flex items-center justify-between mb-0 shrink-0">
            {/* Title */}
            <div className="flex items-center gap-4">
              <h3
                className={cn(
                  "text-[12px] font-bold uppercase tracking-wide",
                  isDarkMode ? "text-slate-200" : "text-slate-700",
                )}
                style={{ paddingLeft: "10px" }}
              >
                Inventory vs Installation vs SAT
              </h3>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 2, right: 5, left: -10, bottom: 12 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={isDarkMode ? "#334155" : "#e5e7eb"}
                  strokeOpacity={0.5}
                />

                {(() => {
                  // Build custom ticks: spaced labels + always show last month.
                  const xTicks =
                    chartData && chartData.length
                      ? chartData
                          .map((d, index) => {
                            if (index === chartData.length - 1) return d.month;
                            return index % 3 === 0 ? d.month : null;
                          })
                          .filter(Boolean)
                      : [];

                  return (
                    <XAxis
                      dataKey="month"
                      tick={{
                        fontSize: 10,
                        fill: isDarkMode ? "#cbd5e1" : "#080808",
                        fontWeight: 500,
                        angle: -30,
                        textAnchor: "end",
                      }}
                      ticks={xTicks}
                      interval={0}
                      // padding={{ right: 10 }}
                      tickMargin={6}
                    />
                  );
                })()}

                <YAxis
                  tick={{
                    fontSize: 10,
                    fontWeight: 600,
                    fill: isDarkMode ? "#cbd5e1" : "#080808",
                  }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                />

                <Tooltip
                  formatter={(value) => value?.toLocaleString?.() ?? value}
                  itemSorter={(item) => {
                    if (item.name === "Inventory") return 0;
                    if (item.name === "Total Installed") return 1;
                    if (item.name === "Cumulative SAT") return 2;
                    return 99;
                  }}
                  contentStyle={{
                    borderRadius: "6px",
                    fontSize: "9px",
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                    border: isDarkMode
                      ? "1px solid #334155"
                      : "1px solid #e5e7eb",
                    color: isDarkMode ? "#cbd5e1" : "#1e293b",
                  }}
                />

                {/* INVENTORY / RECEIVED */}
                <Area
                  type="monotone"
                  dataKey="cumReceived"
                  name="Inventory"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                >
                  <LabelList
                    dataKey="cumReceived"
                    position="top"
                    content={(props) => {
                      const { x, y, value, index, payload } = props;
                      // Show label every 4th point, only if value exists and is not zero
                      if (index % 4 !== 0 || !value || value === 0) return null;
                      return (
                        <text
                          x={x}
                          y={y}
                          dy={-12}
                          fill="#3b82f6"
                          fontSize={8}
                          fontWeight={600}
                          textAnchor="middle"
                        >
                          {(value / 1000).toFixed(0)}K
                        </text>
                      );
                    }}
                  />
                </Area>

                {/* INSTALLED */}
                <Area
                  type="monotone"
                  dataKey="cumInstalled"
                  name="Installed"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.1}
                  strokeWidth={2}
                >
                  <LabelList
                    dataKey="cumInstalled"
                    position="top"
                    content={(props) => {
                      const { x, y, value, index } = props;
                      // Show label every 4th point, only if value exists and is not zero
                      if (index % 4 !== 0 || !value || value === 0) return null;
                      return (
                        <text
                          x={x}
                          y={y}
                          dy={-1}
                          fill="#10b981"
                          fontSize={8}
                          fontWeight={600}
                          textAnchor="middle"
                        >
                          {(value / 1000).toFixed(0)}K
                        </text>
                      );
                    }}
                  />
                </Area>

                {/* SAT CLEARED */}
                <Area
                  type="monotone"
                  dataKey="cumSatCleared"
                  name="SAT"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  connectNulls={true}
                >
                  <LabelList
                    dataKey="cumSatCleared"
                    position="top"
                    content={(props) => {
                      const { x, y, value, index } = props;
                      // Show label every 4th point, only if value exists and is not zero
                      if (index % 4 !== 0 || !value || value === 0) return null;
                      return (
                        <text
                          x={x}
                          y={y}
                          dy={10}
                          fill="#3b82f6"
                          fontSize={9}
                          fontWeight={700}
                          textAnchor="middle"
                        >
                          {(value / 1000).toFixed(0)}K
                        </text>
                      );
                    }}
                  />
                </Area>

                <Legend
                  verticalAlign="top"
                  height={20}
                  iconType="circle"
                  iconSize={6}
                  itemSorter={(item) => {
                    if (item.value === "Inventory") return 0;
                    if (item.value === "Installed") return 1;
                    if (item.value === "SAT") return 2;
                    return 99;
                  }}
                  wrapperStyle={{
                    fontSize: "10px",
                    fontWeight: 500,
                    top: -2,
                    color: isDarkMode ? "#cbd5e1" : "#1e293b",
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2.1: SAT Eligibility vs Achievement */}
        <div className="min-h-0 shrink-0 overflow-hidden">
          <SatBlueDiagram
            data={satBlueData[data.name]}
            variant="compact"
            isDarkMode={isDarkMode}
            sectionBg={regionAccent.panelBg}
            accentColor={regionAccent.border}
          />
        </div>

        {/* Chart 3.2: Inventory vs Installation */}
        <div className="min-h-0 shrink-0 overflow-hidden">
          <QuarterAbsorptionChart
            data={quarterWiseInventoryData}
            variant="compact"
            isDarkMode={isDarkMode}
            sectionBg={regionAccent.panelBg}
            accentColor={regionAccent.border}
          />
        </div>

        {/* Chart 4.1: Invoicing Delay Breakdown */}
        {/* <div className="min-h-0 shrink-0 border border-slate-200 rounded-lg p-1 bg-white shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wide text-slate-700">
              SAT-to-Cash Conversion Timeline
            </h4>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart
              data={satCashCycleData}
              margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="sat" tick={{ fontSize: 9 }} interval={0} />
              <YAxis
                tick={{ fontSize: 9 }}
                domain={[0, 160]}
                tickFormatter={(v) => `${v}d`}
                width={25}
              />

              <Tooltip
                formatter={(v, n) =>
                  v === null
                    ? ["OPEN", n]
                    : [
                      `${v} days`,
                      n === "op" ? "SAT → Invoice" : "Invoice → Collection",
                    ]
                }
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '10px',
                  padding: '4px 8px'
                }}
              />

              <ReferenceLine y={45} stroke="#10b981" strokeDasharray="4 4" />
              <ReferenceLine y={75} stroke="#f59e0b" strokeDasharray="4 4" />

              <Bar dataKey="op" stackId="a" fill="#2563eb" radius={[0, 0, 0, 0]} barSize={12}>
                <LabelList
                  dataKey="op"
                  position="inside"
                  fill="#fff"
                  fontSize={8}
                />
              </Bar>
              <Bar dataKey="fin" stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} barSize={12}>
                <LabelList
                  dataKey="total"
                  position="top"
                  fontSize={9}
                  fontWeight={700}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div> */}
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function CommandCenterDashboard() {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  // Save preference to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };
  const kashiData = useMemo(
    () => generateRegionData("Kashi", "blue", KASHI_RAW, KASHI_SAT_MILESTONES),
    [],
  );

  // Prepare Quarter-wise data for all regions
  const quarterAbsorptionData = useMemo(() => {
    const kashi = generateRegionData("Kashi", "blue", KASHI_RAW, []);
    const triveni = generateRegionData("Triveni", "purple", TRIVENI_RAW, []);
    const agra = generateRegionData("Agra", "teal", AGRA_RAW, []);

    return {
      Kashi: aggregateQuarterlyData(kashi.data),
      Triveni: aggregateQuarterlyData(triveni.data),
      Agra: aggregateQuarterlyData(agra.data),
    };
  }, []);

  // console.log("Kashi Data:", kashiData);
  const triveniData = useMemo(
    () =>
      generateRegionData(
        "Triveni",
        "purple",
        TRIVENI_RAW,
        TRIVENI_SAT_MILESTONES,
      ),
    [],
  );

  const agraData = useMemo(
    () => generateRegionData("Agra", "teal", AGRA_RAW, AGRA_SAT_MILESTONES),
    [],
  );

  const kashiLatest =
    kashiData.data && kashiData.data.length > 0
      ? kashiData.data[kashiData.data.length - 1]
      : { cumInstalled: 0, cumSatCleared: 0 };
  const triveniLatest =
    triveniData.data && triveniData.data.length > 0
      ? triveniData.data[triveniData.data.length - 1]
      : { cumInstalled: 0, cumSatCleared: 0 };
  const agraLatest =
    agraData.data && agraData.data.length > 0
      ? agraData.data[agraData.data.length - 1]
      : { cumInstalled: 0, cumSatCleared: 0 };

  // Filter data based on selected region
  const getFilteredLatest = () => {
    if (selectedRegion === "All") {
      return {
        kashi: kashiLatest,
        triveni: triveniLatest,
        agra: agraLatest,
      };
    } else if (selectedRegion === "Kashi") {
      return { kashi: kashiLatest };
    } else if (selectedRegion === "Triveni") {
      return { triveni: triveniLatest };
    } else if (selectedRegion === "Agra") {
      return { agra: agraLatest };
    }
    return { kashi: kashiLatest, triveni: triveniLatest, agra: agraLatest };
  };

  const filteredLatest = getFilteredLatest();

  const totalInstalled = Object.values(filteredLatest).reduce(
    (sum, latest) => sum + (latest.cumInstalled || 0),
    0,
  );

  const totalCleared = Object.values(filteredLatest).reduce(
    (sum, latest) => sum + (latest.cumSatCleared || 0),
    0,
  );

  if (!kashiData || !kashiData.data || kashiData.data.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Loading Dashboard...
          </h1>
          <p className="text-slate-600">Generating data...</p>
        </div>
      </div>
    );
  }

  // Calculate global GAP metrics
  const globalWipGap = totalInstalled - totalCleared;
  const kashiLatestReceived =
    kashiData.data && kashiData.data.length > 0
      ? kashiData.data[kashiData.data.length - 1].cumReceived
      : 0;
  const triveniLatestReceived =
    triveniData.data && triveniData.data.length > 0
      ? triveniData.data[triveniData.data.length - 1].cumReceived
      : 0;
  const agraLatestReceived =
    agraData.data && agraData.data.length > 0
      ? agraData.data[agraData.data.length - 1].cumReceived
      : 0;

  // Filter received data based on selected region
  const getFilteredReceived = () => {
    if (selectedRegion === "All") {
      return kashiLatestReceived + triveniLatestReceived + agraLatestReceived;
    } else if (selectedRegion === "Kashi") {
      return kashiLatestReceived;
    } else if (selectedRegion === "Triveni") {
      return triveniLatestReceived;
    } else if (selectedRegion === "Agra") {
      return agraLatestReceived;
    }
    return kashiLatestReceived + triveniLatestReceived + agraLatestReceived;
  };

  const totalReceived = getFilteredReceived();
  const globalInventoryGap = totalReceived - totalInstalled;
  const globalSatConversion =
    totalInstalled > 0 ? (totalCleared / totalInstalled) * 100 : 0;

  return (
    <div className="gmr-dashboard-scope min-h-screen bg-[#f8fafc]">
      <Topbar />
      <div style={{ 
        height: "142.86vh", 
        width: "142.86vw", 
        zoom: "0.7", 
        overflow: "hidden", 
        position: "fixed", 
        top: 0, 
        left: 0, 
        backgroundColor: "#f8fafc", 
        paddingTop: "69px",
        display: "flex",
        flexDirection: "column"
      }}>
        <main style={{ 
          flex: 1, 
          display: "flex", 
          gap: "12px", 
          padding: "12px 12px 12px 12px", 
          boxSizing: "border-box",
          height: "calc(100% - 69px)"
        }}>
          {(selectedRegion === "All" || selectedRegion === "Kashi") && (
            <RegionColumn
              data={kashiData}
              name="Kashi"
              isDarkMode={isDarkMode}
            />
          )}
          {(selectedRegion === "All" || selectedRegion === "Triveni") && (
            <RegionColumn
              data={triveniData}
              name="Triveni"
              isDarkMode={isDarkMode}
            />
          )}
          {(selectedRegion === "All" || selectedRegion === "Agra") && (
            <RegionColumn
              data={agraData}
              name="Agra"
              isDarkMode={isDarkMode}
            />
          )}
        </main>
      </div>
    </div>
  );
}
