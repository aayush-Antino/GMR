import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  Cell,
} from "recharts";

const QuarterAbsorptionChart = ({
  data,
  variant = "default",
  isDarkMode = false,
  sectionBg,
  accentColor,
}) => {
  const isCompact = variant === "compact";

  // Use explicit accentColor prop if provided, else derive from sectionBg
  const borderColor = isDarkMode
    ? '#334155'
    : accentColor || (sectionBg === '#eef6fd' ? '#5bade0' :
       sectionBg === '#e8f8f6' ? '#38b2ac' :
       sectionBg === '#fbf0ff' ? '#b86fd4' : '#d6d0d0');

  return (
    <div
      style={{
        width: "calc(100% - 2px)",
        height: "calc(100% - 2px)",
        margin: "1px",
        borderRadius: "10px",
        padding: "2px 4px",
        display: "flex",
        flexDirection: "column",
        border: isDarkMode ? "1px solid #334155" : `1.5px solid ${borderColor}`,
        backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        boxSizing: "border-box"
      }}
    >
      <div style={{ paddingLeft: "10px", marginBottom: "2px" }}>
        <h3
          style={{ 
            fontSize: "11px", 
            fontWeight: "700", 
            textTransform: "uppercase", 
            letterSpacing: "0.025em",
            color: isDarkMode ? "#e2e8f0" : "#334155"
          }}
        >
          Inventory vs Installation
        </h3>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 18, right: 5, left: -10, bottom: 2 }}
          barGap={4}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={isDarkMode ? "#334155" : "#e5e7eb"}
          />

          <XAxis
            dataKey="quarter"
            tick={{
              fontSize: 9,
              fontWeight: 600,
              fill: isDarkMode ? "#cbd5e1" : "#080808",
            }}
          />

          <YAxis
            tickFormatter={(v) => `${(v || 0) / 1000}K`}
            tick={{
              fontSize: 9,
              fontWeight: 600,
              fill: isDarkMode ? "#cbd5e1" : "#080808",
            }}
          />

          <Tooltip
            formatter={(v) => `${(v || 0).toLocaleString()}`}
            contentStyle={{
              borderRadius: "6px",
              fontSize: "9px",
              backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
              border: isDarkMode ? "1px solid #334155" : "1px solid #e5e7eb",
              color: isDarkMode ? "#cbd5e1" : "#1e293b",
            }}
          />

          {/* RECEIVED */}
          <Bar
            dataKey="received"
            fill="#3b82f6"
            barSize={20}
            radius={[4, 4, 0, 0]}
            name="Inventory"
          >
            <LabelList
              position="top"
              formatter={(v) => `${((v || 0) / 1000).toFixed(0)}K`}
              fontSize={9}
              fontWeight={600}
              fill={isDarkMode ? "#cbd5e1" : "#1f2937"}
            />
          </Bar>

          {/* INSTALLED */}
          <Bar
            dataKey="installed"
            fill="#10b981"
            barSize={20}
            radius={[4, 4, 0, 0]}
            name="Total Installed"
          >
            <LabelList
              position="top"
              formatter={(v) => `${((v || 0) / 1000).toFixed(0)}K`}
              fontSize={9}
              fontWeight={600}
              fill={isDarkMode ? "#cbd5e1" : "#1f2937"}
            />
          </Bar>

          <Legend
            verticalAlign="top"
            height={20}
            iconType="circle"
            iconSize={6}
            itemSorter={(item) =>
              item.value === "Inventory" ? 0 : 1
            }
            wrapperStyle={{
              fontSize: "10px",
              fontWeight: 500,
              top: -2,
              color: isDarkMode ? "#cbd5e1" : "#1e293b",
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QuarterAbsorptionChart;
  