export const dashboardData = {
    "finance": [
        {
            "name": "Feeder Loss (%)",
            "department": "Finance",
            "description": "Identify feeder-level losses",
            "status": "Stable"
        },
        {
            "name": "DT (Distribution Transformer) Loss (%)",
            "department": "Finance",
            "description": "Identify DT-level losses",
            "status": "Stable"
        },
        {
            "name": "LT Loss (%)",
            "department": "Finance",
            "description": "Estimate LT segment losses",
            "status": "Stable"
        },
        {
            "name": "Billing Efficiency (%)",
            "department": "Finance",
            "description": "Track billing effectiveness",
            "status": "Stable"
        },
        {
            "name": "Collection Efficiency (%)",
            "department": "Finance",
            "description": "Track collections",
            "status": "Stable"
        },
        {
            "name": "AT&C Loss (%)",
            "department": "Finance",
            "description": "Track AT&C losses",
            "status": "Stable"
        },
        {
            "name": "Top X Best/Worst Feeders/DTs",
            "department": "Finance",
            "description": "Prioritize worst assets",
            "status": "Stable"
        },
        {
            "name": "Top High Loss DTs / Feeders",
            "department": "Finance",
            "description": "Target interventions",
            "status": "Stable"
        },
        {
            "name": "Top High-Loss Feeders / DTs",
            "department": "Finance",
            "description": "Executive focus",
            "status": "Stable"
        }
    ],
    "operation_parameters": [
        {
            "name": "SAIDI",
            "department": "Operations",
            "description": "Avg interruption duration",
            "status": "Stable"
        },
        {
            "name": "SAIFI",
            "department": "Operations",
            "description": "Avg interruption frequency",
            "status": "Stable"
        },
        {
            "name": "CAIDI",
            "department": "Operations",
            "description": "Avg duration per interruption",
            "status": "Stable"
        },
        {
            "name": "CAIFI",
            "department": "Operations",
            "description": "Interruptions per affected customer",
            "status": "Stable"
        },
        {
            "name": "MAIFI",
            "department": "Operations",
            "description": "Momentary interruption frequency",
            "status": "Stable"
        },
        {
            "name": "Number of Outages (Frequency)",
            "department": "Operations",
            "description": "Outage count trend",
            "status": "Stable"
        },
        {
            "name": "Duration of Outages (Minutes)",
            "department": "Operations",
            "description": "Outage duration trend",
            "status": "Stable"
        },
        {
            "name": "DT/Feeder Reliability Trends (Monthly/Yearly)",
            "department": "Operations",
            "description": "Reliability trends",
            "status": "Stable"
        },
        {
            "name": "DTs with High Failure Rate",
            "department": "Operations",
            "description": "Asset health",
            "status": "Stable"
        },
        {
            "name": "Detection Accuracy",
            "department": "Operations",
            "description": "Model performance",
            "status": "Stable"
        },
        {
            "name": "False Positive Rate",
            "department": "Operations",
            "description": "Noise control",
            "status": "Stable"
        },
        {
            "name": "Field inspection hit-rate",
            "department": "Operations",
            "description": "Operational usefulness",
            "status": "Stable"
        },
        {
            "name": "MTTI",
            "department": "Operations",
            "description": "Speed to identify",
            "status": "Stable"
        },
        {
            "name": "MTTR",
            "department": "Operations",
            "description": "Speed to restore",
            "status": "Stable"
        },
        {
            "name": "Alert response time",
            "department": "Operations",
            "description": "Response tracking",
            "status": "Stable"
        },
        {
            "name": "Planned outage suppression rate",
            "department": "Operations",
            "description": "Noise reduction",
            "status": "Stable"
        },
        {
            "name": "Low-voltage pockets",
            "department": "Analytics",
            "description": "Voltage quality",
            "status": "Critical",
            "analysisItems": [
                { "label": "Anomaly Types", "value": "11" },
                { "label": "Parameters", "value": "Voltage, Vrn, Voltage, Vyn, Voltage, Vbn" },
                { "label": "Config", "value": "+GIS optional" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Voltage < (230*0.9) for >30 mins AND \ncount(Account ID) > 5 in DTR",
            "chartData": {
                "trendTitle": "Low Voltage Events (Last 7 Days)",
                "trend": [
                    { "name": "Mon", "value": 45 },
                    { "name": "Tue", "value": 52 },
                    { "name": "Wed", "value": 38 },
                    { "name": "Thu", "value": 65 },
                    { "name": "Fri", "value": 42 },
                    { "name": "Sat", "value": 30 },
                    { "name": "Sun", "value": 25 }
                ],
                "distTitle": "Voltage Band Distribution",
                "distribution": [
                    { "name": "<200V", "value": 15 },
                    { "name": "200-210V", "value": 35 },
                    { "name": "210-230V", "value": 120 },
                    { "name": ">240V", "value": 10 }
                ]
            }
        },
        {
            "name": "Feeders with Maximum Outages",
            "department": "Operations",
            "description": "Reliability focus",
            "status": "Stable"
        },
        {
            "name": "Reliability Improvement Trend",
            "department": "Operations",
            "description": "Improvement tracking",
            "status": "Stable"
        },
        {
            "name": "Consumer Service Reliability Score",
            "department": "Operations",
            "description": "Composite KPI",
            "status": "Stable"
        },
        {
            "name": "Composite Reliability Score",
            "department": "Operations",
            "description": "Composite KPI",
            "status": "Stable"
        },
        {
            "name": "Composite Efficiency Score",
            "department": "Operations",
            "description": "Composite KPI",
            "status": "Stable"
        }
    ],
    "load_management": [
        {
            "name": "% DT Peak Loading",
            "department": "Technical",
            "description": "Overload risk",
            "status": "Stable"
        },
        {
            "name": "% DT Loading",
            "department": "Technical",
            "description": "Loading level",
            "status": "Stable"
        },
        {
            "name": "DT Load (kVA)",
            "department": "Technical",
            "description": "DT load monitoring",
            "status": "Stable"
        },
        {
            "name": "% Loading Bands",
            "department": "Technical",
            "description": "Classify assets",
            "status": "Stable"
        },
        {
            "name": "Top Overloaded DTs / Feeders",
            "department": "Technical",
            "description": "Prioritize overloads",
            "status": "Stable"
        },
        {
            "name": "Load Rise Trend",
            "department": "Technical",
            "description": "Growth hotspots",
            "status": "Stable"
        },
        {
            "name": "Consumers exceeding sanctioned load",
            "department": "Technical",
            "description": "Contract violation",
            "status": "Stable"
        },
        {
            "name": "% Consumers with Load Violation",
            "department": "Technical",
            "description": "Violation prevalence",
            "status": "Stable"
        },
        {
            "name": "Load Duration Curve & Asset Loading Spread",
            "department": "Technical",
            "description": "Load distribution",
            "status": "Stable"
        },
        {
            "name": "DT Failure Rate (%)",
            "department": "Technical",
            "description": "Asset reliability",
            "status": "Stable"
        },
        {
            "name": "Top Overloaded Assets",
            "department": "Technical",
            "description": "Augmentation priorities",
            "status": "Stable"
        },
        {
            "name": "Top Power Quality Issues",
            "department": "Technical",
            "description": "PQ focus",
            "status": "Stable"
        }
    ],
    "power_quality": [
        {
            "name": "Voltage Deviation (%)",
            "department": "Operations",
            "description": "Voltage quality",
            "status": "Critical",
            "analysisItems": [
                { "label": "Key IDs", "value": "Voltage" },
                { "label": "Config", "value": "Utility config: Vnom & bands" },
                { "label": "Refs", "value": "Vnom + tolerance bands" },
                { "label": "Note", "value": "Nominal: 1ph:240, 3ph:440, HT:11KV" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "(Measured Voltage− Nominal Voltage)/Nominal Voltage ×100",
            "chartData": {
                "trendTitle": "Average Deviation Trend (Last 7 Days)",
                "trend": [
                    { "name": "Mon", "value": 2.5 },
                    { "name": "Tue", "value": 3.1 },
                    { "name": "Wed", "value": 1.8 },
                    { "name": "Thu", "value": 4.2 },
                    { "name": "Fri", "value": 3.5 },
                    { "name": "Sat", "value": 1.5 },
                    { "name": "Sun", "value": 1.2 }
                ],
                "distTitle": "Deviation Histogram",
                "distribution": [
                    { "name": "< 2%", "value": 60, "color": "#10B981" },
                    { "name": "2-5%", "value": 30, "color": "#F59E0B" },
                    { "name": "> 5%", "value": 10, "color": "#EF4444" }
                ]
            }
        },
        {
            "name": "Voltage Deviation Index (VDI)",
            "department": "Operations",
            "description": "Composite voltage metric",
            "status": "Critical",
            "analysisItems": [
                { "label": "Group", "value": "Power Quality" },
                { "label": "Key IDs", "value": "Voltage time-series" },
                { "label": "Config", "value": "VDI definition" },
                { "label": "Calculation", "value": "Aggregate |deviation| over time" },
                { "label": "Note", "value": "Define VDI method + bands" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Metric representing aggregate voltage deviation over time (mean/p95).",
            "chartData": {
                "trendTitle": "VDI Trend (Last 24 Hours)",
                "trend": [
                    { "name": "00:00", "value": 0.8 },
                    { "name": "04:00", "value": 1.2 },
                    { "name": "08:00", "value": 2.5 },
                    { "name": "12:00", "value": 3.1 },
                    { "name": "16:00", "value": 2.8 },
                    { "name": "20:00", "value": 1.5 }
                ],
                "distTitle": "VDI Severity Distribution",
                "distribution": [
                    { "name": "Low", "value": 50, "color": "#10B981" },
                    { "name": "Medium", "value": 35, "color": "#F59E0B" },
                    { "name": "High", "value": 15, "color": "#EF4444" }
                ]
            }
        },
        {
            "name": "Frequency Deviation Index (FDI)",
            "department": "Operations",
            "description": "Frequency quality",
            "status": "Stable"
        },
        {
            "name": "Voltage Fluctuation Index",
            "department": "Operations",
            "description": "Voltage stability",
            "status": "Stable"
        },
        {
            "name": "Voltage Unbalance Index",
            "department": "Operations",
            "description": "Phase voltage imbalance",
            "status": "Stable"
        },
        {
            "name": "Voltage Drop (V)",
            "department": "Operations",
            "description": "Low voltage magnitude",
            "status": "Warning",
            "analysisItems": [
                { "label": "Key IDs", "value": "Voltage" },
                { "label": "Refs", "value": "Vnom" },
                { "label": "Config", "value": "Provide Vnom" },
                { "label": "Note", "value": "Nominal: 1ph:240, 3ph:440, HT:11KV" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "MAX(0, (230*0.9) - MIN(Voltage,Vrn, Voltage,Vyn, Voltage,Vbn))",
            "chartData": {
                "trendTitle": "Max Voltage Drop Trend (Last 7 Days)",
                "trend": [
                    { "name": "Mon", "value": 12 },
                    { "name": "Tue", "value": 15 },
                    { "name": "Wed", "value": 10 },
                    { "name": "Thu", "value": 18 },
                    { "name": "Fri", "value": 14 },
                    { "name": "Sat", "value": 8 },
                    { "name": "Sun", "value": 6 }
                ],
                "distTitle": "Worst Affected Feeders",
                "distribution": [
                    { "name": "Feeder A", "value": 25, "color": "#EF4444" },
                    { "name": "Feeder B", "value": 20, "color": "#F59E0B" },
                    { "name": "Feeder C", "value": 15, "color": "#3B82F6" }
                ]
            }
        },
        {
            "name": "Low Power Factor (%) by DT/Feeder",
            "department": "Operations",
            "description": "Low PF pockets",
            "status": "Critical",
            "analysisItems": [
                { "label": "Group", "value": "Power Quality" },
                { "label": "Anomaly Types", "value": "KPI" },
                { "label": "Calculation", "value": "(Blocks with PF < threshold / Total Blocks) * 100" },
                { "label": "Data Source", "value": "kVAh import (partial)" },
                { "label": "Config", "value": "Provide PF/kW/kvar + topology" },
                { "label": "Note", "value": "We need the threshold value" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Percentage of blocks where Power Factor is below the defined threshold.",
            "chartData": {
                "trendTitle": "Low PF % Trend (Last 7 Days)",
                "trend": [
                    { "name": "Mon", "value": 15 },
                    { "name": "Tue", "value": 18 },
                    { "name": "Wed", "value": 12 },
                    { "name": "Thu", "value": 25 },
                    { "name": "Fri", "value": 20 },
                    { "name": "Sat", "value": 10 },
                    { "name": "Sun", "value": 8 }
                ],
                "distTitle": "Affected Feeders/DTs",
                "distribution": [
                    { "name": "Feeder X", "value": 40, "color": "#EF4444" },
                    { "name": "Feeder Y", "value": 35, "color": "#F59E0B" },
                    { "name": "Feeder Z", "value": 25, "color": "#3B82F6" }
                ]
            }
        },
        {
            "name": "Meter Current Unbalance (%)",
            "department": "Operations",
            "description": "Phase current imbalance",
            "status": "Stable"
        },
        {
            "name": "% Time beyond voltage tolerance band",
            "department": "Operations",
            "description": "Compliance",
            "status": "Critical",
            "analysisItems": [
                { "label": "Key IDs", "value": "Voltage + timestamps" },
                { "label": "Config", "value": "Define voltage bands" },
                { "label": "Refs", "value": "Voltage band config" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "(Time Voltage Outside Limits / Total Time) × 100",
            "chartData": {
                "trendTitle": "Non-Compliance Trend (%)",
                "trend": [
                    { "name": "Mon", "value": 5 },
                    { "name": "Tue", "value": 8 },
                    { "name": "Wed", "value": 4 },
                    { "name": "Thu", "value": 12 },
                    { "name": "Fri", "value": 9 },
                    { "name": "Sat", "value": 3 },
                    { "name": "Sun", "value": 2 }
                ],
                "distTitle": "Duration of Excursions (Mins)",
                "distribution": [
                    { "name": "< 15m", "value": 50, "color": "#F59E0B" },
                    { "name": "15-60m", "value": 30, "color": "#EF4444" },
                    { "name": "> 60m", "value": 20, "color": "#7C3AED" }
                ]
            }
        },
        {
            "name": "% Time with unacceptable current imbalance (>10%)",
            "department": "Operations",
            "description": "Compliance (I unbalance)",
            "status": "Stable"
        }
    ],
    "to_be_on_hold": [
        {
            "name": "Total anomalies detected (by time period)",
            "department": "Analytics",
            "description": "Volume tracking",
            "status": "Ready",
            "analysisItems": [
                { "label": "Key IDs", "value": "Anomaly flags" },
                { "label": "Source", "value": "Scoring pipeline output" },
                { "label": "Pipeline", "value": "ML scoring output" },
                { "label": "Priority", "value": "P1" },
                { "label": "Note", "value": "Event profile needed" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Count anomalies grouped by day/week/month",
            "chartData": {
                "trendTitle": "Total Anomalies (Last 30 Days)",
                "trend": [
                    { "name": "Week 1", "value": 350 },
                    { "name": "Week 2", "value": 420 },
                    { "name": "Week 3", "value": 310 },
                    { "name": "Week 4", "value": 380 }
                ],
                "distTitle": "Anomalies by Region",
                "distribution": [
                    { "name": "North", "value": 45, "color": "#EF4444" },
                    { "name": "South", "value": 30, "color": "#F59E0B" },
                    { "name": "East", "value": 25, "color": "#3B82F6" }
                ]
            }
        },
        {
            "name": "Anomalies by severity",
            "department": "Analytics",
            "description": "Severity mix",
            "status": "Ready",
            "analysisItems": [
                { "label": "Source", "value": "Scoring output" },
                { "label": "Key IDs", "value": "Anomaly flags + severity" },
                { "label": "Config", "value": "Severity mapping" },
                { "label": "Note", "value": "Event profile needed" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Count of anomalies grouped by severity level (Critical, Major, Minor).",
            "chartData": {
                "trendTitle": "Severity Trend (Last 7 Days)",
                "trend": [
                    { "name": "Mon", "critical": 5, "major": 12, "minor": 20 },
                    { "name": "Tue", "critical": 8, "major": 15, "minor": 18 },
                    { "name": "Wed", "critical": 4, "major": 10, "minor": 22 },
                    { "name": "Thu", "critical": 6, "major": 14, "minor": 25 },
                    { "name": "Fri", "critical": 9, "major": 11, "minor": 19 },
                    { "name": "Sat", "critical": 3, "major": 8, "minor": 15 },
                    { "name": "Sun", "critical": 2, "major": 5, "minor": 10 }
                ],
                "distTitle": "Current Severity Mix",
                "distribution": [
                    { "name": "Critical", "value": 15, "color": "#EF4444" },
                    { "name": "Major", "value": 35, "color": "#F59E0B" },
                    { "name": "Minor", "value": 50, "color": "#3B82F6" }
                ]
            }
        },
        {
            "name": "Anomaly trends (daily/weekly/monthly)",
            "department": "Analytics",
            "description": "Trends",
            "status": "Ready",
            "analysisItems": [
                { "label": "Source", "value": "Scoring output" },
                { "label": "Key IDs", "value": "Anomaly history" },
                { "label": "Config", "value": "None" },
                { "label": "Note", "value": "Event profile needed" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Time-series count of total anomalies detected per day/week/month.",
            "chartData": {
                "trendTitle": "Daily Anomaly Count (Last 30 Days)",
                "trend": [
                    { "name": "Week 1", "value": 145 },
                    { "name": "Week 2", "value": 132 },
                    { "name": "Week 3", "value": 158 },
                    { "name": "Week 4", "value": 120 }
                ],
                "distTitle": "Monthly Volume Comparison",
                "distribution": [
                    { "name": "Last Month", "value": 600, "color": "#94A3B8" },
                    { "name": "This Month", "value": 555, "color": "#3B82F6" }
                ]
            }
        },
        {
            "name": "Repeat anomaly tracking",
            "department": "Analytics",
            "description": "Repeat offenders",
            "status": "Ready",
            "analysisItems": [
                { "label": "Source", "value": "Scoring output" },
                { "label": "Key IDs", "value": "Meter ID + anomaly history" },
                { "label": "Config", "value": "None" },
                { "label": "Note", "value": "Event profile needed" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Identification of meters with >X anomalies within Y days (Repeat Offenders).",
            "chartData": {
                "trendTitle": "Repeat Offenders Count",
                "trend": [
                    { "name": "Mon", "value": 12 },
                    { "name": "Tue", "value": 15 },
                    { "name": "Wed", "value": 10 },
                    { "name": "Thu", "value": 18 },
                    { "name": "Fri", "value": 14 },
                    { "name": "Sat", "value": 8 },
                    { "name": "Sun", "value": 6 }
                ],
                "distTitle": "Top 5 Repeat Offender Meters",
                "distribution": [
                    { "name": "M-1023", "value": 25, "color": "#EF4444" },
                    { "name": "M-4512", "value": 22, "color": "#F59E0B" },
                    { "name": "M-7890", "value": 19, "color": "#F59E0B" },
                    { "name": "M-3321", "value": 15, "color": "#3B82F6" },
                    { "name": "M-5544", "value": 12, "color": "#3B82F6" }
                ]
            }
        },
        {
            "name": "Anomalies by type",
            "department": "Analytics",
            "description": "Distribution",
            "status": "Ready",
            "analysisItems": [
                { "label": "Key IDs", "value": "Anomaly flags + type" },
                { "label": "Config", "value": "None" },
                { "label": "Source", "value": "Scoring output" },
                { "label": "Priority", "value": "P1" },
                { "label": "Note", "value": "Event profile needed" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Count by anomaly_type",
            "chartData": {
                "trendTitle": "Anomaly Type Trend (Last 7 Days)",
                "trend": [
                    { "name": "Mon", "value": 150 },
                    { "name": "Tue", "value": 180 },
                    { "name": "Wed", "value": 120 },
                    { "name": "Thu", "value": 250 },
                    { "name": "Fri", "value": 190 },
                    { "name": "Sat", "value": 110 },
                    { "name": "Sun", "value": 90 }
                ],
                "distTitle": "Distribution by Type",
                "distribution": [
                    { "name": "Tamper", "value": 45, "color": "#EF4444" },
                    { "name": "Bypass", "value": 30, "color": "#F59E0B" },
                    { "name": "Defective", "value": 25, "color": "#3B82F6" }
                ]
            }
        }
    ],
    "theft_analysis": [
        {
            "name": "Theft Suspect Flags",
            "department": "Analytics",
            "description": "Prioritize suspected theft",
            "status": "Stable"
        },
        {
            "name": "% Reduction in Theft Events (monthly trend)",
            "department": "Analytics",
            "description": "Measure enforcement impact",
            "status": "Stable"
        },
        {
            "name": "Theft / Load diversion",
            "department": "Analytics",
            "description": "Revenue protection",
            "status": "Critical"
        },
        {
            "name": "Areas with Highest Theft Risk",
            "department": "Analytics",
            "description": "Revenue focus",
            "status": "Stable"
        },
// Moved to theft_analysis
    ],
    "to_be_on_hold_extra": [
        {
            "name": "Communication health issues",
            "department": "Analytics",
            "description": "Comms monitoring",
            "status": "Critical",
            "analysisItems": [
                { "label": "Anomaly Types", "value": "11" },
                { "label": "Signal Details", "value": "Signal strength; timestamps" },
                { "label": "Config", "value": "Comms tech metadata optional" },
                { "label": "Tech Attribute", "value": "Optional comms tech attribute" }
            ],
            "qualityDescription": "Packet loss %, non-reporting, low signal",
            "chartData": {
                "trendTitle": "Packet Loss Events (Last 7 Days)",
                "trend": [
                    { "name": "Mon", "value": 12 },
                    { "name": "Tue", "value": 15 },
                    { "name": "Wed", "value": 8 },
                    { "name": "Thu", "value": 22 },
                    { "name": "Fri", "value": 18 },
                    { "name": "Sat", "value": 9 },
                    { "name": "Sun", "value": 7 }
                ],
                "distTitle": "Signal Strength Distribution",
                "distribution": [
                    { "name": "Good (> -70dBm)", "value": 65, "color": "#10B981" },
                    { "name": "Fair (<= -70dBm)", "value": 25, "color": "#F59E0B" },
                    { "name": "Poor (<= -90dBm)", "value": 10, "color": "#EF4444" }
                ]
            }
        },
        {
            "name": "Signal strength statistics",
            "department": "Technical",
            "description": "Network quality",
            "status": "Warning",
            "analysisItems": [
                { "label": "Key IDs", "value": "Signal strength" },
                { "label": "Source", "value": "HES/MDM" },
                { "label": "Config", "value": "None" },
                { "label": "Ref", "value": "AVG/MIN/MAX/STD of TSP1/TSP2" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Mean: AVG(TSP1, TSP2); Min / Max: MIN, MAX; Std Dev: STD(TSP1, TSP2)",
            "chartData": {
                "trendTitle": "Signal Stats Trend (Last 7 Days) (dBm)",
                "trend": [
                    { "name": "Mon", "min": -85, "avg": -72, "max": -60 },
                    { "name": "Tue", "min": -88, "avg": -74, "max": -62 },
                    { "name": "Wed", "min": -82, "avg": -70, "max": -58 },
                    { "name": "Thu", "min": -90, "avg": -75, "max": -65 },
                    { "name": "Fri", "min": -84, "avg": -71, "max": -59 },
                    { "name": "Sat", "min": -80, "avg": -68, "max": -55 },
                    { "name": "Sun", "min": -78, "avg": -66, "max": -52 }
                ],
                "distTitle": "Signal Stability Distribution",
                "distribution": [
                    { "name": "Stable (< 3dB Var)", "value": 70, "color": "#10B981" },
                    { "name": "Unstable (> 3dB Var)", "value": 30, "color": "#F59E0B" }
                ]
            }
        },
        {
            "name": "Packet loss percentage",
            "department": "Technical",
            "description": "Comms reliability",
            "status": "Ready",
            "analysisItems": [
                { "label": "Key IDs", "value": "Timestamps" },
                { "label": "Config", "value": "Interval definition" },
                { "label": "Priority", "value": "P1" },
                { "label": "Note", "value": "Confirm block interval" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "(Expected blocks \u2212 received) / expected \u00d7 100",
            "chartData": {
                "trendTitle": "Packet Loss % Trend (Last 7 Days)",
                "trend": [
                    { "name": "Mon", "value": 2.5 },
                    { "name": "Tue", "value": 3.1 },
                    { "name": "Wed", "value": 1.8 },
                    { "name": "Thu", "value": 4.2 },
                    { "name": "Fri", "value": 3.5 },
                    { "name": "Sat", "value": 1.5 },
                    { "name": "Sun", "value": 1.2 }
                ],
                "distTitle": "Severity Distribution",
                "distribution": [
                    { "name": "< 2%", "value": 60, "color": "#10B981" },
                    { "name": "2-5%", "value": 30, "color": "#F59E0B" },
                    { "name": "> 5%", "value": 10, "color": "#EF4444" }
                ]
            }
        },
        {
            "name": "Communication retry counts",
            "department": "Technical",
            "description": "Troubleshooting",
            "status": "Stable"
        },
        {
            "name": "Non-reporting meters (>24 hours)",
            "department": "Technical",
            "description": "Dead meters",
            "status": "Critical",
            "analysisItems": [
                { "label": "Key IDs", "value": "Timestamps" },
                { "label": "Source", "value": "HES/MDM" },
                { "label": "Note", "value": "MDM date & form buckets" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Meter is non-reporting if: Current_Time − MDM Date > 24 hr, 48 hr",
            "chartData": {
                "trendTitle": "Non-Reporting Trend (Count)",
                "trend": [
                    { "name": "Mon", "value": 45 },
                    { "name": "Tue", "value": 50 },
                    { "name": "Wed", "value": 42 },
                    { "name": "Thu", "value": 55 },
                    { "name": "Fri", "value": 48 },
                    { "name": "Sat", "value": 40 },
                    { "name": "Sun", "value": 35 }
                ],
                "distTitle": "Aging Buckets",
                "distribution": [
                    { "name": "24-48h", "value": 50, "color": "#F59E0B" },
                    { "name": "48-72h", "value": 30, "color": "#EF4444" },
                    { "name": "> 72h", "value": 20, "color": "#7F1D1D" }
                ]
            }
        },
        {
            "name": "Communication technology performance (RF/GPRS/PLC)",
            "department": "Technical",
            "description": "Compare comms modes",
            "status": "Warning",
            "analysisItems": [
                { "label": "Key IDs", "value": "None" },
                { "label": "Source", "value": "Asset registry/HES attribute" },
                { "label": "Config", "value": "Comms tech attribute per meter" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Compare comms modes (RF/GPRS/PLC)\nHistogram of (TSP1 (dBm), TSP2 (dBm))",
            "chartData": {
                "trendTitle": "Avg Signal by Tech (dBm)",
                "trend": [
                    { "name": "RF", "value": -72 },
                    { "name": "GPRS", "value": -65 },
                    { "name": "PLC", "value": -80 }
                ],
                "distTitle": "Tech Distribution Mix",
                "distribution": [
                    { "name": "RF", "value": 60, "color": "#3B82F6" },
                    { "name": "GPRS", "value": 30, "color": "#10B981" },
                    { "name": "PLC", "value": 10, "color": "#F59E0B" }
                ]
            }
        }
    ],
    "advanced_analytics": [
        {
            "name": "Auto-indexing consumers and DTRs for correct mapping",
            "department": "Advanced Analytics",
            "description": "Correct T&D loss calculations",
            "status": "Stable"
        },
        {
            "name": "Track updated tag of DTs to Feeders",
            "department": "Advanced Analytics",
            "description": "Correct hierarchy over time",
            "status": "Stable"
        },
        {
            "name": "Track updated tag of consumers to DTs",
            "department": "Advanced Analytics",
            "description": "Correct consumer grouping",
            "status": "Stable"
        },
        {
            "name": "Re-index consumer/DTR data for correct past-period T&D loss",
            "department": "Advanced Analytics",
            "description": "Historical accuracy",
            "status": "Stable"
        },
        {
            "name": "Mapping Accuracy (95%)",
            "department": "Advanced Analytics",
            "description": "Mapping quality",
            "status": "Stable"
        },
        {
            "name": "DT-to-meter mapping accuracy",
            "department": "Advanced Analytics",
            "description": "DT grouping accuracy",
            "status": "Stable"
        },
        {
            "name": "% meters pending field verification (<5%)",
            "department": "Advanced Analytics",
            "description": "Backlog control",
            "status": "Stable"
        },
        {
            "name": "Confidence scoring (High/Medium/Low)",
            "department": "Advanced Analytics",
            "description": "Communicate certainty",
            "status": "Stable"
        },
        {
            "name": "Total assets tracked (Meters/Feeders/DTs)",
            "department": "Advanced Analytics",
            "description": "Inventory visibility",
            "status": "Stable",
            "analysisItems": [
                { "label": "Key IDs", "value": "Meter IDs only" },
                { "label": "Source", "value": "Data Mapping System" },
                { "label": "Registry", "value": "Asset registry" },
                { "label": "Master", "value": "Asset master registry" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Meters: COUNT(DISTINCT newMeterNumber)\nFeeders: COUNT(DISTINCT FeederCode)\nDTs: COUNT(DISTINCT DTRCode)",
            "chartData": {
                "trendTitle": "Asset Growth Trend (Last 6 Months)",
                "trend": [
                    { "name": "Aug", "value": 12000 },
                    { "name": "Sep", "value": 12500 },
                    { "name": "Oct", "value": 13200 },
                    { "name": "Nov", "value": 14000 },
                    { "name": "Dec", "value": 14800 },
                    { "name": "Jan", "value": 15500 }
                ],
                "distTitle": "Current Asset Breakdown",
                "distribution": [
                    { "name": "Meters", "value": 15500, "color": "#3B82F6" },
                    { "name": "DTs", "value": 450, "color": "#10B981" },
                    { "name": "Feeders", "value": 85, "color": "#F59E0B" }
                ]
            }
        },
        {
            "name": "Overloaded DTs identified and monitored",
            "department": "Advanced Analytics",
            "description": "Asset risk",
            "status": "Stable"
        },
        {
            "name": "Mismatch analysis (Feeder?DT, DT?Meter)",
            "department": "Advanced Analytics",
            "description": "Detect mapping errors",
            "status": "Stable"
        },
        {
            "name": "Correctly mapped meters (%)",
            "department": "Advanced Analytics",
            "description": "Completion",
            "status": "Stable"
        },
        {
            "name": "Incorrectly mapped meters requiring correction (%)",
            "department": "Advanced Analytics",
            "description": "Reduce errors",
            "status": "Stable"
        },
        {
            "name": "Verification pending count",
            "department": "Advanced Analytics",
            "description": "Track work",
            "status": "Warning",
            "analysisItems": [
                { "label": "Source", "value": "Field workflow data" },
                { "label": "System", "value": "Field app/work order system" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "COUNT(*) WHERE \nQC1Status != 'Approved' OR \nQC2Status != 'Approved' OR \nQC3Status != 'Approved'",
            "chartData": {
                "trendTitle": "Pending Requests Trend (Last 7 Days)",
                "trend": [
                    { "name": "Mon", "value": 15 },
                    { "name": "Tue", "value": 18 },
                    { "name": "Wed", "value": 12 },
                    { "name": "Thu", "value": 25 },
                    { "name": "Fri", "value": 22 },
                    { "name": "Sat", "value": 10 },
                    { "name": "Sun", "value": 8 }
                ],
                "distTitle": "Pending by Stage",
                "distribution": [
                    { "name": "QC1", "value": 45, "color": "#F59E0B" },
                    { "name": "QC2", "value": 20, "color": "#10B981" },
                    { "name": "QC3", "value": 12, "color": "#3B82F6" }
                ]
            }
        },
        {
            "name": "Correction cycle time (avg days)",
            "department": "Advanced Analytics",
            "description": "Speed improvements",
            "status": "Stable",
            "analysisItems": [
                { "label": "Source", "value": "Ticketing/work order system" },
                { "label": "Key IDs", "value": "Ticket timestamps" },
                { "label": "Priority", "value": "P2" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Cycle Time = Final_QC_Date − installationDate\nAvg Cycle Time: MEAN(Cycle Time)",
            "chartData": {
                "trendTitle": "Avg Cycle Time Trend (Last 6 Months)",
                "trend": [
                    { "name": "Aug", "value": 12 },
                    { "name": "Sep", "value": 10 },
                    { "name": "Oct", "value": 9 },
                    { "name": "Nov", "value": 7 },
                    { "name": "Dec", "value": 5 },
                    { "name": "Jan", "value": 4 }
                ],
                "distTitle": "Cycle Time Distribution",
                "distribution": [
                    { "name": "< 2 Days", "value": 60, "color": "#10B981" },
                    { "name": "2-5 Days", "value": 30, "color": "#F59E0B" },
                    { "name": "> 5 Days", "value": 10, "color": "#EF4444" }
                ]
            }
        },
        {
            "name": "Transformer utilization rate (% of rated capacity)",
            "department": "Advanced Analytics",
            "description": "Utilization",
            "status": "Stable"
        },
        {
            "name": "Field verification completion rate",
            "department": "Advanced Analytics",
            "description": "Throughput",
            "status": "Stable"
        }
    ],
    "operation_analytics": [
        {
            "name": "Tamper sequence detection",
            "department": "Analytics",
            "description": "Tamper detection",
            "status": "Critical"
        },
        {
            "name": "Voltage/Current imbalance",
            "department": "Analytics",
            "description": "Phase imbalance",
            "status": "Critical"
        },
        {
            "name": "Power factor deterioration",
            "department": "Analytics",
            "description": "Efficiency",
            "status": "Warning",
            "analysisItems": [
                { "label": "Anomaly Types", "value": "11" },
                { "label": "Registers", "value": "PF/kW/kvar" },
                { "label": "Condition", "value": "PF < 0.85 sustained" },
                { "label": "Data Source", "value": "kVAh only (partial)" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "PF = kWh ÷ kVAh\nFlag if Power Factor < 0.85 for sustained period.",
            "chartData": {
                "trendTitle": "Low PF Events (Last 7 Days)",
                "trend": [
                    { "name": "Mon", "value": 12 },
                    { "name": "Tue", "value": 15 },
                    { "name": "Wed", "value": 10 },
                    { "name": "Thu", "value": 22 },
                    { "name": "Fri", "value": 18 },
                    { "name": "Sat", "value": 9 },
                    { "name": "Sun", "value": 7 }
                ],
                "distTitle": "PF Range Distribution",
                "distribution": [
                    { "name": "< 0.85", "value": 15, "color": "#EF4444" },
                    { "name": "0.85-0.95", "value": 35, "color": "#F59E0B" },
                    { "name": "> 0.95", "value": 50, "color": "#10B981" }
                ]
            }
        },
        {
            "name": "Overload / MD breach risk",
            "department": "Analytics",
            "description": "Asset risk",
            "status": "Critical"
        },
        {
            "name": "Hidden outage pockets",
            "department": "Analytics",
            "description": "Outage detection",
            "status": "Critical"
        },
        {
            "name": "Data quality issues",
            "department": "Analytics",
            "description": "Data SLA",
            "status": "Warning",
            "analysisItems": [
                { "label": "Source", "value": "Load Duration Curve" },
                { "label": "Config", "value": "Interval definition" },
                { "label": "Anomaly", "value": "Anomaly Types (11)" },
                { "label": "SLA", "value": "Data SLA" },
                { "label": "Note", "value": "Confirm block interval & expected blocks" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Flatline>6h; missing blocks; timestamp drift",
            "chartData": {
                "trendTitle": "Data Quality Incidents (Last 7 Days)",
                "trend": [
                    { "name": "Mon", "value": 12 },
                    { "name": "Tue", "value": 15 },
                    { "name": "Wed", "value": 8 },
                    { "name": "Thu", "value": 22 },
                    { "name": "Fri", "value": 18 },
                    { "name": "Sat", "value": 9 },
                    { "name": "Sun", "value": 7 }
                ],
                "distTitle": "Issue Type Breakdown",
                "distribution": [
                    { "name": "Missing Blocks", "value": 45, "color": "#EF4444" },
                    { "name": "Flatline", "value": 30, "color": "#F59E0B" },
                    { "name": "Drift", "value": 25, "color": "#3B82F6" }
                ]
            }
        },
        {
            "name": "Reverse flow",
            "department": "Analytics",
            "description": "Unauthorized export",
            "status": "Critical"
        },
        {
            "name": "Consumption spikes/drops",
            "department": "Analytics",
            "description": "Anomaly detection",
            "status": "Warning",
            "analysisItems": [
                { "label": "Source", "value": "Historical kWh" },
                { "label": "Config", "value": "Optional peer grouping" },
                { "label": "Anomaly", "value": "Anomaly Types (11)" },
                { "label": "Context", "value": "Peer baselines optional" },
                { "label": "Note", "value": "Baseline=Avg. of theft, event profile needed" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Spike/drop >5σ from baseline",
            "chartData": {
                "trendTitle": "Discrepancy Volume (Last 7 Days)",
                "trend": [
                    { "name": "Mon", "value": 15 },
                    { "name": "Tue", "value": 8 },
                    { "name": "Wed", "value": 25 },
                    { "name": "Thu", "value": 12 },
                    { "name": "Fri", "value": 30 },
                    { "name": "Sat", "value": 10 },
                    { "name": "Sun", "value": 5 }
                ],
                "distTitle": "Anomaly Severity Distribution",
                "distribution": [
                    { "name": "> 5σ", "value": 20, "color": "#EF4444" },
                    { "name": "> 3σ", "value": 80, "color": "#F59E0B" }
                ]
            }
        },
        {
            "name": "Phase-level mapping accuracy",
            "department": "Analytics",
            "description": "Phase allocation correctness",
            "status": "Stable"
        },
        {
            "name": "Phase imbalance reduced by minimum 30%",
            "department": "Analytics",
            "description": "Reduce imbalance",
            "status": "Stable"
        },
        {
            "name": "Real-time phase load monitoring per transformer",
            "department": "Analytics",
            "description": "Operational monitoring",
            "status": "Stable",
            "analysisItems": [
                { "label": "Anomaly Types", "value": "KPI/Anomaly" },
                { "label": "Group", "value": "Phase Management" },
                { "label": "Calculation", "value": "kVA = V x I / 1000" },
                { "label": "Data Source", "value": "Topology + per-phase V/I" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Phase kVA = Vphase × Iphase ÷ 1000\nReal-time monitoring of R, Y, B phase loads.",
            "chartData": {
                "trendTitle": "Phase Load Trend (Last 24 Hours) (kVA)",
                "trend": [
                    { "name": "00:00", "R-Phase": 45, "Y-Phase": 42, "B-Phase": 48 },
                    { "name": "04:00", "R-Phase": 40, "Y-Phase": 38, "B-Phase": 44 },
                    { "name": "08:00", "R-Phase": 65, "Y-Phase": 60, "B-Phase": 68 },
                    { "name": "12:00", "R-Phase": 85, "Y-Phase": 82, "B-Phase": 88 },
                    { "name": "16:00", "R-Phase": 75, "Y-Phase": 78, "B-Phase": 72 },
                    { "name": "20:00", "R-Phase": 90, "Y-Phase": 85, "B-Phase": 92 }
                ],
                "distTitle": "Average Load Balance",
                "distribution": [
                    { "name": "R-Phase", "value": 34, "color": "#EF4444" },
                    { "name": "Y-Phase", "value": 32, "color": "#F59E0B" },
                    { "name": "B-Phase", "value": 34, "color": "#3B82F6" }
                ]
            }
        },
        {
            "name": "Imbalance alerts when threshold exceeded",
            "department": "Analytics",
            "description": "Alerting",
            "status": "Critical"
        },
        {
            "name": "Phase transfer recommendations (what-if)",
            "department": "Analytics",
            "description": "Operational planning",
            "status": "Stable"
        }
    ],
    "dashboard10": [
        {
            "name": "MI-Progress (Total & Category wise)",
            "module": "Meter-Installation",
            "department": "Business",
            "description": "Meter Installation progress tracking.",
            "status": "Stable",
            "analysisItems": [
                { "label": "Formula", "value": "COUNT(newMeterNumber)" },
                { "label": "Frequency", "value": "Daily / Weekly / Monthly" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Total count of new meter numbers installed, segmented by category (Domestic, Commercial, Industrial).",
            "chartData": {
                "trendTitle": "MI Progress Trend",
                "trend": [
                    { "name": "Jan", "count": 4500 }, { "name": "Feb", "count": 5200 }, { "name": "Mar", "count": 6100 }
                ],
                "distTitle": "MI By Category (Funnel)",
                "distribution": [
                    { "name": "Target", "count": 10000 },
                    { "name": "Surveyed", "count": 8500 },
                    { "name": "Installed", "count": 6100 },
                    { "name": "SAT Done", "count": 5800 }
                ],
                "allowedTrendTypes": ["line", "area", "bar"],
                "allowedDistTypes": ["funnel", "bar", "donut"]
            }
        },
        {
            "name": "MI-Productivity per team (Total & Category wise)",
            "module": "Meter-Installation",
            "department": "Business",
            "description": "Output per installation team.",
            "status": "On Track",
            "analysisItems": [
                { "label": "Formula", "value": "COUNT(*) GROUP BY Technician, Date" },
                { "label": "Frequency", "value": "Daily / Weekly / Monthly" }
            ],
            "qualityDescription": "Average installations completed per technician or agency team per active working day.",
            "chartData": {
                "trendTitle": "Daily Performance",
                "trend": [
                    { "name": "Mon", "value": 8 }, { "name": "Tue", "value": 12 }, { "name": "Wed", "value": 10 }
                ],
                "distTitle": "Team Comparison (Bar)",
                "distribution": [
                    { "name": "Team A", "value": 45 }, { "name": "Team B", "value": 38 }, { "name": "Team C", "value": 52 }
                ],
                "allowedTrendTypes": ["bar", "line"],
                "allowedDistTypes": ["hbar", "bar"]
            }
        },
        {
            "name": "Monthly Productivity trend (Total & Category wise)",
            "module": "Meter-Installation",
            "department": "Business",
            "description": "Productivity trends over time.",
            "status": "Stable",
            "analysisItems": [
                { "label": "Formula", "value": "COUNT(*) GROUP BY DATE_TRUNC('month', installationDate)" },
                { "label": "Frequency", "value": "Monthly" }
            ],
            "qualityDescription": "Month-over-month growth in installation volume and team efficiency.",
            "chartData": {
                "trendTitle": "Monthly Growth",
                "trend": [
                    { "name": "Jan", "value": 1200 }, { "name": "Feb", "value": 1500 }, { "name": "Mar", "value": 1800 }
                ],
                "distTitle": "Category Mix",
                "distribution": [
                    { "name": "1-Phase", "value": 70, "color": "#3b82f6" }, { "name": "3-Phase", "value": 30, "color": "#10b981" }
                ],
                "allowedTrendTypes": ["bar", "area"],
                "allowedDistTypes": ["donut", "bar"],
                "allowedDurations": ["Monthly"],
                "isMonthlyOnly": true,
                "isTimeSeries": false
            }
        },
        {
            "name": "Defective Meters",
            "module": "Meter-Installation",
            "department": "Business",
            "description": "Meters found with technical defects.",
            "status": "Warning",
            "analysisItems": [
                { "label": "Metric", "value": "Count of Failures" },
                { "label": "Focus", "value": "Tech/Commercial" }
            ],
            "qualityDescription": "Meters rejected during installation or pre-installation check due to manufacturing flaws or damage.",
            "chartData": {
                "trendTitle": "Defect Rate (%)",
                "trend": [
                    { "name": "W1", "value": 1.2 }, { "name": "W2", "value": 0.8 }, { "name": "W3", "value": 2.1 }
                ],
                "distTitle": "RCA Defect Types (Pareto)",
                "distribution": [
                    { "name": "Display", "value": 45, "cumulative": 45 },
                    { "name": "Comm Module", "value": 30, "cumulative": 75 },
                    { "name": "Accuracy", "value": 15, "cumulative": 90 },
                    { "name": "Physical", "value": 10, "cumulative": 100 }
                ],
                "allowedTrendTypes": ["line", "multi-line"],
                "allowedDistTypes": ["pareto", "bar"]
            }
        },
        {
            "name": "Total & Category wise Inventory Utilization rate (Meters & Cable)",
            "module": "Inventory",
            "department": "Business",
            "description": "Efficiency of material usage.",
            "status": "Good",
            "analysisItems": [
                { "label": "Formula", "value": "(Installed / Total Inventory) * 100" },
                { "label": "Frequency", "value": "Weekly / Monthly" }
            ],
            "qualityDescription": "Percentage of total stock issued that has been successfully installed and mapped.",
            "chartData": {
                "trendTitle": "Utilization Trend",
                "trend": [
                    { "name": "Jan", "value": 65 }, { "name": "Feb", "value": 78 }, { "name": "Mar", "value": 88 }
                ],
                "distTitle": "Current Rate (Gauge)",
                "distribution": [
                    { "name": "Utilization", "value": 88 }
                ],
                "allowedTrendTypes": ["area", "line"],
                "allowedDistTypes": ["gauge", "bar"],
                "allowedDurations": ["Weekly", "Monthly"]
            }
        },
        {
            "name": "MI pace Vs Stock availibility",
            "module": "Inventory",
            "department": "Business",
            "description": "Installation speed relative to inventory.",
            "status": "Stable",
            "analysisItems": [
                { "label": "Metric", "value": "Daily Install vs Stock" },
                { "label": "Frequency", "value": "Daily" }
            ],
            "qualityDescription": "Monitors if the current installation rate will exceed available stock, leading to team downtime.",
            "chartData": {
                "trendTitle": "Pace vs Availability (Dual Axis)",
                "trend": [
                    { "name": "D1", "installations": 120, "stock": 5000 },
                    { "name": "D2", "installations": 150, "stock": 4850 },
                    { "name": "D3", "installations": 180, "stock": 4670 }
                ],
                "distTitle": "Stock Coverage (Days)",
                "distribution": [
                    { "name": "Meters", "value": 45 }, { "name": "Cable", "value": 12 }
                ],
                "allowedTrendTypes": ["dual-axis", "multi-line"],
                "allowedDistTypes": ["bar"],
                "allowedDurations": ["Daily"]
            }
        },
        {
            "name": "Un-utilized stock ageing",
            "module": "Inventory",
            "department": "Business",
            "description": "Duration of stock sitting in inventory.",
            "status": "Warning",
            "analysisItems": [
                { "label": "Formula", "value": "CURRENT_DATE - DIDate WHERE InstalledTS IS NULL" },
                { "label": "Frequency", "value": "As on date" }
            ],
            "qualityDescription": "Identifies slow-moving or obsolete inventory items that have been in stock for extended periods.",
            "chartData": {
                "trendTitle": "Stock Intake (90 Days)",
                "trend": [
                    { "name": "M1", "value": 200 }, { "name": "M2", "value": 150 }, { "name": "M3", "value": 100 }
                ],
                "distTitle": "Ageing Buckets (BoxPlot)",
                "distribution": [
                    { "name": "0-30 days", "avg": 12 },
                    { "name": "31-60 days", "avg": 45 },
                    { "name": "61-90 days", "avg": 78 },
                    { "name": "90+ days", "avg": 120 }
                ],
                "allowedTrendTypes": ["bar", "area"],
                "allowedDistTypes": ["boxplot", "hbar"],
                "allowedDurations": ["As on date"]
            }
        },
        {
            "name": "Never / Non-comm Status",
            "module": "O&M",
            "department": "Business",
            "description": "Meters that never communicated.",
            "status": "Critical",
            "analysisItems": [
                { "label": "Metric", "value": "Non-communicating Count" }
            ],
            "qualityDescription": "Percentage of installed meters that have failed to establish a communication link with the HES.",
            "chartData": {
                "trendTitle": "Daily Comm Failures",
                "trend": [
                    { "name": "Mon", "value": 45 }, { "name": "Tue", "value": 38 }, { "name": "Wed", "value": 52 }
                ],
                "distTitle": "Total Non-Comm Rate (Gauge)",
                "distribution": [
                    { "name": "Non-Comm", "value": 1.2 }
                ],
                "allowedTrendTypes": ["line", "area"],
                "allowedDistTypes": ["gauge", "bar"]
            }
        },
        {
            "name": "O&M-Productivity per team (Total & Category wise)",
            "module": "O&M",
            "department": "Business",
            "description": "Output of maintenance teams.",
            "status": "On Track",
            "analysisItems": [
                { "label": "Formula", "value": "COUNT(Closed Tickets) GROUP BY Tech/Agency" },
                { "label": "Frequency", "value": "Daily / Weekly / Monthly" }
            ],
            "qualityDescription": "Average number of O&M tickets resolved per person/team per work cycle.",
            "chartData": {
                "trendTitle": "Resolution Speed",
                "trend": [
                    { "name": "Jan", "value": 4.2 }, { "name": "Feb", "value": 3.8 }, { "name": "Mar", "value": 4.5 }
                ],
                "distTitle": "Productivity per Team (HBar)",
                "distribution": [
                    { "name": "Agency X", "value": 85 }, { "name": "Agency Y", "value": 92 }, { "name": "Agency Z", "value": 78 }
                ],
                "allowedTrendTypes": ["bar", "line"],
                "allowedDistTypes": ["hbar", "bar"]
            }
        },
        {
            "name": "O&M Productivity trend (Total & Category wise)",
            "module": "O&M",
            "department": "Business",
            "description": "Historical O&M performance.",
            "status": "Stable",
            "analysisItems": [
                { "label": "Formula", "value": "COUNT(Closed Tickets) GROUP BY Month" }
            ],
            "qualityDescription": "Long-term trend of ticket resolution volumes to identify seasonal spikes or team burnout.",
            "chartData": {
                "trendTitle": "Monthly Growth",
                "trend": [
                    { "name": "Jan", "value": 250 }, { "name": "Feb", "value": 280 }, { "name": "Mar", "value": 310 }
                ],
                "distTitle": "Ticket Type Distribution",
                "distribution": [
                    { "name": "Network", "value": 40 }, { "name": "Hardware", "value": 35 }, { "name": "Other", "value": 25 }
                ],
                "allowedTrendTypes": ["area", "bar"],
                "allowedDistTypes": ["donut", "bar"]
            }
        },
        {
            "name": "O&M Not closed ticket Ageing",
            "module": "O&M",
            "department": "Business",
            "description": "Duration of open maintenance tickets.",
            "status": "Critical",
            "analysisItems": [
                { "label": "Formula", "value": "CURRENT_DATE - CreatedDate" }
            ],
            "qualityDescription": "Ageing distribution of pending tickets to pinpoint bottlenecks in the repair cycle.",
            "chartData": {
                "trendTitle": "Total Open",
                "trend": [
                    { "name": "W1", "value": 85 }, { "name": "W2", "value": 92 }, { "name": "W3", "value": 110 }
                ],
                "distTitle": "Open Ticket Ageing (BoxPlot)",
                "distribution": [
                    { "name": "< 24h", "avg": 8 },
                    { "name": "1-3 days", "avg": 36 },
                    { "name": "4-7 days", "avg": 96 },
                    { "name": "> 7 days", "avg": 180 }
                ],
                "allowedTrendTypes": ["line", "bar"],
                "allowedDistTypes": ["boxplot", "hbar", "bar"]
            }
        },
        {
            "name": "O&M Ticket Closure Avg. Time",
            "module": "O&M",
            "department": "Business",
            "description": "Average time taken to close tickets.",
            "status": "Warning",
            "analysisItems": [
                { "label": "Formula", "value": "AVG(ClosedDate - CreatedDate)" }
            ],
            "qualityDescription": "Measures the efficiency of the response team from complaint registration to final resolution.",
            "chartData": {
                "trendTitle": "Wait Time Trend",
                "trend": [
                    { "name": "Jan", "value": 36 }, { "name": "Feb", "value": 32 }, { "name": "Mar", "value": 28 }
                ],
                "distTitle": "Distribution per Team (BoxPlot)",
                "distribution": [
                    { "name": "Urban", "avg": 18 },
                    { "name": "Semi-Urban", "avg": 24 },
                    { "name": "Rural", "avg": 42 }
                ],
                "allowedTrendTypes": ["line", "area"],
                "allowedDistTypes": ["boxplot", "bar"]
            }
        },
        {
            "name": "O&M Ticket Closed Analysis",
            "module": "O&M",
            "department": "Business",
            "description": "Categorized view of resolved tickets.",
            "status": "Good",
            "analysisItems": [
                { "label": "Formula", "value": "COUNT(Closed Tickets) GROUP BY Category" }
            ],
            "qualityDescription": "Granular breakdown of what issues are being solved most frequently.",
            "chartData": {
                "trendTitle": "Daily Closures",
                "trend": [
                    { "name": "M", "value": 15 }, { "name": "T", "value": 22 }, { "name": "W", "value": 19 }
                ],
                "distTitle": "Closure Analysis (Bar)",
                "distribution": [
                    { "name": "Physical Fault", "value": 120 },
                    { "name": "Signal Issue", "value": 85 },
                    { "name": "Billing Sync", "value": 60 }
                ],
                "allowedTrendTypes": ["line"],
                "allowedDistTypes": ["donut", "hbar", "bar"]
            }
        },
        {
            "name": "MI Vs SAT-Progress (Total & Category wise)",
            "module": "SAT",
            "department": "Business",
            "description": "Sites installed vs sites verified.",
            "status": "On Track",
            "analysisItems": [
                { "label": "Formula", "value": "COUNT(SAT_Number) / COUNT(MI)" }
            ],
            "qualityDescription": "Tracks the lag between technical installation and formal acceptance testing.",
            "chartData": {
                "trendTitle": "SAT Phase Completion",
                "trend": [
                    { "name": "Phase 1", "value": 75 }, { "name": "Phase 2", "value": 78 }, { "name": "Phase 3", "value": 82 }
                ],
                "distTitle": "MI vs SAT Gap (Bar)",
                "distribution": [
                    { "name": "Installed", "value": 6100 },
                    { "name": "Verified", "value": 4800 }
                ],
                "allowedTrendTypes": ["bar", "hbar", "multi-line", "line"],
                "allowedDistTypes": ["bar", "funnel"],
                "allowedDurations": ["Daily"],
                "isTimeSeries": false
            }
        },
        {
            "name": "Non-SAT ageing",
            "module": "SAT",
            "department": "Business",
            "description": "Time since installation without SAT.",
            "status": "Warning",
            "analysisItems": [
                { "label": "Formula", "value": "CURRENT_DATE - InstalledTS WHERE SATTS IS NULL" }
            ],
            "qualityDescription": "Identifies sites that are installed but idling without verification, affecting billing cycles.",
            "chartData": {
                "trendTitle": "Non-SAT Count",
                "trend": [
                    { "name": "W1", "value": 450 }, { "name": "W2", "value": 420 }, { "name": "W3", "value": 380 }
                ],
                "distTitle": "Non-SAT Ageing (BoxPlot)",
                "distribution": [
                    { "name": "0-7 days", "avg": 4 },
                    { "name": "8-15 days", "avg": 12 },
                    { "name": "16-30 days", "avg": 25 },
                    { "name": "> 30 days", "avg": 45 }
                ],
                "allowedTrendTypes": ["bar"],
                "allowedDistTypes": ["boxplot", "hbar"],
                "allowedDurations": ["As on latest SAT"]
            }
        },
        {
            "name": "Non-SAT RCA",
            "module": "SAT",
            "department": "Business",
            "description": "Root cause analysis for pending SAT.",
            "status": "Ready",
            "analysisItems": [
                { "label": "Method", "value": "Pareto Analysis" }
            ],
            "qualityDescription": "Categorizes the main reasons why SAT is pending, using the 80/20 rule to prioritize fixes.",
            "chartData": {
                "trendTitle": "RCA Trend",
                "trend": [
                    { "name": "Jan", "value": 12 }, { "name": "Feb", "value": 15 }, { "name": "Mar", "value": 10 }
                ],
                "distTitle": "Root Causes (Pareto)",
                "distribution": [
                    { "name": "Document Missing", "value": 85, "cumulative": 40 },
                    { "name": "HES Sync Error", "value": 65, "cumulative": 70 },
                    { "name": "Access Issue", "value": 35, "cumulative": 85 },
                    { "name": "Others", "value": 30, "cumulative": 100 }
                ],
                "allowedTrendTypes": ["line"],
                "allowedDistTypes": ["pareto", "bar", "donut"],
                "allowedDurations": ["As on latest SAT"]
            }
        },
        {
            "name": "MI Vs SAT Vs Invoice-Progress (Total & Category wise)",
            "module": "Invoicing",
            "department": "Business",
            "description": "Installation to billing workflow progress.",
            "status": "Stable",
            "analysisItems": [
                { "label": "Workflow", "value": "MI -> SAT -> Invoice" }
            ],
            "qualityDescription": "Full lifecycle tracking from physical installation to revenue recognition.",
            "chartData": {
                "trendTitle": "Pipeline Throughput",
                "trend": [
                    { "name": "Jan", "value": 4500 }, { "name": "Feb", "value": 4200 }, { "name": "Mar", "value": 4800 }
                ],
                "distTitle": "Workflow Funnel",
                "distribution": [
                    { "name": "Installed", "value": 6100 },
                    { "name": "SAT Done", "value": 4800 },
                    { "name": "Invoiced", "value": 3200 }
                ],
                "allowedTrendTypes": ["bar", "multi-line", "line"],
                "allowedDistTypes": ["funnel", "bar"],
                "allowedDurations": ["Daily"],
                "isTimeSeries": false
            }
        },
        {
            "name": "Cable Invoice-Progress",
            "module": "Invoicing",
            "department": "Business",
            "description": "Invoicing status for cabling work.",
            "status": "Good",
            "analysisItems": [
                { "label": "Scope", "value": "Service Cable Invoicing" }
            ],
            "qualityDescription": "Specifically tracks the billing status of auxiliary materials used during installation.",
            "chartData": {
                "trendTitle": "Invoiced Length (m)",
                "trend": [
                    { "name": "Jan", "value": 12000 }, { "name": "Feb", "value": 15000 }, { "name": "Mar", "value": 14000 }
                ],
                "distTitle": "Invoicing Status (Bar)",
                "distribution": [
                    { "name": "Billed", "value": 85000 },
                    { "name": "Pending", "value": 25000 }
                ],
                "allowedTrendTypes": ["line", "area"],
                "allowedDistTypes": ["bar", "funnel"]
            }
        },
        {
            "name": "Revenue realized (Total & Category wise)",
            "module": "Revenue",
            "department": "Business",
            "description": "Actual income collected.",
            "status": "Stable",
            "analysisItems": [
                { "label": "Formula", "value": "SUM(RealizedAmount)" }
            ],
            "qualityDescription": "Total revenue that has been successfully collected and verified against invoices.",
            "chartData": {
                "trendTitle": "Monthly Realization",
                "trend": [
                    { "name": "Jan", "value": 8.5 }, { "name": "Feb", "value": 9.2 }, { "name": "Mar", "value": 10.5 }
                ],
                "distTitle": "By Category (Donut)",
                "distribution": [
                    { "name": "Domestic", "value": 65, "color": "#3b82f6" },
                    { "name": "Commercial", "value": 25, "color": "#10b981" },
                    { "name": "Industrial", "value": 10, "color": "#f59e0b" }
                ],
                "allowedTrendTypes": ["multi-area", "area"],
                "allowedDistTypes": ["gauge", "bar", "donut"]
            }
        },
        {
            "name": "Cable Revenue realized",
            "module": "Revenue",
            "department": "Business",
            "description": "Revenue from cable-related activities.",
            "status": "Good",
            "analysisItems": [
                { "label": "Scope", "value": "Cable Revenue" }
            ],
            "qualityDescription": "Revenue collected specifically for cabling work and secondary materials.",
            "chartData": {
                "trendTitle": "Cable Revenue Growth",
                "trend": [
                    { "name": "Jan", "value": 12 }, { "name": "Feb", "value": 15 }, { "name": "Mar", "value": 18 }
                ],
                "distTitle": "Realized vs Target",
                "distribution": [
                    { "name": "Realized", "value": 85 },
                    { "name": "Balance", "value": 15 }
                ],
                "allowedTrendTypes": ["line", "area"],
                "allowedDistTypes": ["gauge", "bar"]
            }
        },
        {
            "name": "Revenue not realized ageing (Total & Category wise)",
            "module": "Revenue",
            "department": "Business",
            "description": "Ageing of pending revenue.",
            "status": "Critical",
            "analysisItems": [
                { "label": "Formula", "value": "CURRENT_DATE - InvoiceDate WHERE Status != 'Paid'" }
            ],
            "qualityDescription": "Ageing buckets for revenue that is yet to be collected, highlighting risk areas.",
            "chartData": {
                "trendTitle": "Unpaid Volume",
                "trend": [
                    { "name": "Jan", "value": 4.5 }, { "name": "Feb", "value": 5.2 }, { "name": "Mar", "value": 6.1 }
                ],
                "distTitle": "Revenue Ageing (BoxPlot)",
                "distribution": [
                    { "name": "0-15 days", "avg": 8 },
                    { "name": "16-30 days", "avg": 22 },
                    { "name": "31-60 days", "avg": 45 },
                    { "name": "> 60 days", "avg": 90 }
                ],
                "allowedTrendTypes": ["bar"],
                "allowedDistTypes": ["boxplot", "hbar"],
                "allowedDurations": ["As on latest SAT"]
            }
        },
        {
            "name": "Cable Revenue not realized ageing",
            "module": "Revenue",
            "department": "Business",
            "description": "Ageing of pending cable revenue.",
            "status": "Critical",
            "analysisItems": [
                { "label": "Focus", "value": "Cable Receivables" }
            ],
            "qualityDescription": "Specific ageing analysis for cable-related receivables.",
            "chartData": {
                "trendTitle": "Cable Arrears",
                "trend": [
                    { "name": "W1", "value": 1.2 }, { "name": "W2", "value": 1.5 }, { "name": "W3", "value": 1.8 }
                ],
                "distTitle": "Arrears Ageing (BoxPlot)",
                "distribution": [
                    { "name": "0-30d", "avg": 15 },
                    { "name": "31-60d", "avg": 40 },
                    { "name": "> 60d", "avg": 75 }
                ],
                "allowedTrendTypes": ["bar"],
                "allowedDistTypes": ["boxplot", "hbar"]
            }
        },
        {
            "name": "Meters Journey Avg time across the levels for Revenue realized (Total & Category wise)",
            "module": "Meter Journey",
            "department": "Business",
            "description": "Average lead time to revenue realization.",
            "status": "Warning",
            "analysisItems": [
                { "label": "Formula", "value": "AVG(RealizedTS - InstalledTS)" }
            ],
            "qualityDescription": "Measures the total cycle time from physical install to cash realization.",
            "chartData": {
                "trendTitle": "Cycle Time (Days)",
                "trend": [
                    { "name": "Jan", "value": 45 }, { "name": "Feb", "value": 42 }, { "name": "Mar", "value": 38 }
                ],
                "distTitle": "Stage Latency (BoxPlot)",
                "distribution": [
                    { "name": "MI -> SAT", "avg": 12 },
                    { "name": "SAT -> Inv", "avg": 8 },
                    { "name": "Inv -> Cash", "avg": 25 }
                ],
                "allowedTrendTypes": ["line", "area"],
                "allowedDistTypes": ["bar", "hbar", "boxplot"],
                "allowedDurations": ["As on latest SAT"]
            }
        },
        {
            "name": "Meters Current Stage for Revenue not realized (Total & Category wise)",
            "module": "Meter Journey",
            "department": "Business",
            "description": "Tracking stage of non-realized revenue meters.",
            "status": "Stable",
            "analysisItems": [
                { "label": "Metric", "value": "Count per Workflow Stage" }
            ],
            "qualityDescription": "Visibility into where meters are 'stuck' in the revenue realization pipeline.",
            "chartData": {
                "trendTitle": "Meters in Pipe",
                "trend": [
                    { "name": "Jan", "value": 12000 }, { "name": "Feb", "value": 11500 }, { "name": "Mar", "value": 10800 }
                ],
                "distTitle": "Current Pipeline Mix (Donut)",
                "distribution": [
                    { "name": "At Survey", "value": 35, "color": "#3b82f6" },
                    { "name": "At Install", "value": 45, "color": "#10b981" },
                    { "name": "At SAT", "value": 15, "color": "#f59e0b" },
                    { "name": "At Invoice", "value": 5, "color": "#ef4444" }
                ],
                "allowedTrendTypes": ["line"],
                "allowedDistTypes": ["funnel", "bar", "donut"],
                "allowedDurations": ["As on latest SAT"]
            }
        }
    ],
    "summary": {
        "dashboard1": {
            "totalKPIs": 10,
            "totalAnomalies": 11,
            "highPriority": 0,
            "notFeasible": 0
        },
        "operation_parameters": {
            "totalKPIs": 23,
            "totalAnomalies": 19,
            "highPriority": 1,
            "notFeasible": 0
        },
        "load_management": {
            "totalKPIs": 12,
            "totalAnomalies": 12,
            "highPriority": 0,
            "notFeasible": 0
        },
        "power_quality": {
            "totalKPIs": 10,
            "totalAnomalies": 7,
            "highPriority": 0,
            "notFeasible": 0
        },
        "to_be_on_hold": {
            "totalKPIs": 11,
            "totalAnomalies": 15,
            "highPriority": 0,
            "notFeasible": 0
        },
        "theft_analysis": {
            "totalKPIs": 5,
            "totalAnomalies": 5,
            "highPriority": 1,
            "notFeasible": 0
        },
        "to_be_on_hold_extra": {
            "totalKPIs": 6,
            "totalAnomalies": 6,
            "highPriority": 0,
            "notFeasible": 0
        },
        "advanced_analytics": {
            "totalKPIs": 17,
            "totalAnomalies": 17,
            "highPriority": 0,
            "notFeasible": 0
        },
        "operation_analytics": {
            "totalKPIs": 13,
            "totalAnomalies": 17,
            "highPriority": 6,
            "notFeasible": 0
        },
        "dashboard10": { "totalKPIs": 24, "totalAnomalies": 3, "highPriority": 3, "notFeasible": 0 }
    },
    "chartData": {
        "finance": {
            "bar": [
                {
                    "name": "Finance",
                    "value": 9
                },
                {
                    "name": "Business",
                    "value": 1
                }
            ],
            "pie": [
                {
                    "name": "Stable",
                    "value": 9
                },
                {
                    "name": "Warning",
                    "value": 0
                },
                {
                    "name": "Critical",
                    "value": 0
                }
            ],
            "line": [
                {
                    "name": "Jan",
                    "value": 65
                },
                {
                    "name": "Feb",
                    "value": 84
                },
                {
                    "name": "Mar",
                    "value": 87
                },
                {
                    "name": "Apr",
                    "value": 64
                },
                {
                    "name": "May",
                    "value": 63
                },
                {
                    "name": "Jun",
                    "value": 91
                }
            ]
        },
        "operation_parameters": {
            "bar": [
                {
                    "name": "Operations",
                    "value": 21
                },
                {
                    "name": "Analytics",
                    "value": 1
                },
                {
                    "name": "Business",
                    "value": 1
                }
            ],
            "pie": [
                {
                    "name": "Stable",
                    "value": 21
                },
                {
                    "name": "Warning",
                    "value": 0
                },
                {
                    "name": "Critical",
                    "value": 1
                }
            ],
            "line": [
                {
                    "name": "Jan",
                    "value": 65
                },
                {
                    "name": "Feb",
                    "value": 83
                },
                {
                    "name": "Mar",
                    "value": 70
                },
                {
                    "name": "Apr",
                    "value": 64
                },
                {
                    "name": "May",
                    "value": 75
                },
                {
                    "name": "Jun",
                    "value": 89
                }
            ]
        },
        "load_management": {
            "bar": [
                {
                    "name": "Technical",
                    "value": 12
                }
            ],
            "pie": [
                {
                    "name": "Stable",
                    "value": 12
                },
                {
                    "name": "Warning",
                    "value": 0
                },
                {
                    "name": "Critical",
                    "value": 0
                }
            ],
            "line": [
                {
                    "name": "Jan",
                    "value": 70
                },
                {
                    "name": "Feb",
                    "value": 87
                },
                {
                    "name": "Mar",
                    "value": 95
                },
                {
                    "name": "Apr",
                    "value": 63
                },
                {
                    "name": "May",
                    "value": 94
                },
                {
                    "name": "Jun",
                    "value": 85
                }
            ]
        },
        "power_quality": {
            "bar": [
                {
                    "name": "Operations",
                    "value": 10
                }
            ],
            "pie": [
                {
                    "name": "Stable",
                    "value": 10
                },
                {
                    "name": "Warning",
                    "value": 0
                },
                {
                    "name": "Critical",
                    "value": 0
                }
            ],
            "line": [
                {
                    "name": "Jan",
                    "value": 63
                },
                {
                    "name": "Feb",
                    "value": 74
                },
                {
                    "name": "Mar",
                    "value": 90
                },
                {
                    "name": "Apr",
                    "value": 62
                },
                {
                    "name": "May",
                    "value": 75
                },
                {
                    "name": "Jun",
                    "value": 79
                }
            ]
        },
        "to_be_on_hold": {
            "bar": [
                {
                    "name": "M-1023",
                    "value": 25
                },
                {
                    "name": "M-4512",
                    "value": 22
                },
                {
                    "name": "M-7890",
                    "value": 19
                },
                {
                    "name": "M-3321",
                    "value": 15
                },
                {
                    "name": "M-5544",
                    "value": 12
                }
            ],
            "pie": [
                {
                    "name": "Critical",
                    "value": 15,
                    "color": "#EF4444"
                },
                {
                    "name": "Major",
                    "value": 35,
                    "color": "#F59E0B"
                },
                {
                    "name": "Minor",
                    "value": 50,
                    "color": "#3B82F6"
                }
            ],
            "line": [
                {
                    "name": "Mon",
                    "value": 45
                },
                {
                    "name": "Tue",
                    "value": 52
                },
                {
                    "name": "Wed",
                    "value": 38
                },
                {
                    "name": "Thu",
                    "value": 65
                },
                {
                    "name": "Fri",
                    "value": 42
                },
                {
                    "name": "Sat",
                    "value": 30
                },
                {
                    "name": "Sun",
                    "value": 25
                }
            ]
        },
        "theft_analysis": {
            "bar": [
                {
                    "name": "Finance",
                    "value": 1
                },
                {
                    "name": "Analytics",
                    "value": 4
                }
            ],
            "pie": [
                {
                    "name": "Stable",
                    "value": 4
                },
                {
                    "name": "Warning",
                    "value": 0
                },
                {
                    "name": "Critical",
                    "value": 1
                }
            ],
            "line": [
                {
                    "name": "Jan",
                    "value": 87
                },
                {
                    "name": "Feb",
                    "value": 93
                },
                {
                    "name": "Mar",
                    "value": 87
                },
                {
                    "name": "Apr",
                    "value": 65
                },
                {
                    "name": "May",
                    "value": 77
                },
                {
                    "name": "Jun",
                    "value": 61
                }
            ]
        },
        "to_be_on_hold_extra": {
            "bar": [
                {
                    "name": "Technical",
                    "value": 5
                },
                {
                    "name": "Analytics",
                    "value": 1
                }
            ],
            "pie": [
                {
                    "name": "Stable",
                    "value": 6
                },
                {
                    "name": "Warning",
                    "value": 0
                },
                {
                    "name": "Critical",
                    "value": 0
                }
            ],
            "line": [
                {
                    "name": "Jan",
                    "value": 69
                },
                {
                    "name": "Feb",
                    "value": 94
                },
                {
                    "name": "Mar",
                    "value": 65
                },
                {
                    "name": "Apr",
                    "value": 85
                },
                {
                    "name": "May",
                    "value": 73
                },
                {
                    "name": "Jun",
                    "value": 90
                }
            ]
        },
        "advanced_analytics": {
            "bar": [
                {
                    "name": "Advanced Analytics",
                    "value": 17
                }
            ],
            "pie": [
                {
                    "name": "Stable",
                    "value": 17
                },
                {
                    "name": "Warning",
                    "value": 0
                },
                {
                    "name": "Critical",
                    "value": 0
                }
            ],
            "line": [
                {
                    "name": "Jan",
                    "value": 74
                },
                {
                    "name": "Feb",
                    "value": 80
                },
                {
                    "name": "Mar",
                    "value": 82
                },
                {
                    "name": "Apr",
                    "value": 89
                },
                {
                    "name": "May",
                    "value": 91
                },
                {
                    "name": "Jun",
                    "value": 79
                }
            ]
        },
        "operation_analytics": {
            "bar": [
                {
                    "name": "Analytics",
                    "value": 13
                }
            ],
            "pie": [
                {
                    "name": "Stable",
                    "value": 4
                },
                {
                    "name": "Warning",
                    "value": 3
                },
                {
                    "name": "Critical",
                    "value": 6
                }
            ],
            "line": [
                {
                    "name": "Jan",
                    "value": 83
                },
                {
                    "name": "Feb",
                    "value": 63
                },
                {
                    "name": "Mar",
                    "value": 90
                },
                {
                    "name": "Apr",
                    "value": 64
                },
                {
                    "name": "May",
                    "value": 82
                },
                {
                    "name": "Jun",
                    "value": 84
                }
            ]
        },
        "dashboard10": {
            "bar": [{ "name": "Business", "value": 24 }],
            "pie": [{ "name": "Stable", "value": 10 }, { "name": "Ready", "value": 5 }, { "name": "Critical", "value": 9 }],
            "line": [{ "name": "Jan", "value": 60 }, { "name": "Feb", "value": 65 }, { "name": "Mar", "value": 70 }]
        }
    }
};
