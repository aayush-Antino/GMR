export const executiveDummyData = {
    "summary": {
        "totalKPIs": 105,
        "totalIssues": 104,
        "critical": 35,
        "high": 51,
        "departments": 5,
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
            "summary": "Operation stability is concerning.",
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
                    "id": "kpi_2224",
                    "kpiName": "Feeder Loss (%)",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "95%"
                },
                {
                    "id": "kpi_7665",
                    "kpiName": "DT (Distribution Transformer) Loss (%)",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "91%"
                },
                {
                    "id": "kpi_1197",
                    "kpiName": "LT Loss (%)",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "97%"
                },
                {
                    "id": "kpi_9096",
                    "kpiName": "Billing Efficiency (%)",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "82%"
                },
                {
                    "id": "kpi_3493",
                    "kpiName": "Collection Efficiency (%)",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "90%"
                },
                {
                    "id": "kpi_1534",
                    "kpiName": "AT&C Loss (%)",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "91%"
                },
                {
                    "id": "kpi_9312",
                    "kpiName": "Top X Best/Worst Feeders/DTs",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "96%"
                },
                {
                    "id": "kpi_5072",
                    "kpiName": "Top High Loss DTs / Feeders",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "92%"
                },
                {
                    "id": "kpi_9765",
                    "kpiName": "Top High-Loss Feeders / DTs",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "84%"
                },
                {
                    "id": "kpi_4171",
                    "kpiName": "Revenue Recovery Improvement (%)",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "92%"
                }
            ],
            "issues": {
                "critical": 5,
                "high": 5,
                "medium": 0,
                "low": 0
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
            "name": "Operation",
            "impactStatement": "Operation performance is at risk with 9 critical items.",
            "kpis": 31,
            "kpiList": [
                {
                    "id": "kpi_2211",
                    "kpiName": "SAIDI",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "86%"
                },
                {
                    "id": "kpi_3153",
                    "kpiName": "SAIFI",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "92%"
                },
                {
                    "id": "kpi_5017",
                    "kpiName": "CAIDI",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "82%"
                },
                {
                    "id": "kpi_5905",
                    "kpiName": "CAIFI",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "93%"
                },
                {
                    "id": "kpi_8811",
                    "kpiName": "MAIFI",
                    "status": "Good",
                    "trend": "stable",
                    "value": "82%"
                },
                {
                    "id": "kpi_9360",
                    "kpiName": "Number of Outages (Frequency)",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "97%"
                },
                {
                    "id": "kpi_9593",
                    "kpiName": "Duration of Outages (Minutes)",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "89%"
                },
                {
                    "id": "kpi_1970",
                    "kpiName": "DT/Feeder Reliability Trends (Monthly/Yearly)",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "89%"
                },
                {
                    "id": "kpi_5041",
                    "kpiName": "DTs with High Failure Rate",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "86%"
                },
                {
                    "id": "kpi_9111",
                    "kpiName": "Detection Accuracy",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "99%"
                },
                {
                    "id": "kpi_3791",
                    "kpiName": "False Positive Rate",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "84%"
                },
                {
                    "id": "kpi_6406",
                    "kpiName": "Field inspection hit-rate",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "100%"
                },
                {
                    "id": "kpi_8464",
                    "kpiName": "MTTI",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "88%"
                },
                {
                    "id": "kpi_4011",
                    "kpiName": "MTTR",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "98%"
                },
                {
                    "id": "kpi_8240",
                    "kpiName": "Alert response time",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "86%"
                },
                {
                    "id": "kpi_3073",
                    "kpiName": "Planned outage suppression rate",
                    "status": "Good",
                    "trend": "stable",
                    "value": "84%"
                },
                {
                    "id": "kpi_9433",
                    "kpiName": "Feeders with Maximum Outages",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "98%"
                },
                {
                    "id": "kpi_6512",
                    "kpiName": "Reliability Improvement Trend",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "87%"
                },
                {
                    "id": "kpi_1894",
                    "kpiName": "Consumer Service Reliability Score",
                    "status": "Good",
                    "trend": "stable",
                    "value": "93%"
                },
                {
                    "id": "kpi_8248",
                    "kpiName": "Composite Reliability Score",
                    "status": "Good",
                    "trend": "stable",
                    "value": "90%"
                },
                {
                    "id": "kpi_2605",
                    "kpiName": "Composite Efficiency Score",
                    "status": "Good",
                    "trend": "stable",
                    "value": "93%"
                },
                {
                    "id": "kpi_4968",
                    "kpiName": "Voltage Deviation (%)",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "88%"
                },
                {
                    "id": "kpi_1387",
                    "kpiName": "Voltage Deviation Index (VDI)",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "96%"
                },
                {
                    "id": "kpi_5216",
                    "kpiName": "Frequency Deviation Index (FDI)",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "92%"
                },
                {
                    "id": "kpi_8157",
                    "kpiName": "Voltage Fluctuation Index",
                    "status": "Good",
                    "trend": "stable",
                    "value": "96%"
                },
                {
                    "id": "kpi_4950",
                    "kpiName": "Voltage Unbalance Index",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "94%"
                },
                {
                    "id": "kpi_2985",
                    "kpiName": "Voltage Drop (V)",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "81%"
                },
                {
                    "id": "kpi_6195",
                    "kpiName": "Low Power Factor (%) by DT/Feeder",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "97%"
                },
                {
                    "id": "kpi_5786",
                    "kpiName": "Meter Current Unbalance (%)",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "99%"
                },
                {
                    "id": "kpi_4445",
                    "kpiName": "% Time beyond voltage tolerance band",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "92%"
                },
                {
                    "id": "kpi_4139",
                    "kpiName": "% Time with unacceptable current imbalance (>10%)",
                    "status": "Good",
                    "trend": "stable",
                    "value": "96%"
                }
            ],
            "issues": {
                "critical": 9,
                "high": 15,
                "medium": 7,
                "low": 0
            },
            "needsAttention": [
                "SAIDI",
                "SAIFI",
                "CAIDI",
                "CAIFI",
                "Number of Outages (Frequency)"
            ],
            "workingWell": [
                "MAIFI",
                "Planned outage suppression rate",
                "Consumer Service Reliability Score",
                "Composite Reliability Score",
                "Composite Efficiency Score"
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
            "kpis": 30,
            "kpiList": [
                {
                    "id": "kpi_3085",
                    "kpiName": "Low-voltage pockets",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "86%"
                },
                {
                    "id": "kpi_5750",
                    "kpiName": "Number of Tamper Alerts (Cover Open)",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "94%"
                },
                {
                    "id": "kpi_8753",
                    "kpiName": "Number of Tamper Alerts (External Magnet)",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "93%"
                },
                {
                    "id": "kpi_6486",
                    "kpiName": "Number of Tamper Alerts (Neutral Disturbance)",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "93%"
                },
                {
                    "id": "kpi_1938",
                    "kpiName": "Number of Tamper Alerts (Neutral Missing)",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "87%"
                },
                {
                    "id": "kpi_2002",
                    "kpiName": "Consumption Comparison - Energy Gap (kWh)",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "82%"
                },
                {
                    "id": "kpi_2646",
                    "kpiName": "Total anomalies detected (by time period)",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "81%"
                },
                {
                    "id": "kpi_7057",
                    "kpiName": "Anomalies by type",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "85%"
                },
                {
                    "id": "kpi_1021",
                    "kpiName": "Anomalies by severity",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "97%"
                },
                {
                    "id": "kpi_3345",
                    "kpiName": "Anomalies by geography",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "82%"
                },
                {
                    "id": "kpi_2749",
                    "kpiName": "Anomaly trends (daily/weekly/monthly)",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "87%"
                },
                {
                    "id": "kpi_4292",
                    "kpiName": "Repeat anomaly tracking",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "98%"
                },
                {
                    "id": "kpi_8045",
                    "kpiName": "Theft Suspect Flags",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "94%"
                },
                {
                    "id": "kpi_1635",
                    "kpiName": "% Reduction in Theft Events (monthly trend)",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "98%"
                },
                {
                    "id": "kpi_1198",
                    "kpiName": "Theft / Load diversion",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "84%"
                },
                {
                    "id": "kpi_8572",
                    "kpiName": "Areas with Highest Theft Risk",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "85%"
                },
                {
                    "id": "kpi_4706",
                    "kpiName": "Communication health issues",
                    "status": "Good",
                    "trend": "stable",
                    "value": "96%"
                },
                {
                    "id": "kpi_5348",
                    "kpiName": "Tamper sequence detection",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "85%"
                },
                {
                    "id": "kpi_1882",
                    "kpiName": "Voltage/Current imbalance",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "99%"
                },
                {
                    "id": "kpi_1773",
                    "kpiName": "Power factor deterioration",
                    "status": "Good",
                    "trend": "stable",
                    "value": "98%"
                },
                {
                    "id": "kpi_4945",
                    "kpiName": "Overload / MD breach risk",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "93%"
                },
                {
                    "id": "kpi_1678",
                    "kpiName": "Hidden outage pockets",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "85%"
                },
                {
                    "id": "kpi_4663",
                    "kpiName": "Data quality issues",
                    "status": "Good",
                    "trend": "stable",
                    "value": "87%"
                },
                {
                    "id": "kpi_8459",
                    "kpiName": "Reverse flow",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "91%"
                },
                {
                    "id": "kpi_5010",
                    "kpiName": "Consumption spikes/drops",
                    "status": "Good",
                    "trend": "stable",
                    "value": "81%"
                },
                {
                    "id": "kpi_4875",
                    "kpiName": "Phase-level mapping accuracy",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "80%"
                },
                {
                    "id": "kpi_7124",
                    "kpiName": "Phase imbalance reduced by minimum 30%",
                    "status": "Good",
                    "trend": "stable",
                    "value": "93%"
                },
                {
                    "id": "kpi_8695",
                    "kpiName": "Real-time phase load monitoring per transformer",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "87%"
                },
                {
                    "id": "kpi_2343",
                    "kpiName": "Imbalance alerts when threshold exceeded",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "91%"
                },
                {
                    "id": "kpi_9601",
                    "kpiName": "Phase transfer recommendations (what-if)",
                    "status": "Good",
                    "trend": "stable",
                    "value": "80%"
                }
            ],
            "issues": {
                "critical": 9,
                "high": 15,
                "medium": 5,
                "low": 1
            },
            "needsAttention": [
                "Low-voltage pockets",
                "Number of Tamper Alerts (Cover Open)",
                "Number of Tamper Alerts (External Magnet)",
                "Number of Tamper Alerts (Neutral Disturbance)",
                "Number of Tamper Alerts (Neutral Missing)"
            ],
            "workingWell": [
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
                    "kpiName": "% DT Peak Loading",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "83%"
                },
                {
                    "id": "kpi_4161",
                    "kpiName": "% DT Loading",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "94%"
                },
                {
                    "id": "kpi_4535",
                    "kpiName": "DT Load (kVA)",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "98%"
                },
                {
                    "id": "kpi_3897",
                    "kpiName": "% Loading Bands",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "99%"
                },
                {
                    "id": "kpi_8016",
                    "kpiName": "Top Overloaded DTs / Feeders",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "92%"
                },
                {
                    "id": "kpi_1055",
                    "kpiName": "Load Rise Trend",
                    "status": "Good",
                    "trend": "stable",
                    "value": "95%"
                },
                {
                    "id": "kpi_6072",
                    "kpiName": "Consumers exceeding sanctioned load",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "99%"
                },
                {
                    "id": "kpi_4183",
                    "kpiName": "% Consumers with Load Violation",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "81%"
                },
                {
                    "id": "kpi_6069",
                    "kpiName": "Load Duration Curve & Asset Loading Spread",
                    "status": "Good",
                    "trend": "stable",
                    "value": "98%"
                },
                {
                    "id": "kpi_5664",
                    "kpiName": "DT Failure Rate (%)",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "87%"
                },
                {
                    "id": "kpi_6133",
                    "kpiName": "Top Overloaded Assets",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "85%"
                },
                {
                    "id": "kpi_6165",
                    "kpiName": "Top Power Quality Issues",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "82%"
                },
                {
                    "id": "kpi_6818",
                    "kpiName": "Signal strength statistics",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "94%"
                },
                {
                    "id": "kpi_6539",
                    "kpiName": "Packet loss percentage",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "88%"
                },
                {
                    "id": "kpi_8694",
                    "kpiName": "Communication retry counts",
                    "status": "Good",
                    "trend": "stable",
                    "value": "97%"
                },
                {
                    "id": "kpi_3442",
                    "kpiName": "Non-reporting meters (>24 hours)",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "95%"
                },
                {
                    "id": "kpi_4516",
                    "kpiName": "Communication technology performance (RF/GPRS/PLC)",
                    "status": "Good",
                    "trend": "stable",
                    "value": "90%"
                }
            ],
            "issues": {
                "critical": 4,
                "high": 9,
                "medium": 4,
                "low": 0
            },
            "needsAttention": [
                "% DT Peak Loading",
                "% DT Loading",
                "DT Load (kVA)",
                "% Loading Bands",
                "Top Overloaded DTs / Feeders"
            ],
            "workingWell": [
                "Load Rise Trend",
                "Load Duration Curve & Asset Loading Spread",
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
                    "status": "Critical",
                    "trend": "stable",
                    "value": "87%"
                },
                {
                    "id": "kpi_1208",
                    "kpiName": "Track updated tag of DTs to Feeders",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "96%"
                },
                {
                    "id": "kpi_3587",
                    "kpiName": "Track updated tag of consumers to DTs",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "80%"
                },
                {
                    "id": "kpi_9570",
                    "kpiName": "Re-index consumer/DTR data for correct past-period T&D loss",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "94%"
                },
                {
                    "id": "kpi_5417",
                    "kpiName": "Mapping Accuracy (95%)",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "93%"
                },
                {
                    "id": "kpi_7118",
                    "kpiName": "DT-to-meter mapping accuracy",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "97%"
                },
                {
                    "id": "kpi_5180",
                    "kpiName": "% meters pending field verification (<5%)",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "95%"
                },
                {
                    "id": "kpi_1357",
                    "kpiName": "Confidence scoring (High/Medium/Low)",
                    "status": "Good",
                    "trend": "stable",
                    "value": "88%"
                },
                {
                    "id": "kpi_6825",
                    "kpiName": "Total assets tracked (Meters/Feeders/DTs)",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "97%"
                },
                {
                    "id": "kpi_3689",
                    "kpiName": "Overloaded DTs identified and monitored",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "85%"
                },
                {
                    "id": "kpi_1977",
                    "kpiName": "Mismatch analysis (Feeder?DT, DT?Meter)",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "91%"
                },
                {
                    "id": "kpi_3359",
                    "kpiName": "Correctly mapped meters (%)",
                    "status": "Critical",
                    "trend": "stable",
                    "value": "93%"
                },
                {
                    "id": "kpi_9644",
                    "kpiName": "Incorrectly mapped meters requiring correction (%)",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "91%"
                },
                {
                    "id": "kpi_2396",
                    "kpiName": "Verification pending count",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "89%"
                },
                {
                    "id": "kpi_3480",
                    "kpiName": "Correction cycle time (avg days)",
                    "status": "Good",
                    "trend": "stable",
                    "value": "94%"
                },
                {
                    "id": "kpi_4811",
                    "kpiName": "Transformer utilization rate (% of rated capacity)",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "96%"
                },
                {
                    "id": "kpi_7221",
                    "kpiName": "Field verification completion rate",
                    "status": "Watchlist",
                    "trend": "stable",
                    "value": "98%"
                }
            ],
            "issues": {
                "critical": 8,
                "high": 7,
                "medium": 2,
                "low": 0
            },
            "needsAttention": [
                "Auto-indexing consumers and DTRs for correct mapping",
                "Track updated tag of DTs to Feeders",
                "Track updated tag of consumers to DTs",
                "Re-index consumer/DTR data for correct past-period T&D loss",
                "Mapping Accuracy (95%)"
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
        }
    ]
};