export const executiveDummyData = {
    "summary": {
        "totalKPIs": 105,
        "totalIssues": 104,
        "departments": 6,
        "overallScore": 44
    },
    "businessAreas": {
        "finance": {
            "health": 65,
            "issues": 10,
            "summary": "Finance stability is concerning.",
            "link": "/departments"
        },
        "operation": {
            "health": 25,
            "issues": 31,
            "summary": "Operations stability is concerning.",
            "link": "/departments"
        },
        "analytics": {
            "health": 25,
            "issues": 29,
            "summary": "Analytics stability is concerning.",
            "link": "/departments"
        },
        "technical": {
            "health": 62,
            "issues": 17,
            "summary": "Technical stability is concerning.",
            "link": "/departments"
        },
        "advancedAnalytics": {
            "health": 46,
            "issues": 17,
            "summary": "Advanced Analytics stability is concerning.",
            "link": "/departments"
        },
        "business": {
            "health": 78,
            "issues": 4,
            "summary": "Business performance is strong but needs focus on growth.",
            "link": "/departments"
        },
        "performanceTrend": {
            "trendDirection": "up",
            "summary": "Positive overarching trend in system availability.",
            "link": "/trends"
        }
    },
    "departments": [
        {
            "id": "dept_1",
            "name": "Finance",
            "impactStatement": "Finance performance is at risk with 5 critical items.",
            "kpis": 10,
            "kpiList": [
                {
                    "id": "kpi_9096",
                    "kpiName": "Billing Efficiency (%)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "82%",
                    "dashboard": "finance"
                },
                {
                    "id": "kpi_9312",
                    "kpiName": "Top X Best/Worst Feeders/DTs",
                    "status": "Active",
                    "trend": "stable",
                    "value": "96%",
                    "dashboard": "finance"
                },
                {
                    "id": "kpi_5072",
                    "kpiName": "Top High Loss DTs / Feeders",
                    "status": "Active",
                    "trend": "stable",
                    "value": "92%",
                    "dashboard": "finance"
                },
                {
                    "id": "kpi_9765",
                    "kpiName": "Top High-Loss Feeders / DTs",
                    "status": "Active",
                    "trend": "stable",
                    "value": "84%",
                    "dashboard": "finance"
                },
                {
                    "id": "kpi_4171",
                    "kpiName": "Revenue Recovery Improvement (%)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "92%",
                    "dashboard": "theft_analysis"
                }
            ],
            "issues": {
                "total": 10,
                "attention": 5
            },
            "needsAttention": [
                "Feeder Loss (%)",
                "DT (Distribution Transformer) Loss (%)",
                "LT Loss (%)",
                "Billing Efficiency (%)",
                "Collection Efficiency (%)"
            ],
            "workingWell": [
                "All Finance KPIs stable"
            ],
            "trend": [
                {
                    "name": "Jan",
                    "value": 60
                },
                {
                    "name": "Feb",
                    "value": 63
                },
                {
                    "name": "Mar",
                    "value": 65
                },
                {
                    "name": "Apr",
                    "value": 67
                },
                {
                    "name": "May",
                    "value": 66
                },
                {
                    "name": "Jun",
                    "value": 65
                }
            ]
        },
        {
            "id": "dept_2",
            "name": "Operations",
            "impactStatement": "Operations performance is at risk with 9 critical items.",
            "kpis": 17,
            "kpiList": [
                {
                    "id": "kpi_9111",
                    "kpiName": "Detection Accuracy",
                    "status": "Active",
                    "trend": "stable",
                    "value": "99%",
                    "dashboard": "to_be_on_hold"
                },
                {
                    "id": "kpi_3791",
                    "kpiName": "False Positive Rate",
                    "status": "Active",
                    "trend": "stable",
                    "value": "84%",
                    "dashboard": "to_be_on_hold"
                },
                {
                    "id": "kpi_6406",
                    "kpiName": "Field inspection hit-rate",
                    "status": "Active",
                    "trend": "stable",
                    "value": "100%",
                    "dashboard": "to_be_on_hold"
                },
                {
                    "id": "kpi_8464",
                    "kpiName": "MTTI",
                    "status": "Active",
                    "trend": "stable",
                    "value": "88%",
                    "dashboard": "to_be_on_hold"
                },
                {
                    "id": "kpi_4011",
                    "kpiName": "MTTR",
                    "status": "Active",
                    "trend": "stable",
                    "value": "98%",
                    "dashboard": "to_be_on_hold"
                },
                {
                    "id": "kpi_8240",
                    "kpiName": "Alert response time",
                    "status": "Active",
                    "trend": "stable",
                    "value": "86%",
                    "dashboard": "to_be_on_hold"
                },
                {
                    "id": "kpi_3073",
                    "kpiName": "Planned outage suppression rate",
                    "status": "Good",
                    "trend": "stable",
                    "value": "84%",
                    "dashboard": "to_be_on_hold"
                },
                {
                    "id": "kpi_4968",
                    "kpiName": "Voltage Deviation (%)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "88%",
                    "dashboard": "power_quality"
                },
                {
                    "id": "kpi_1387",
                    "kpiName": "Voltage Deviation Index (VDI)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "96%",
                    "dashboard": "power_quality"
                },
                {
                    "id": "kpi_8157",
                    "kpiName": "Voltage Fluctuation Index",
                    "status": "Good",
                    "trend": "stable",
                    "value": "96%",
                    "dashboard": "power_quality"
                },
                {
                    "id": "kpi_4950",
                    "kpiName": "Voltage Unbalance Index",
                    "status": "Active",
                    "trend": "stable",
                    "value": "94%",
                    "dashboard": "power_quality"
                },
                {
                    "id": "kpi_2985",
                    "kpiName": "Voltage Drop (V)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "81%",
                    "dashboard": "power_quality"
                },
                {
                    "id": "kpi_5786",
                    "kpiName": "Meter Current Unbalance (%)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "99%",
                    "dashboard": "power_quality"
                },
                {
                    "id": "kpi_4445",
                    "kpiName": "% Time beyond voltage tolerance band",
                    "status": "Active",
                    "trend": "stable",
                    "value": "92%",
                    "dashboard": "power_quality"
                },
                {
                    "id": "kpi_4139",
                    "kpiName": "% Time with unacceptable current imbalance (>10%)",
                    "status": "Good",
                    "trend": "stable",
                    "value": "96%",
                    "dashboard": "power_quality"
                }
            ],
            "issues": {
                "total": 21,
                "attention": 5
            },
            "needsAttention": [
                "Voltage Deviation (%)",
                "% Time beyond voltage tolerance band",
                "Voltage Unbalance Index",
                "Voltage Drop (V)"
            ],
            "workingWell": [
                "Planned outage suppression rate",
                "Voltage Fluctuation Index",
                "% Time with unacceptable current imbalance (>10%)"
            ],
            "trend": [
                {
                    "name": "Jan",
                    "value": 20
                },
                {
                    "name": "Feb",
                    "value": 23
                },
                {
                    "name": "Mar",
                    "value": 25
                },
                {
                    "name": "Apr",
                    "value": 27
                },
                {
                    "name": "May",
                    "value": 26
                },
                {
                    "name": "Jun",
                    "value": 25
                }
            ]
        },
        {
            "id": "dept_3",
            "name": "Analytics",
            "impactStatement": "Analytics performance is at risk with 9 critical items.",
            "kpis": 44,
            "kpiList": [
                {
                    "id": "kpi_2002",
                    "kpiName": "Consumption Comparison - Energy Gap (kWh)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "82%",
                    "dashboard": "theft_analysis"
                },
                {
                    "id": "kpi_3085",
                    "kpiName": "Low-voltage pockets",
                    "status": "Active",
                    "trend": "stable",
                    "value": "86%",
                    "dashboard": "operation_parameters"
                },
                {
                    "id": "kpi_2211",
                    "kpiName": "SAIDI",
                    "status": "Active",
                    "trend": "stable",
                    "value": "86%",
                    "dashboard": "operation_parameters"
                },
                {
                    "id": "kpi_3153",
                    "kpiName": "SAIFI",
                    "status": "Active",
                    "trend": "stable",
                    "value": "92%",
                    "dashboard": "operation_parameters"
                },
                {
                    "id": "kpi_5017",
                    "kpiName": "CAIDI",
                    "status": "Active",
                    "trend": "stable",
                    "value": "82%",
                    "dashboard": "operation_parameters"
                },
                {
                    "id": "kpi_5905",
                    "kpiName": "CAIFI",
                    "status": "Active",
                    "trend": "stable",
                    "value": "93%",
                    "dashboard": "operation_parameters"
                },
                {
                    "id": "kpi_8811",
                    "kpiName": "MAIFI",
                    "status": "Good",
                    "trend": "stable",
                    "value": "82%",
                    "dashboard": "operation_parameters"
                },
                {
                    "id": "kpi_9360",
                    "kpiName": "Number of Outages (Frequency)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "97%",
                    "dashboard": "operation_parameters"
                },
                {
                    "id": "kpi_9593",
                    "kpiName": "Duration of Outages (Minutes)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "89%",
                    "dashboard": "operation_parameters"
                },
                {
                    "id": "kpi_1970",
                    "kpiName": "DT/Feeder Reliability Trends (Monthly/Yearly)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "89%",
                    "dashboard": "operation_parameters"
                },
                {
                    "id": "kpi_5041",
                    "kpiName": "DTs with High Failure Rate",
                    "status": "Active",
                    "trend": "stable",
                    "value": "86%",
                    "dashboard": "operation_parameters"
                },
                {
                    "id": "kpi_9433",
                    "kpiName": "Feeders with Maximum Outages",
                    "status": "Active",
                    "trend": "stable",
                    "value": "98%",
                    "dashboard": "operation_parameters"
                },
                {
                    "id": "kpi_6512",
                    "kpiName": "Reliability Improvement Trend",
                    "status": "Active",
                    "trend": "stable",
                    "value": "87%",
                    "dashboard": "operation_parameters"
                },
                {
                    "id": "kpi_1894",
                    "kpiName": "Consumer Service Reliability Score",
                    "status": "Good",
                    "trend": "stable",
                    "value": "93%",
                    "dashboard": "operation_parameters"
                },
                {
                    "id": "kpi_8248",
                    "kpiName": "Composite Reliability Score",
                    "status": "Good",
                    "trend": "stable",
                    "value": "90%",
                    "dashboard": "operation_parameters"
                },
                {
                    "id": "kpi_2605",
                    "kpiName": "Composite Efficiency Score",
                    "status": "Good",
                    "trend": "stable",
                    "value": "93%",
                    "dashboard": "operation_parameters"
                },
                {
                    "id": "kpi_5750",
                    "kpiName": "Number of Tamper Alerts (Cover Open)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "94%",
                    "dashboard": "theft_analysis"
                },
                {
                    "id": "kpi_8753",
                    "kpiName": "Number of Tamper Alerts (External Magnet)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "93%",
                    "dashboard": "theft_analysis"
                },
                {
                    "id": "kpi_6486",
                    "kpiName": "Number of Tamper Alerts (Neutral Disturbance)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "93%",
                    "dashboard": "theft_analysis"
                },
                {
                    "id": "kpi_1938",
                    "kpiName": "Number of Tamper Alerts (Neutral Missing)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "87%",
                    "dashboard": "theft_analysis"
                },

                {
                    "id": "kpi_2646",
                    "kpiName": "Total anomalies detected (by time period)",
                    "status": "Active",
                    "trend": "up",
                    "value": "3,150",
                    "dashboard": "theft_analysis"
                },
                {
                    "id": "kpi_7057",
                    "kpiName": "Anomalies by type",
                    "status": "Active",
                    "trend": "up",
                    "value": "1,450",
                    "dashboard": "theft_analysis"
                },
                {
                    "id": "kpi_1021",
                    "kpiName": "Anomalies by severity",
                    "status": "Active",
                    "trend": "stable",
                    "value": "97%",
                    "dashboard": "theft_analysis"
                },
                {
                    "id": "kpi_3345",
                    "kpiName": "Anomalies by geography",
                    "status": "Active",
                    "trend": "stable",
                    "value": "82%",
                    "dashboard": "theft_analysis"
                },
                {
                    "id": "kpi_2749",
                    "kpiName": "Anomaly trends (daily/weekly/monthly)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "87%",
                    "dashboard": "theft_analysis"
                },
                {
                    "id": "kpi_4292",
                    "kpiName": "Repeat anomaly tracking",
                    "status": "Active",
                    "trend": "stable",
                    "value": "98%",
                    "dashboard": "theft_analysis"
                },
                {
                    "id": "kpi_8045",
                    "kpiName": "Theft Suspect Flags",
                    "status": "Active",
                    "trend": "stable",
                    "value": "94%",
                    "dashboard": "theft_analysis"
                },
                {
                    "id": "kpi_1635",
                    "kpiName": "% Reduction in Theft Events (monthly trend)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "98%",
                    "dashboard": "theft_analysis"
                },
                {
                    "id": "kpi_1198",
                    "kpiName": "Theft / Load diversion",
                    "status": "Active",
                    "trend": "stable",
                    "value": "84%",
                    "dashboard": "theft_analysis"
                },
                {
                    "id": "kpi_8572",
                    "kpiName": "Areas with Highest Theft Risk",
                    "status": "Blocked",
                    "trend": "stable",
                    "value": "85%",
                    "dashboard": "theft_analysis"
                },
                {
                    "id": "kpi_4706",
                    "kpiName": "Communication health issues",
                    "status": "Good",
                    "trend": "stable",
                    "value": "96%",
                    "dashboard": "to_be_on_hold"
                },
                {
                    "id": "kpi_5348",
                    "kpiName": "Tamper sequence detection",
                    "status": "Active",
                    "trend": "stable",
                    "value": "85%",
                    "dashboard": "operation_analytics"
                },
                {
                    "id": "kpi_1882",
                    "kpiName": "Voltage/Current imbalance",
                    "status": "Active",
                    "trend": "stable",
                    "value": "99%",
                    "dashboard": "operation_analytics"
                },
                {
                    "id": "kpi_1773",
                    "kpiName": "Power factor deterioration",
                    "status": "Good",
                    "trend": "stable",
                    "value": "98%",
                    "dashboard": "operation_analytics"
                },
                {
                    "id": "kpi_1678",
                    "kpiName": "Hidden outage pockets",
                    "status": "Active",
                    "trend": "stable",
                    "value": "85%",
                    "dashboard": "operation_analytics"
                },
                {
                    "id": "kpi_4663",
                    "kpiName": "Data quality issues",
                    "status": "Good",
                    "trend": "stable",
                    "value": "87%",
                    "dashboard": "operation_analytics"
                },
                {
                    "id": "kpi_8459",
                    "kpiName": "Reverse flow",
                    "status": "Active",
                    "trend": "stable",
                    "value": "91%",
                    "dashboard": "operation_analytics"
                },
                {
                    "id": "kpi_5010",
                    "kpiName": "Consumption spikes/drops",
                    "status": "Good",
                    "trend": "stable",
                    "value": "81%",
                    "dashboard": "operation_analytics"
                },
                {
                    "id": "kpi_7124",
                    "kpiName": "Phase imbalance reduced by minimum 30%",
                    "status": "Good",
                    "trend": "stable",
                    "value": "93%",
                    "dashboard": "operation_analytics"
                },
                {
                    "id": "kpi_8695",
                    "kpiName": "Real-time phase load monitoring per transformer",
                    "status": "Active",
                    "trend": "stable",
                    "value": "87%",
                    "dashboard": "operation_analytics"
                },
                {
                    "id": "kpi_2343",
                    "kpiName": "Imbalance alerts when threshold exceeded",
                    "status": "Active",
                    "trend": "stable",
                    "value": "91%",
                    "dashboard": "operation_analytics"
                },
                {
                    "id": "kpi_overload_risk",
                    "kpiName": "Overload / MD Breach Risk",
                    "status": "Active",
                    "trend": "stable",
                    "value": "Ready",
                    "dashboard": "load_management_analytics"
                },
                {
                    "id": "asset_kpi_1",
                    "kpiName": "Total Assets Tracked",
                    "status": "Ready",
                    "trend": "stable",
                    "value": "View",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "asset_kpi_2",
                    "kpiName": "Track updated tag of Feeder to DT",
                    "status": "Ready",
                    "trend": "stable",
                    "value": "View",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "asset_kpi_3",
                    "kpiName": "Track updated tag of DT to Consumer",
                    "status": "Ready",
                    "trend": "stable",
                    "value": "View",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "asset_kpi_4",
                    "kpiName": "Mapping Accuracy",
                    "status": "Ready",
                    "trend": "stable",
                    "value": "View",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "asset_kpi_5",
                    "kpiName": "DT-to-meter mapping accuracy",
                    "status": "Ready",
                    "trend": "stable",
                    "value": "View",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "asset_kpi_6",
                    "kpiName": "Mismatch analysis",
                    "status": "Ready",
                    "trend": "stable",
                    "value": "View",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "asset_kpi_7",
                    "kpiName": "Correctly mapped meters (%)",
                    "status": "Ready",
                    "trend": "stable",
                    "value": "View",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "asset_kpi_8",
                    "kpiName": "Incorrectly mapped meters requiring correction (%)",
                    "status": "Ready",
                    "trend": "stable",
                    "value": "View",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "asset_kpi_9",
                    "kpiName": "Track updated effective dated mapping",
                    "status": "Ready",
                    "trend": "stable",
                    "value": "View",
                    "dashboard": "advanced_analytics"
                }
            ],
            "issues": {
                "total": 40,
                "attention": 15
            },
            "needsAttention": [
                "SAIDI",
                "SAIFI",
                "Number of Outages (Frequency)",
                "Duration of Outages (Minutes)",
                "Overload / MD Breach Risk",
                "Low-voltage pockets",
                "Number of Tamper Alerts (Cover Open)",
                "Number of Tamper Alerts (External Magnet)",
                "Number of Tamper Alerts (Neutral Disturbance)",
                "Number of Tamper Alerts (Neutral Missing)"
            ],
            "workingWell": [
                "MAIFI",
                "Consumer Service Reliability Score",
                "Composite Reliability Score",
                "Composite Efficiency Score",
                "Communication health issues",
                "Power factor deterioration",
                "Data quality issues",
                "Consumption spikes/drops",
                "Phase imbalance reduced by minimum 30%"
            ],
            "trend": [
                {
                    "name": "Jan",
                    "value": 20
                },
                {
                    "name": "Feb",
                    "value": 23
                },
                {
                    "name": "Mar",
                    "value": 25
                },
                {
                    "name": "Apr",
                    "value": 27
                },
                {
                    "name": "May",
                    "value": 26
                },
                {
                    "name": "Jun",
                    "value": 25
                }
            ]
        },
        {
            "id": "dept_4",
            "name": "Technical",
            "impactStatement": "Technical performance is at risk with 4 critical items.",
            "kpis": 17,
            "kpiList": [
                {
                    "id": "kpi_4535",
                    "kpiName": "DT Load (kVA)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "98%",
                    "dashboard": "load_management"
                },
                {
                    "id": "kpi_6818",
                    "kpiName": "Signal strength statistics",
                    "status": "Active",
                    "trend": "stable",
                    "value": "94%",
                    "dashboard": "to_be_on_hold"
                },
                {
                    "id": "kpi_6539",
                    "kpiName": "Packet loss percentage",
                    "status": "Active",
                    "trend": "down",
                    "value": "2.5%",
                    "dashboard": "to_be_on_hold"
                },
                {
                    "id": "kpi_8694",
                    "kpiName": "Communication retry counts",
                    "status": "Good",
                    "trend": "stable",
                    "value": "97%",
                    "dashboard": "to_be_on_hold"
                },
                {
                    "id": "kpi_3442",
                    "kpiName": "Non-reporting meters (>24 hours)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "95%",
                    "dashboard": "to_be_on_hold"
                },
                {
                    "id": "kpi_4516",
                    "kpiName": "Communication technology performance (RF/GPRS/PLC)",
                    "status": "Good",
                    "trend": "stable",
                    "value": "90%",
                    "dashboard": "to_be_on_hold"
                }
            ],
            "issues": {
                "total": 17,
                "attention": 5
            },
            "needsAttention": [
                "DT Load (kVA)",
                "Non-reporting meters (>24 hours)",
                "Packet loss percentage"
            ],
            "workingWell": [
                "Communication retry counts",
                "Communication technology performance (RF/GPRS/PLC)"
            ],
            "trend": [
                {
                    "name": "Jan",
                    "value": 57
                },
                {
                    "name": "Feb",
                    "value": 60
                },
                {
                    "name": "Mar",
                    "value": 62
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
                    "value": 62
                }
            ]
        },
        {
            "id": "dept_5",
            "name": "Advanced Analytics",
            "impactStatement": "Advanced Analytics performance is at risk with 8 critical items.",
            "kpis": 17,
            "kpiList": [
                {
                    "id": "kpi_9681",
                    "kpiName": "Auto-indexing consumers and DTRs for correct mapping",
                    "status": "Active",
                    "trend": "stable",
                    "value": "87%",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "kpi_1208",
                    "kpiName": "Track updated tag of Feeders to DTs",
                    "status": "Active",
                    "trend": "stable",
                    "value": "96%",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "kpi_3587",
                    "kpiName": "Track updated tag of DT to Consumers",
                    "status": "Active",
                    "trend": "stable",
                    "value": "80%",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "kpi_9570",
                    "kpiName": "Track updated effective dated mapping",
                    "status": "Active",
                    "trend": "stable",
                    "value": "94%",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "kpi_5417",
                    "kpiName": "Mapping Accuracy (95%)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "93%",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "kpi_7118",
                    "kpiName": "DT-to-meter mapping accuracy",
                    "status": "Active",
                    "trend": "stable",
                    "value": "97%",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "kpi_5180",
                    "kpiName": "% meters pending field verification (<5%)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "95%",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "kpi_1357",
                    "kpiName": "Confidence scoring (High/Medium/Low)",
                    "status": "Good",
                    "trend": "stable",
                    "value": "88%",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "kpi_6825",
                    "kpiName": "Total assets tracked (Meters/Feeders/DTs)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "97%",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "kpi_3689",
                    "kpiName": "Auto-identify and track overloaded assets (DT/Feeder)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "85%",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "kpi_1977",
                    "kpiName": "Mismatch analysis (Feeder→DT, DT→Meter)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "91%",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "kpi_3359",
                    "kpiName": "Correctly mapped meters (Consumer Count)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "93%",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "kpi_9644",
                    "kpiName": "Incorrectly mapped meters requiring correction (Consumer Count)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "91%",
                    "dashboard": "advanced_analytics"
                },
                {
                    "id": "kpi_4811",
                    "kpiName": "Transformer / Feeder utilization rate (% of rated capacity)",
                    "status": "Active",
                    "trend": "stable",
                    "value": "96%",
                    "dashboard": "advanced_analytics"
                }
            ],
            "issues": {
                "total": 17,
                "attention": 8
            },
            "needsAttention": [
                "Auto-indexing consumers and DTRs for correct mapping",
                "Track updated tag of Feeders to DTs",
                "Track updated tag of consumers to DTs",
                "Re-index consumer/DTR data for correct past-period T&D loss",
                "Mapping Accuracy"
            ],
            "workingWell": [
                "Confidence scoring (High/Medium/Low)",
                "Correction cycle time (avg days)"
            ],
            "trend": [
                {
                    "name": "Jan",
                    "value": 41
                },
                {
                    "name": "Feb",
                    "value": 44
                },
                {
                    "name": "Mar",
                    "value": 46
                },
                {
                    "name": "Apr",
                    "value": 48
                },
                {
                    "name": "May",
                    "value": 47
                },
                {
                    "name": "Jun",
                    "value": 46
                }
            ]
        },
        {
            "id": "dept_6",
            "name": "Business",
            "impactStatement": "Comprehensive monitoring across 8 operational modules.",
            "kpis": 24,
            "kpiList": [
                { "id": "kpi_biz_1", "kpiName": "MI-Progress (Total & Category wise)", "status": "Stable", "trend": "stable", "value": "92%" },
                { "id": "kpi_biz_2", "kpiName": "Defective Meters", "status": "Warning", "trend": "up", "value": "145" },
                { "id": "kpi_biz_3", "kpiName": "Never / Non-comm Status", "status": "Critical", "trend": "down", "value": "1.2%" },
                { "id": "kpi_biz_4", "kpiName": "O&M Ticket Closure Avg. Time", "status": "Warning", "trend": "stable", "value": "24h" },
                { "id": "kpi_biz_5", "kpiName": "Revenue realized (Total & Category wise)", "status": "Stable", "trend": "up", "value": "₹520 Cr" },
                { "id": "kpi_biz_6", "kpiName": "Revenue not realized ageing", "status": "Critical", "trend": "up", "value": "15d+" },
                { "id": "kpi_biz_7", "kpiName": "Meters Journey Avg time", "status": "Warning", "trend": "stable", "value": "4.5d" },
                { "id": "kpi_biz_8", "kpiName": "Inventory Utilization rate", "status": "Good", "trend": "up", "value": "88%" }
            ],
            "issues": {
                "total": 14,
                "attention": 4
            },
            "needsAttention": [
                "Never / Non-comm Status",
                "Revenue not realized ageing",
                "O&M Not closed ticket Ageing",
                "Defective Meters"
            ],
            "workingWell": [
                "MI-Progress",
                "Inventory Utilization rate",
                "O&M Ticket Closed Analysis"
            ],
            "trend": [
                { "name": "Jan", "value": 72 },
                { "name": "Feb", "value": 75 },
                { "name": "Mar", "value": 78 },
                { "name": "Apr", "value": 80 },
                { "name": "May", "value": 79 },
                { "name": "Jun", "value": 78 }
            ]
        }
    ]
};