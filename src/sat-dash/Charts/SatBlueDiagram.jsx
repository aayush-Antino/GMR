import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';

const SatBlueDiagram = ({ data, variant = "default", isDarkMode = false, sectionBg, accentColor }) => {
    const isCompact = variant === "compact";
    const borderColor = isDarkMode ? '#334155' : accentColor || '#d6d0d0';
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const parts = String(dateStr).trim().split("/");
        if (parts.length !== 3) return dateStr;
        return `${parts[1].padStart(2, "0")}/${parts[0].padStart(2, "0")}/${parts[2]}`;
    };
    const transformedData = (data || []).map((item) => ({
        stageLabel: item.startSAT ? `${formatDate(item.startSAT)} (${item.stage})` : item.stage,
        satEligible: item.installedBase,
        satCompleted: item.cumulativeSat,
        completionPct: item.efficiencyPct
    }));

    return (
      <div style={{ width: "calc(100% - 2px)", height: "calc(100% - 2px)", margin: "1px", borderRadius: "10px", padding: "2px 4px", display: "flex", flexDirection: "column", border: isDarkMode ? "1px solid #334155" : `1.5px solid ${borderColor}`, backgroundColor: isDarkMode ? "#1e293b" : "#ffffff" }}>
        <h3 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", paddingLeft: "10px", color: isDarkMode ? "#e2e8f0" : "#334155" }}>SAT Eligibility vs Achievement</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={transformedData} layout="vertical" margin={{ top: 2, right: 20, left: isCompact ? -35 : 40, bottom: 2 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDarkMode ? "#334155" : "#e5e7eb"} />
            <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 9, fontWeight: 600, fill: isDarkMode ? "#cbd5e1" : "#080808" }} />
            <YAxis type="category" dataKey="stageLabel" tick={{ fontSize: 8, fontWeight: 600, fill: isDarkMode ? "#cbd5e1" : "#080808" }} width={isCompact ? 140 : 120} interval={0} />
            <Tooltip contentStyle={{ borderRadius: "6px", fontSize: "9px" }} />
            <Bar dataKey="satEligible" name=" Total Installed" fill="#10b981" barSize={14} radius={[0, 4, 4, 0]}>
              <LabelList position="right" formatter={(v) => `${(v / 1000).toFixed(1)}K`} fontSize={9} fontWeight={600} />
            </Bar>
            <Bar dataKey="satCompleted" name="Cumulative SAT" fill="#f59e0b" barSize={14} radius={[0, 4, 4, 0]}>
              <LabelList dataKey="completionPct" position="insideRight" formatter={(v) => `${v}%`} fontSize={9} fontWeight={600} fill="#ffffff" />
            </Bar>
            <Legend verticalAlign="top" height={20} iconSize={6} wrapperStyle={{ fontSize: "10px" }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
};
export default SatBlueDiagram;
