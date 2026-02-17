export const dashboardData = {
    "dashboard1": [
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
    "dashboard2": [
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
            "anomalyTypes": 11,
            "voltageQuality": "Voltage < band for N intervals; cluster by geo",
            "voltageDetails": "Voltage bands + geo mapping optional",
            "voltageBandConfig": "+GIS optional",
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
    "dashboard3": [
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
    "dashboard4": [
        {
            "name": "Voltage Deviation (%)",
            "department": "Operations",
            "description": "Voltage quality",
            "status": "Stable"
        },
        {
            "name": "Voltage Deviation Index (VDI)",
            "department": "Operations",
            "description": "Composite voltage metric",
            "status": "Stable"
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
            "status": "Stable"
        },
        {
            "name": "Low Power Factor (%) by DT/Feeder",
            "department": "Operations",
            "description": "Low PF pockets",
            "status": "Stable"
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
            "status": "Stable"
        },
        {
            "name": "% Time with unacceptable current imbalance (>10%)",
            "department": "Operations",
            "description": "Compliance (I unbalance)",
            "status": "Stable"
        }
    ],
    "dashboard5": [
        {
            "name": "Number of Tamper Alerts (Cover Open)",
            "department": "Analytics",
            "description": "Tamper monitoring",
            "status": "Stable"
        },
        {
            "name": "Number of Tamper Alerts (External Magnet)",
            "department": "Analytics",
            "description": "Tamper monitoring",
            "status": "Stable"
        },
        {
            "name": "Number of Tamper Alerts (Neutral Disturbance)",
            "department": "Analytics",
            "description": "Tamper monitoring",
            "status": "Stable"
        },
        {
            "name": "Number of Tamper Alerts (Neutral Missing)",
            "department": "Analytics",
            "description": "Tamper monitoring",
            "status": "Stable"
        },
        {
            "name": "Consumption Comparison - Energy Gap (kWh)",
            "department": "Analytics",
            "description": "Detect theft/loss pockets",
            "status": "Stable"
        },
        {
            "name": "Total anomalies detected (by time period)",
            "department": "Analytics",
            "description": "Volume tracking",
            "status": "Stable"
        },
        {
            "name": "Anomalies by type",
            "department": "Analytics",
            "description": "Distribution",
            "status": "Stable"
        },
        {
            "name": "Anomalies by severity",
            "department": "Analytics",
            "description": "Severity mix",
            "status": "Stable"
        },
        {
            "name": "Anomalies by geography",
            "department": "Analytics",
            "description": "Hotspots",
            "status": "Stable"
        },
        {
            "name": "Anomaly trends (daily/weekly/monthly)",
            "department": "Analytics",
            "description": "Trends",
            "status": "Stable"
        },
        {
            "name": "Repeat anomaly tracking",
            "department": "Analytics",
            "description": "Repeat offenders",
            "status": "Stable"
        }
    ],
    "dashboard6": [
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
        {
            "name": "Revenue Recovery Improvement (%)",
            "department": "Finance",
            "description": "Impact tracking",
            "status": "Stable"
        }
    ],
    "dashboard7": [
        {
            "name": "Communication health issues",
            "department": "Analytics",
            "description": "Comms monitoring",
            "status": "Stable"
        },
        {
            "name": "Signal strength statistics",
            "department": "Technical",
            "description": "Network quality",
            "status": "Stable"
        },
        {
            "name": "Packet loss percentage",
            "department": "Technical",
            "description": "Comms reliability",
            "status": "Stable"
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
            "status": "Stable"
        },
        {
            "name": "Communication technology performance (RF/GPRS/PLC)",
            "department": "Technical",
            "description": "Compare comms modes",
            "status": "Stable"
        }
    ],
    "dashboard8": [
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
            "status": "Stable"
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
            "status": "Stable"
        },
        {
            "name": "Correction cycle time (avg days)",
            "department": "Advanced Analytics",
            "description": "Speed improvements",
            "status": "Stable"
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
    "dashboard9": [
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
            "status": "Warning"
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
            "status": "Warning"
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
            "status": "Warning"
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
            "status": "Stable"
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
    "summary": {
        "dashboard1": {
            "totalKPIs": 9,
            "totalAnomalies": 11,
            "highPriority": 0,
            "notFeasible": 0
        },
        "dashboard2": {
            "totalKPIs": 22,
            "totalAnomalies": 19,
            "highPriority": 1,
            "notFeasible": 0
        },
        "dashboard3": {
            "totalKPIs": 12,
            "totalAnomalies": 12,
            "highPriority": 0,
            "notFeasible": 0
        },
        "dashboard4": {
            "totalKPIs": 10,
            "totalAnomalies": 7,
            "highPriority": 0,
            "notFeasible": 0
        },
        "dashboard5": {
            "totalKPIs": 11,
            "totalAnomalies": 15,
            "highPriority": 0,
            "notFeasible": 0
        },
        "dashboard6": {
            "totalKPIs": 5,
            "totalAnomalies": 5,
            "highPriority": 1,
            "notFeasible": 0
        },
        "dashboard7": {
            "totalKPIs": 6,
            "totalAnomalies": 6,
            "highPriority": 0,
            "notFeasible": 0
        },
        "dashboard8": {
            "totalKPIs": 17,
            "totalAnomalies": 17,
            "highPriority": 0,
            "notFeasible": 0
        },
        "dashboard9": {
            "totalKPIs": 13,
            "totalAnomalies": 17,
            "highPriority": 6,
            "notFeasible": 0
        }
    },
    "chartData": {
        "dashboard1": {
            "bar": [
                {
                    "name": "Finance",
                    "value": 9
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
        "dashboard2": {
            "bar": [
                {
                    "name": "Operations",
                    "value": 21
                },
                {
                    "name": "Analytics",
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
        "dashboard3": {
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
        "dashboard4": {
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
        "dashboard5": {
            "bar": [
                {
                    "name": "Analytics",
                    "value": 11
                }
            ],
            "pie": [
                {
                    "name": "Stable",
                    "value": 11
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
                    "value": 93
                },
                {
                    "name": "Mar",
                    "value": 70
                },
                {
                    "name": "Apr",
                    "value": 93
                },
                {
                    "name": "May",
                    "value": 85
                },
                {
                    "name": "Jun",
                    "value": 75
                }
            ]
        },
        "dashboard6": {
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
        "dashboard7": {
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
        "dashboard8": {
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
        "dashboard9": {
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
        }
    }
};
