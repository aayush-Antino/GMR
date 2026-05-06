export const dashboardData = {
    "advanced_analytics": [
        {
            "name": "Auto-indexing consumers and DTRs for correct mapping",
            "department": "Advanced Analytics",
            "description": "Correct T&D loss calculations",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI/Process" },
                { "label": "Key IDs", "value": "Meter IDs (partial)" },
                { "label": "Source", "value": "Authoritative topology master + change history" },
                { "label": "Priority", "value": "P0" },
                { "label": "Owner", "value": "Deepanshu" },
                { "label": "Module", "value": "Auto-Indexing / Mapping" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Maintain mapping tables + change history; reconcile on outage events"
        },
        {
            "name": "Track updated tag of Feeders to DTs",
            "department": "Advanced Analytics",
            "description": "Correct hierarchy over time",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI/Process" },
                { "label": "Key IDs", "value": "None" },
                { "label": "Source", "value": "DT→Feeder mapping + audit trail" },
                { "label": "Priority", "value": "P0" },
                { "label": "Owner", "value": "Deepanshu" },
                { "label": "Module", "value": "Auto-Indexing / Mapping" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Effective-dated DT→Feeder mapping"
        },
        {
            "name": "Track updated tag of DT to Consumers",
            "department": "Advanced Analytics",
            "description": "Correct consumer grouping",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI/Process" },
                { "label": "Key IDs", "value": "None" },
                { "label": "Source", "value": "Consumer→DT mapping + audit trail" },
                { "label": "Priority", "value": "P0" },
                { "label": "Owner", "value": "Deepanshu" },
                { "label": "Module", "value": "Auto-Indexing / Mapping" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Effective-dated Consumer→DT mapping"
        },
        {
            "name": "Track updated effective dated mapping",
            "department": "Advanced Analytics",
            "description": "Historical accuracy",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI/Process" },
                { "label": "Key IDs", "value": "None" },
                { "label": "Source", "value": "Historical mapping snapshots + backfill mandate" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Deepanshu" },
                { "label": "Module", "value": "Auto-Indexing / Mapping" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Backfill using effective-dated mapping snapshots"
        },
        {
            "name": "Mapping Accuracy",
            "department": "Advanced Analytics",
            "description": "Data Mapping System",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "None" },
                { "label": "Source", "value": "Ground truth + verification outcomes" },
                { "label": "Priority", "value": "P0" },
                { "label": "Owner", "value": "Deepanshu" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Correct mappings / total ×100"
        },
        {
            "name": "DT-to-meter mapping accuracy",
            "department": "Advanced Analytics",
            "description": "DT grouping accuracy",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "None" },
                { "label": "Source", "value": "Ground truth DT mapping" },
                { "label": "Priority", "value": "P0" },
                { "label": "Owner", "value": "Deepanshu" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Correct DT mappings / total ×100"
        },
        {
            "name": "% meters pending field verification (<5%)",
            "department": "Advanced Analytics",
            "description": "Backlog control",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "None" },
                { "label": "Source", "value": "Field workflow statuses" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Deepanshu" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Pending / total meters ×100"
        },
        {
            "name": "Confidence scoring (High/Medium/Low)",
            "department": "Advanced Analytics",
            "description": "Communicate certainty",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "None" },
                { "label": "Source", "value": "Confidence model inputs + labels" },
                { "label": "Priority", "value": "P2" },
                { "label": "Owner", "value": "Deepanshu" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Confidence score banding"
        },
        {
            "name": "Total assets tracked (Meters/Feeders/DTs)",
            "department": "Advanced Analytics",
            "description": "Inventory visibility",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "Meter IDs only" },
                { "label": "Source", "value": "Asset registry" },
                { "label": "Priority", "value": "P0" },
                { "label": "Owner", "value": "Deepanshu" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Meters: COUNT(DISTINCT newMeterNumber); Feeders: COUNT(DISTINCT FeederCode); DTs: COUNT(DISTINCT DTRCode)"
        },
        {
            "name": "Overloaded DTs identified and monitored",
            "department": "Advanced Analytics",
            "description": "Asset risk",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "None" },
                { "label": "Source", "value": "DT capacity + load + mapping" },
                { "label": "Priority", "value": "P0" },
                { "label": "Owner", "value": "Deepanshu" },
                { "label": "Note", "value": "We need Master Profile (Rated Capacity). Recommendation: need to build bucket." }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "% Loading = (√3 × Vavg × Iavg /1000 ÷ Rated kVA) ×100 → Flag if >60%, 80% , 100%"
        },
        {
            "name": "Mismatch analysis (Feeder→DT, DT→Meter)",
            "department": "Advanced Analytics",
            "description": "Detect mapping errors",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "None" },
                { "label": "Source", "value": "Current & corrected mappings" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Deepanshu" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Compare current vs corrected mapping; count mismatches"
        },
        {
            "name": "Correctly mapped meters (%)",
            "department": "Advanced Analytics",
            "description": "Completion",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "None" },
                { "label": "Source", "value": "Mapping verification outcomes" },
                { "label": "Priority", "value": "P0" },
                { "label": "Owner", "value": "Deepanshu" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Correct mappings / total meters ×100"
        },
        {
            "name": "Incorrectly mapped meters requiring correction (%)",
            "department": "Advanced Analytics",
            "description": "Reduce errors",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "None" },
                { "label": "Source", "value": "Mismatch list + validation" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Deepanshu" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Incorrect / total ×100"
        },
        {
            "name": "Transformer utilization rate (% of rated capacity)",
            "department": "Advanced Analytics",
            "description": "Utilization",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "None" },
                { "label": "Source", "value": "DT capacity + load" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Vaibhav, Anshika" },
                { "label": "Note", "value": "Rated capacity will come from the DTR rating (WFM)" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "(Actual kVA Load ÷ Rated Capacity) ×100"
        }
    ],
    "operation_analytics": [
        {
            "name": "Tamper sequence detection",
            "department": "Analytics",
            "description": "Tamper detection",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Key IDs", "value": "Status byte (insufficient)" },
                { "label": "Source", "value": "Event logs with codes & timestamps" },
                { "label": "Priority", "value": "P0" },
                { "label": "Owner", "value": "Arshia" },
                { "label": "Note", "value": "Event profile + AI optimization" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Pattern detection within time window (e.g., Power Fail → Cover Open → Reverse Current)"
        },
        {
            "name": "Voltage/Current imbalance",
            "department": "Analytics",
            "description": "Phase imbalance",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Key IDs", "value": "Some phase V/I fields" },
                { "label": "Source", "value": "Consistent per-phase V/I + phase mapping" },
                { "label": "Priority", "value": "High" },
                { "label": "Owner", "value": "Arshia" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Phase unbalance > threshold for N intervals"
        },
        {
            "name": "Power factor deterioration",
            "department": "Analytics",
            "description": "Efficiency",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Key IDs", "value": "kVAh only (partial)" },
                { "label": "Source", "value": "PF register or kW/kvar/kvarh" },
                { "label": "Priority", "value": "P2" },
                { "label": "Owner", "value": "Arshia" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "PF = kWh ÷ kVAh; Flag if PF <0.85 sustained"
        },
        {
            "name": "Hidden outage pockets",
            "department": "Analytics",
            "description": "Outage detection",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Key IDs", "value": "Zero kWh; voltage (if present)" },
                { "label": "Source", "value": "OMS outage feed + planned outage calendar" },
                { "label": "Priority", "value": "High" },
                { "label": "Owner", "value": "Arshia" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Zero kWh (not planned) + voltage drop; comms ok"
        },
        {
            "name": "Data quality issues",
            "department": "Analytics",
            "description": "Data SLA",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Key IDs", "value": "Load Duration Curve" },
                { "label": "Source", "value": "Interval definition" },
                { "label": "Priority", "value": "P2" },
                { "label": "Owner", "value": "Arshia" },
                { "label": "Note", "value": "Confirm block interval & expected blocks" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Flatline>6h; missing blocks; timestamp drift"
        },
        {
            "name": "Reverse flow",
            "department": "Analytics",
            "description": "Unauthorized export",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Key IDs", "value": "Export kWh" },
                { "label": "Source", "value": "Net-metering registry/approvals" },
                { "label": "Priority", "value": "Critical" },
                { "label": "Owner", "value": "Arshia" },
                { "label": "Note", "value": "Provide net-meter registry flag" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Export kWh > threshold (Solar Export)"
        },
        {
            "name": "Consumption spikes/drops",
            "department": "Analytics",
            "description": "Anomaly detection",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Key IDs", "value": "Historical kWh" },
                { "label": "Source", "value": "Peer baselines optional" },
                { "label": "Priority", "value": "P2" },
                { "label": "Owner", "value": "Arshia" },
                { "label": "Note", "value": "Baseline=Avg. of theft, event profile needed" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Spike/drop >5σ from baseline"
        },
        // {
        //     "name": "Phase-level mapping accuracy",
        //     "department": "Analytics",
        //     "description": "Phase allocation correctness",
        //     "status": "Ready",
        //     "analysisItems": [
        //         { "label": "Entity", "value": "KPI/Anomaly" },
        //         { "label": "Key IDs", "value": "Partial phase V/I fields" },
        //         { "label": "Source", "value": "Phase mapping master + validation" },
        //         { "label": "Priority", "value": "P1" },
        //         { "label": "Owner", "value": "Deepanshu" },
        //         { "label": "Note", "value": "Mapping required" }
        //     ],
        //     "qualityHeader": "Calculation Logic",
        //     "qualityDescription": "Correct phase mappings / total ×100"
        // },
        {
            "name": "Phase imbalance reduced by minimum 30%",
            "department": "Analytics",
            "description": "Reduce imbalance",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI/Anomaly" },
                { "label": "Key IDs", "value": "Per-phase V/I (if available)" },
                { "label": "Source", "value": "Baseline period + phase mapping" },
                { "label": "Priority", "value": "P2" },
                { "label": "Owner", "value": "Arshia" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Baseline imbalance − current imbalance (target 30%)"
        },
        {
            "name": "Real-time phase load monitoring per transformer",
            "department": "Analytics",
            "description": "Operational monitoring",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI/Anomaly" },
                { "label": "Key IDs", "value": "None" },
                { "label": "Source", "value": "Topology + per-phase V/I" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Arshia" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Phase kVA = Vphase × Iphase ÷1000 "
        },
        {
            "name": "Imbalance alerts when threshold exceeded",
            "department": "Analytics",
            "description": "Alerting",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI/Anomaly" },
                { "label": "Key IDs", "value": "Per-phase V/I (if available)" },
                { "label": "Source", "value": "Consistent per-phase data + thresholds" },
                { "label": "Priority", "value": "High" },
                { "label": "Owner", "value": "Arshia" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Phase imbalance > threshold for N intervals"
        },
        // {
        //     "name": "Phase transfer recommendations (what-if)",
        //     "department": "Analytics",
        //     "description": "Operational planning",
        //     "status": "Ready",
        //     "analysisItems": [
        //         { "label": "Entity", "value": "KPI" },
        //         { "label": "Key IDs", "value": "None" },
        //         { "label": "Source", "value": "Network model + phase mapping + constraints" },
        //         { "label": "Priority", "value": "P2" },
        //         { "label": "Owner", "value": "Deepanshu" },
        //         { "label": "Note", "value": "We need consumer phase mapping" }
        //     ],
        //     "qualityHeader": "Calculation Logic",
        //     "qualityDescription": "Imbalance % = (Max Phase − Avg Phase) ÷ Avg Phase ×100 "
        // }
    ],
    "finance": [
        {
            "name": "Billing Efficiency (%)",
            "department": "Finance",
            "description": "Track billing effectiveness",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "None" },
                { "label": "Source", "value": "Billing extracts + supply metering" },
                { "label": "Priority", "value": "P0" },
                { "label": "Owner", "value": "Vaibhav, Anshika" },
                { "label": "Note", "value": "Need Geographic Mapping, Indexing and Mapping Required." }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "(Billed Energy ÷ Total Energy Supplied) ×100"
        },
        {
            "name": "Top X Best/Worst Feeders/DTs",
            "department": "Finance",
            "description": "Prioritize worst assets",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "Feeder/DT metering exists; consumer mapping exists" },
                { "label": "Source", "value": "Topology master + meter coverage confirmation" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Vaibhav, Anshika" },
                { "label": "Note", "value": "Can rank on partial coverage immediately; Indexing and Mapping Required." }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Rank by loss%, reliability, overload, PQ violations"
        },
        {
            "name": "Top High Loss DTs / Feeders",
            "department": "Finance",
            "description": "Target interventions",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "Loss KPIs possible where Feeder/DT loss is computable" },
                { "label": "Source", "value": "Validated topology master + complete Feeder/DT meter coverage" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Vaibhav, Anshika" },
                { "label": "Note", "value": "Ranking depends on completeness of feeder/DT loss calculations. High loss bucketing is recommended." }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Rank by loss % and energy gap"
        },
        {
            "name": "Top High-Loss Feeders / DTs",
            "department": "Finance",
            "description": "Executive focus",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "None" },
                { "label": "Source", "value": "Feeder/DT meters + topology" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Vaibhav, Anshika" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Rank by loss KPIs"
        }
    ],
    "operation_parameters": [
        {
            "name": "Low-voltage pockets",
            "department": "Analytics",
            "description": "Voltage quality",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Key IDs", "value": "Voltage" },
                { "label": "Source", "value": "Voltage bands + geo mapping optional" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Arshia" },
                { "label": "Note", "value": "Need to make buckets" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Voltage < band for N intervals; cluster by geo"
        }
    ],
    "load_management": [
        {
            "name": "DT Load (kVA)",
            "department": "Technical",
            "description": "DT load monitoring",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "DT meters present; kVAh import available (proxy)" },
                { "label": "Source", "value": "Confirm block interval + provide kVA/kW instantaneous profile (optional)" },
                { "label": "Priority", "value": "P0" },
                { "label": "Owner", "value": "Vaibhav, Anshika" },
                { "label": "Note", "value": "Approx using ΔkVAh; best with instantaneous kVA." }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Direct measurement or proxy via energy delta"
        }
    ],
    "load_management_analytics": [
        {
            "name": "Overload / MD Breach Risk",
            "department": "Analytics",
            "description": "Asset Risk",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Calculation logic", "value": "(Max Demand ÷ Sanctioned Load) × 100; Flag if > 90%" },
                { "label": "Source", "value": "Max Demand (Consumer Block Profile), Sanctioned Load (Consumer Master Profile), and MD Profile/Register (CIS/MDM)" },
                { "label": "Required columns", "value": "Max Demand, Sanctioned Load" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Arshia" },
                { "label": "Status", "value": "Ready and In Progress" },
                { "label": "Anomaly Types", "value": "(11)" }
            ],
            "qualityHeader": "Business Objective",
            "qualityDescription": "Asset Risk"
        }
    ],
    "power_quality": [
        {
            "name": "Voltage Deviation (%)",
            "department": "Operations",
            "description": "Voltage quality",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "Voltage" },
                { "label": "Source", "value": "Utility config: Vnom & bands" },
                { "label": "Priority", "value": "P0" },
                { "label": "Owner", "value": "Vaibhav, Anshika" },
                { "label": "Note", "value": "Nominal voltage 1-phase:240, 3-phase-440, HT-11KV" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "(Measured Voltage− Nominal Voltage)/Nominal Voltage ×100"
        },
        {
            "name": "Voltage Deviation Index (VDI)",
            "department": "Operations",
            "description": "Composite voltage metric",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "Voltage time-series" },
                { "label": "Source", "value": "Define VDI method + bands" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Vaibhav, Anshika" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Aggregate |deviation| over time (mean/p95 etc.)"
        },
        {
            "name": "Voltage Fluctuation Index",
            "department": "Operations",
            "description": "Voltage stability",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "Voltage time-series" },
                { "label": "Source", "value": "Define window + confirm interval" },
                { "label": "Priority", "value": "P2" },
                { "label": "Owner", "value": "Vaibhav, Anshika" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Rolling std-dev/ΔV metrics"
        },
        {
            "name": "Voltage Unbalance Index",
            "department": "Operations",
            "description": "Phase voltage imbalance",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "Vrn/Vyn/Vbn (inconsistent)" },
                { "label": "Source", "value": "Ensure per-phase voltages populated" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Vaibhav, Anshika" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Max phase V deviation / avg ×100"
        },
        {
            "name": "Voltage Drop (V)",
            "department": "Operations",
            "description": "Low voltage magnitude",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "Voltage" },
                { "label": "Source", "value": "Provide Vnom" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Vaibhav, Anshika" },
                { "label": "Note", "value": "Nominal voltage 1-phase:240, 3-phase-440, HT-11KV" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "MAX(0, (230*0.9) - MIN(Voltage,Vrn, Voltage,Vyn, Voltage,Vbn))"
        },
        {
            "name": "Meter Current Unbalance (%)",
            "department": "Operations",
            "description": "Phase current imbalance",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "Ir/Iy/Ib (inconsistent)" },
                { "label": "Source", "value": "Ensure per-phase currents populated" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Vaibhav, Anshika" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Max phase I deviation / avg ×100"
        },
        {
            "name": "% Time beyond voltage tolerance band",
            "department": "Operations",
            "description": "Compliance",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "Voltage + timestamps" },
                { "label": "Source", "value": "Define voltage bands" },
                { "label": "Priority", "value": "P0" },
                { "label": "Owner", "value": "Vaibhav, Anshika" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "(Time Voltage Outside Limits / Total Time) × 100"
        },
        {
            "name": "% Time with unacceptable current imbalance (>10%)",
            "department": "Operations",
            "description": "Compliance (I unbalance)",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "Per-phase current (if present)" },
                { "label": "Source", "value": "Confirm threshold + ensure currents" },
                { "label": "Priority", "value": "P2" },
                { "label": "Owner", "value": "Vaibhav, Anshika" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "(# intervals imbalance>10% / total)×100"
        }
    ],
    "to_be_on_hold": [],
    "theft_analysis": [
        {
            "name": "Consumption Comparison - Energy Gap (kWh)",
            "department": "Analytics",
            "description": "Detect theft/loss pockets",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "KPI" },
                { "label": "Key IDs", "value": "Consumer kWh + DT meters + DTR mapping fields available" },
                { "label": "Config", "value": "Confirm DT meter identifier per DTR (DTRcode) and period alignment" },
                { "label": "Master", "value": "DT meter ↔ DTRcode mapping table (authoritative)" },
                { "label": "Priority", "value": "P0" },
                { "label": "Owners", "value": "Vaibhav, Anshika" },
                { "label": "Note", "value": "Can compute where DT meter-to-DTR mapping is confirmed." }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "DT energy *mf − Σ consumer energy (same period)",
            "chartData": {
                "trendTitle": "Energy Gap Trend (kWh)",
                "trend": [
                    { "name": "Week 1", "value": 1200 },
                    { "name": "Week 2", "value": 1150 },
                    { "name": "Week 3", "value": 1400 },
                    { "name": "Week 4", "value": 1300 }
                ],
                "distTitle": "Gap by DTR (Top 5)",
                "distribution": [
                    { "name": "DTR-01", "value": 450, "color": "#EF4444" },
                    { "name": "DTR-05", "value": 380, "color": "#EF4444" },
                    { "name": "DTR-12", "value": 310, "color": "#F59E0B" },
                    { "name": "DTR-08", "value": 240, "color": "#F59E0B" },
                    { "name": "DTR-22", "value": 180, "color": "#3B82F6" }
                ]
            }
        },
        {
            "name": "Theft Suspect Flags",
            "department": "Analytics",
            "description": "Prioritize suspected theft",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Key IDs", "value": "Import/export kWh; voltage; data gaps" },
                { "label": "Source", "value": "Peer groups + topology + billing + events" },
                { "label": "Priority", "value": "P0" },
                { "label": "Owner", "value": "Arshia" },
                { "label": "Module", "value": "Loss Analytics" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Rules/ML: reverse flow + peer deviation + sudden drop + event patterns"
        },
        {
            "name": "% Reduction in Theft Events (monthly trend)",
            "department": "Analytics",
            "description": "Measure enforcement impact",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Key IDs", "value": "None" },
                { "label": "Source", "value": "Confirmed theft outcomes + history" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Arshia" },
                { "label": "Note", "value": "Baseline=Avg. of theft, event profile needed" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "((Baseline Theft − Current Theft) ÷ Baseline Theft) ×100 "
        },
        {
            "name": "Theft / Load diversion",
            "department": "Analytics",
            "description": "Revenue protection",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Key IDs", "value": "Consumer + DT/Feeder energy readings exist" },
                { "label": "Source", "value": "Billing + event logs for bypass/tamper + peer grouping" },
                { "label": "Priority", "value": "Critical" },
                { "label": "Owner", "value": "Arshia" },
                { "label": "Note", "value": "Energy gap/peer deviation possible now; confirmation needs billing/events." }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Peer deviation >3σ; sudden drop; reverse flow; DT energy gap"
        },
        {
            "name": "Total anomalies detected (by time period)",
            "department": "Analytics",
            "description": "Volume tracking",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Key IDs", "value": "Anomaly flags" },
                { "label": "Source", "value": "Scoring pipeline output" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Arshia" },
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
                    { "name": "Week 4", "value": 380 },
                    { "name": "Week 5", "value": 410 }
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
                    { "name": "Week 4", "value": 120 },
                    { "name": "Week 5", "value": 135 }
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
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Key IDs", "value": "Anomaly flags + type" },
                { "label": "Source", "value": "None" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Arshia" },
                { "label": "Note", "value": "Event profile needed" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Count by anomaly_type"
        },
        {
            "name": "Anomalies by severity",
            "department": "Analytics",
            "description": "Severity mix",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Key IDs", "value": "Anomaly flags + severity" },
                { "label": "Source", "value": "Severity mapping" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Arshia" },
                { "label": "Note", "value": "Event profile needed" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Count by severity"
        },
        {
            "name": "Anomalies by geography",
            "department": "Analytics",
            "description": "Hotspots",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Key IDs", "value": "Subdivision (partial)" },
                { "label": "Source", "value": "GIS + topology hierarchy" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Arshia" },
                { "label": "Note", "value": "Event profile needed" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Group by region/feeder/DT"
        },
        {
            "name": "Anomaly trends (daily/weekly/monthly)",
            "department": "Analytics",
            "description": "Trends",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Key IDs", "value": "Anomaly history" },
                { "label": "Source", "value": "None" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Arshia" },
                { "label": "Note", "value": "Event profile needed" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Time-series of anomaly counts"
        },
        {
            "name": "Repeat anomaly tracking",
            "department": "Analytics",
            "description": "Repeat offenders",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Key IDs", "value": "Meter ID + anomaly history" },
                { "label": "Source", "value": "None" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Arshia" },
                { "label": "Note", "value": "Event profile needed" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Repeat offenders within window"
        },
        {
            "name": "Areas with Highest Theft Risk",
            "department": "Analytics",
            "description": "Revenue focus",
            "status": "Ready",
            "analysisItems": [
                { "label": "Entity", "value": "Anomaly" },
                { "label": "Key IDs", "value": "Consumption anomalies (partial)" },
                { "label": "Source", "value": "Billing + topology + events" },
                { "label": "Priority", "value": "P1" },
                { "label": "Owner", "value": "Arshia" },
                { "label": "Module", "value": "Management Summary" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Composite theft risk from anomalies"
        }
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
            "name": "Total Assets Tracked",
            "department": "Advanced Analytics",
            "description": "Total count of consumers, DTRs, and feeders.",
            "status": "Ready",
            "chartData": {
                "allowedTrendTypes": ["bar", "hbar", "donut"],
                "allowedDistTypes": ["bar", "hbar", "donut"],
                "isTimeSeries": false
            }
        },
        {
            "name": "Track updated tag of Feeder to DT",
            "department": "Advanced Analytics",
            "description": "Feeder to DTR mapping tracking data.",
            "status": "Ready",
            "chartData": {
                "allowedTrendTypes": ["bar", "hbar"],
                "allowedDistTypes": ["bar", "hbar"],
                "isTimeSeries": false
            }
        },
        {
            "name": "Track updated tag of DT to Consumer",
            "department": "Advanced Analytics",
            "description": "DTR to consumer mapping tracking data.",
            "status": "Ready",
            "chartData": {
                "allowedTrendTypes": ["bar", "hbar"],
                "allowedDistTypes": ["bar", "hbar"],
                "isTimeSeries": false
            }
        },
        {
            "name": "Mapping Accuracy",
            "department": "Advanced Analytics",
            "description": "Overall mapping accuracy metrics.",
            "status": "Ready",
            "chartData": {
                "allowedTrendTypes": ["bar", "gauge"],
                "allowedDistTypes": ["bar", "hbar"],
                "isTimeSeries": false
            }
        },
        {
            "name": "DT-to-meter mapping accuracy",
            "department": "Advanced Analytics",
            "description": "Specific accuracy for DTR to meter mappings.",
            "status": "Ready",
            "chartData": {
                "allowedTrendTypes": ["bar", "gauge"],
                "allowedDistTypes": ["bar", "hbar"],
                "isTimeSeries": false
            }
        },
        {
            "name": "Mismatch analysis",
            "department": "Advanced Analytics",
            "description": "Analysis of mapping mismatches.",
            "status": "Ready",
            "chartData": {
                "allowedTrendTypes": ["bar", "hbar", "donut"],
                "allowedDistTypes": ["bar", "hbar", "donut"],
                "isTimeSeries": false
            }
        },
        {
            "name": "Correctly mapped meters (%)",
            "department": "Advanced Analytics",
            "description": "Percentage of correctly mapped meters.",
            "status": "Ready",
            "chartData": {
                "allowedTrendTypes": ["bar", "gauge"],
                "allowedDistTypes": ["bar", "hbar"],
                "isTimeSeries": false
            }
        },
        {
            "name": "Incorrectly mapped meters requiring correction (%)",
            "department": "Advanced Analytics",
            "description": "Percentage of incorrectly mapped meters.",
            "status": "Ready",
            "chartData": {
                "allowedTrendTypes": ["bar", "gauge"],
                "allowedDistTypes": ["bar", "hbar"],
                "isTimeSeries": false
            }
        },
        {
            "name": "Track updated effective dated mapping",
            "department": "Advanced Analytics",
            "description": "Effective date tracking for mappings.",
            "status": "Ready",
            "chartData": {
                "allowedTrendTypes": ["bar", "hbar"],
                "allowedDistTypes": ["bar", "hbar"],
                "isTimeSeries": false
            }
        },
        {
            "name": "Transformer utilization rate (% of rated capacity)",
            "department": "Advanced Analytics",
            "description": "Utilization",
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
        // {
        //     "name": "Phase-level mapping accuracy",
        //     "department": "Analytics",
        //     "description": "Phase allocation correctness",
        //     "status": "Stable"
        // },
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
                { "label": "Categories", "value": "CONSUMER / FEEDER / DT" },
                { "label": "Comparison", "value": "By Cluster / Project" }
            ],
            "qualityHeader": "Calculation Logic",
            "qualityDescription": "Total count of new meter numbers installed, segmented by category (CONSUMER, FEEDER, DT) and geographical clusters.",
            "chartData": {
                "trendTitle": "MI Progress Trend",
                "trend": [
                    { "name": "Trend Start", "Consumer": 0, "Feeder": 0, "DT": 0 }
                ],
                "distTitle": "Comparison by Cluster/Project",
                "distribution": [
                    { "name": "Sample Label", "value": 0 }
                ],
                "allowedTrendTypes": ["line", "area", "bar"],
                "allowedDistTypes": ["bar", "hbar", "donut", "funnel"]
            }
        },
        {
            "name": "MI-Productivity per team (Total & Category wise)",
            "module": "Meter-Installation",
            "department": "Business",
            "description": "Output per installation team (agency).",
            "status": "On Track",
            "analysisItems": [
                { "label": "Formula", "value": "Verified Installations / (Agencies × Days)" },
                { "label": "Frequency", "value": "Daily / Weekly / Monthly" },
                { "label": "Categories", "value": "CONSUMER / FEEDER / DT" }
            ],
            "qualityDescription": "Average verified installations completed per agency team per working day. Formula: Productivity = Total Verified / (Active Agencies × Active Days).",
            "chartData": {
                "trendTitle": "Daily Performance (Productivity per Team)",
                "trend": [
                    { "name": "Trend Start", "Productivity": 0, "Installations": 0, "Agencies": 0 }
                ],
                "distTitle": "Comparison by Cluster/Project (Productivity)",
                "distribution": [
                    { "name": "Sample Label", "value": 0 }
                ],
                "allowedTrendTypes": ["bar", "line", "area"],
                "allowedDistTypes": ["bar", "hbar"]
            }
        },
        {
            "name": "Monthly Productivity trend (Total & Category wise)",
            "module": "Meter-Installation",
            "department": "Business",
            "description": "Monthly view of installation productivity.",
            "status": "Stable",
            "analysisItems": [
                { "label": "Formula", "value": "Total Installations / Active Days" },
                { "label": "Frequency", "value": "Monthly" },
                { "label": "Comparison", "value": "By Project / Geographically" }
            ],
            "qualityDescription": "Average installations completed per calendar day of the month. Formula: Productivity = Total Installations / Calendar Days (e.g., 31 for Jan, 28 for Feb).",
            "chartData": {
                "trendTitle": "Monthly Performance Trend",
                "trend": [
                    { "name": "Trend Start", "Productivity": 0, "Installations": 0, "Active Days": 0 }
                ],
                "distTitle": "Comparison by Cluster/Project",
                "distribution": [
                    { "name": "Sample Label", "Productivity": 0, "Installations": 0 }
                ],
                "allowedTrendTypes": ["bar", "line", "area"],
                "allowedDistTypes": ["bar", "hbar"],
                "allowedDurations": ["Monthly"],
                "isMonthlyOnly": true
            }
        },
        {
            "name": "Defective Meters",
            "module": "Meter-Installation",
            "department": "Business",
            "description": "Tracks defective meters based on replacement data.",
            "status": "Warning",
            "analysisItems": [
                { "label": "Formula", "value": "COUNT(complaints WHERE old_sn AND new_sn)" },
                { "label": "Defect Types", "value": "Meter Burnt / Meter Faulty / Others" }
            ],
            "qualityDescription": "Tracks defective meters identified through complaints where both old and new smart meter numbers are recorded, indicating a replacement has occurred. Categorized into Burnt, Faulty, and Others.",
            "chartData": {
                "trendTitle": "Defective View Trend",
                "trend": [
                    { "name": "Trend Start", "Burnt": 0, "Faulty": 0, "Others": 0 }
                ],
                "distTitle": "Defective Comparison by Cluster",
                "distribution": [
                    { "name": "Sample Label", "Burnt": 0, "Faulty": 0, "Others": 0, "total_defective": 0 }
                ],
                "allowedTrendTypes": ["line", "multi-line", "bar"],
                "allowedDistTypes": ["bar", "hbar"]
            }
        },
        {
            "name": "Total & Category wise Inventory Utilization rate (Meters & Cable)",
            "module": "Inventory",
            "department": "Business",
            "description": "Efficiency of material usage (Installed vs Total Stock).",
            "status": "Good",
            "analysisItems": [
                { "label": "Formula", "value": "(Total Installed / Total Inventory) * 100" },
                { "label": "Categories", "value": "CONSUMER / FEEDER / DT" }
            ],
            "qualityDescription": "Percentage of total stock issued that has been successfully installed and mapped. Tracks utilization trends over time and geographical areas.",
            "chartData": {
                "trendTitle": "Inventory Utilization Trend",
                "trend": [
                    { "name": "Trend Start", "Inventory": 0, "Installed": 0, "Utilization Rate": 0 }
                ],
                "distTitle": "Geographical Utilization Comparison",
                "distribution": [
                    { "name": "Sample Label", "Inventory": 0, "Installed": 0, "Utilization Rate": 0 }
                ],
                "allowedTrendTypes": ["bar", "area", "line"],
                "allowedDistTypes": ["bar", "hbar"]
            }
        },
        {
            "name": "MI pace Vs Stock availibility",
            "module": "Inventory",
            "department": "Business",
            "description": "Inventory availability vs installation rate.",
            "status": "Good",
            "analysisItems": [
                { "label": "Formula", "value": "Total Inventory - Total Installed" },
                { "label": "Key Metric", "value": "Remaining Stock" }
            ],
            "qualityDescription": "Tracks remaining stock levels across different geographical areas and categories. Compares the pace of installation with available material reserves.",
            "chartData": {
                "trendTitle": "Installation Pace Trend",
                "trend": [
                    { "name": "Trend Start", "Total Inventory": 0, "Total Installed": 0, "Remaining Stock": 0 }
                ],
                "distTitle": "Geographical Stock Availability",
                "distribution": [
                    { "name": "Sample Label", "Total Installed": 0, "Total Inventory": 0, "Remaining Stock": 0 }
                ],
                "allowedTrendTypes": ["bar", "area", "line"],
                "allowedDistTypes": ["bar", "hbar"]
            }
        },
        {
            "name": "Un-utilized stock ageing",
            "module": "Inventory",
            "department": "Business",
            "description": "Duration in days since stock intake (DIDate) for uninstalled items.",
            "status": "Warning",
            "analysisItems": [
                { "label": "Formula", "value": "CURRENT_DATE - DI_DATE" },
                { "label": "Aging Buckets", "value": "0-30 / 31-60 / 61-90 / 90+" }
            ],
            "qualityDescription": "Tracks aging of un-utilized stock across discoms and categories. Helps identify aging inventory that requires prioritized installation.",
            "chartData": {
                "shared": true,
                "trendTitle": "Stock Ageing Trend",
                "trend": [
                    { "name": "Trend Start", "0-30 days": 0, "31-60 days": 0, "61-90 days": 0, "90+ days": 0 }
                ],
                "distTitle": "Geographical Ageing Comparison",
                "distribution": [
                    { "name": "Sample Label", "0-30 days": 0, "31-60 days": 0, "61-90 days": 0, "90+ days": 0 }
                ],
                "allowedTrendTypes": ["area", "bar", "line"],
                "allowedDistTypes": ["bar", "hbar"],
                "allowedDurations": ["As on date"],
                "hasDateFilter": false,
                "isTimeSeries": false
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
            "description": "Consolidated MI vs SAT tracking with stage-wise verification progress.",
            "status": "On Track",
            "analysisItems": [
                { "label": "Formula", "value": "Total SAT / Total MI" },
                { "label": "Stages", "value": "SAT 1 to SAT 9 breakdown" },
                { "label": "Categories", "value": "CONSUMER / FEEDER / DT" }
            ],
            "qualityDescription": "Tracks formal acceptance testing (SAT) progress against meter installations. Provides granular visibility into the 9 stages of the SAT workflow across categories and hierarchies.",
            "chartData": {
                "trendTitle": "Stage-wise SAT Distribution",
                "trend": [
                    { "name": "SAT 1", "Consumer": 0, "DT": 0, "Feeder": 0 }
                ],
                "distTitle": "Hierarchical MI/SAT Comparison",
                "distribution": [
                    { "name": "Sample Label", "Total MI": 0, "Total SAT": 0, "SAT Progress %": 0 }
                ],
                "allowedTrendTypes": ["bar", "hbar"],
                "allowedDistTypes": ["bar", "hbar"],
                "allowedDurations": ["As on latest SAT"],
                "isTimeSeries": false
            }
        },
        {
            "name": "Non-SAT ageing",
            "module": "SAT",
            "department": "Business",
            "description": "Consolidated Non-SAT tracking by installation period and ageing buckets.",
            "status": "Warning",
            "analysisItems": [
                { "label": "Formula", "value": "CURRENT_DATE - InstalledTS (WHERE SAT_Date IS NULL)" },
                { "label": "Buckets", "value": "0-30 / 31-60 / 61-90 / 91-120 / 120+" }
            ],
            "qualityDescription": "Identifies sites that are installed but idling without verification, affecting billing cycles. Provides granularity by installation period and hierarchical aging distribution.",
            "chartData": {
                "trend": [
                    { "name": "age 0-30", "Consumer": 450, "DT": 120, "Feeder": 30 },
                    { "name": "age 31-60", "Consumer": 380, "DT": 95, "Feeder": 25 },
                    { "name": "age 61-90", "Consumer": 290, "DT": 70, "Feeder": 20 },
                    { "name": "age 91-120", "Consumer": 150, "DT": 45, "Feeder": 15 },
                    { "name": "age 120+", "Consumer": 800, "DT": 350, "Feeder": 40 }
                ],
                "distTitle": "Hierarchical Non-SAT Comparison",
                "distribution": [
                    { "name": "Agra", "age 0-30": 100, "age 31-60": 80, "age 61-90": 60, "age 91-120": 40, "age 120+": 120 },
                    { "name": "Kashi", "age 0-30": 90, "age 31-60": 70, "age 61-90": 50, "age 91-120": 30, "age 120+": 110 },
                    { "name": "Triveni", "age 0-30": 80, "age 31-60": 60, "age 61-90": 40, "age 91-120": 20, "age 120+": 100 }
                ],
                "allowedTrendTypes": ["area", "bar", "line"],
                "allowedDistTypes": ["bar", "hbar"],
                "allowedDurations": ["As on latest SAT"],
                "isTimeSeries": false
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
            "name": "MI vs SAT vs Invoice Funnel",
            "module": "Invoicing",
            "department": "Business",
            "description": "Installation to billing workflow progress.",
            "status": "Stable",
            "analysisItems": [
                { "label": "Workflow", "value": "MI -> SAT -> Invoice" }
            ],
            "qualityDescription": "Full lifecycle tracking from physical installation to revenue recognition.",
            "chartData": {
                "trendTitle": "MI to Invoice Funnel Stages",
                "trend": [
                    { "name": "mi", "value": 4500 }, { "name": "sat", "value": 4200 }, { "name": "lumpsum_invoice", "value": 3800 }, { "name": "pmpm_invoice", "value": 3800 }
                ],
                "distTitle": "Geographical Comparison",
                "distribution": [
                    { "name": "AGRA", "total_mi": 1200, "total_sat": 1000, "total_lumpsum_invoice": 800, "total_pmpm_invoice": 800 },
                    { "name": "KASHI", "total_mi": 1000, "total_sat": 800, "total_lumpsum_invoice": 600, "total_pmpm_invoice": 600 },
                    { "name": "TRIVENI", "total_mi": 800, "total_sat": 600, "total_lumpsum_invoice": 400, "total_pmpm_invoice": 400 }
                ],
                "allowedTrendTypes": ["bar", "hbar"],
                "allowedDistTypes": ["bar", "hbar"],
                "allowedDurations": ["As on latest SAT"],
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
            "name": "Invoice vs Revenue Released",
            "module": "Revenue",
            "department": "Business",
            "description": "Actual income collected.",
            "status": "Stable",
            "analysisItems": [
                { "label": "Formula", "value": "SUM(RealizedAmount)" }
            ],
            "qualityDescription": "Total revenue that has been successfully collected and verified against invoices.",
            "chartData": {
                "trendTitle": "Revenue Realization Stages",
                "trend": [
                    { "name": "Lumpsum Invoice", "Consumer": 0, "DT": 0, "Feeder": 0 },
                    { "name": "PMPM Invoice", "Consumer": 0, "DT": 0, "Feeder": 0 },
                    { "name": "Lumpsum Collection", "Consumer": 0, "DT": 0, "Feeder": 0 },
                    { "name": "PMPM Collection", "Consumer": 0, "DT": 0, "Feeder": 0 }
                ],
                "distTitle": "Geographical Realization Comparison",
                "distribution": [
                    { "name": "Sample Label", "Realized": 0 }
                ],
                "allowedTrendTypes": ["bar"],
                "allowedDistTypes": ["bar", "hbar"],
                "allowedDurations": ["As on latest SAT"],
                "isTimeSeries": false
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
                "trendTitle": "Revenue Ageing Breakdown",
                "trend": [
                    { "name": "age 0-30", "Value": 0 },
                    { "name": "age 30-60", "Value": 0 },
                    { "name": "age 61-90", "Value": 0 },
                    { "name": "age 90+", "Value": 0 }
                ],
                "distTitle": "Geographical Ageing Comparison",
                "distribution": [
                    { "name": "Sample Label", "0-30 days": 0, "31-60 days": 0, "61-90 days": 0, "90+ days": 0, "Total": 0 }
                ],
                "allowedTrendTypes": ["bar", "hbar"],
                "allowedDistTypes": ["bar", "hbar"],
                "allowedDurations": ["As on latest SAT"],
                "isTimeSeries": false
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
            "description": "Consolidated cycle time analysis from PO/Inventory to Cash Realization.",
            "status": "Active",
            "analysisItems": [
                { "label": "Workflow", "value": "Store -> Agency -> Install -> SAT -> Invoice -> Revenue" },
                { "label": "Metric", "value": "Avg Lead Time (Days)" }
            ],
            "qualityDescription": "Measures the operational efficiency of the entire meter lifecycle. Identifies bottlenecks in the workflow to optimize revenue realization cycles.",
            "chartData": {
                "trendTitle": "Workflow Lead Time Trend",
                "trend": [
                    { "name": "Trend Start", "Inv to Store": 0, "Store to Agency": 0, "Agency to Install": 0, "Install to SAT": 0, "SAT to Invoice": 0, "Invoice to Revenue": 0 }
                ],
                "distTitle": "Hierarchical Lead Time Comparison",
                "distribution": [
                    { "name": "Sample Label", "Inv to Store": 0, "Store to Agency": 0, "Agency to Install": 0, "Install to SAT": 0, "SAT to Invoice": 0, "Invoice to Revenue": 0 }
                ],
                "allowedTrendTypes": ["bar", "hbar"],
                "allowedDistTypes": ["bar", "hbar"],
                "allowedDurations": ["As on latest SAT"],
                "isTimeSeries": false
            }
        },
        {
            "name": "Meters Current Stage for Revenue not realized (Total & Category wise)",
            "module": "Meter Journey",
            "department": "Business",
            "description": "Consolidated 4-stage funnel analysis from Meter Inventory to Revenue Realization.",
            "status": "Stable",
            "analysisItems": [
                { "label": "Workflow", "value": "Inventory -> Installed -> SAT -> Revenue" },
                { "label": "Metric", "value": "Cumulative Count" }
            ],
            "qualityDescription": "Measures the operational efficiency of the entire meter lifecycle pipeline.",
            "chartData": {
                "trendTitle": "Meter Funnel (Stage-wise)",
                "trend": [
                    { "name": "Inventory", "Consumer": 0, "Feeder": 0, "DT": 0 },
                    { "name": "Installed", "Consumer": 0, "Feeder": 0, "DT": 0 },
                    { "name": "SAT Done", "Consumer": 0, "Feeder": 0, "DT": 0 },
                    { "name": "Revenue Realized", "Consumer": 0, "Feeder": 0, "DT": 0 }
                ],
                "distTitle": "Hierarchical Funnel Comparison",
                "distribution": [
                    { "name": "Sample Label", "Inventory": 0, "Installed": 0, "SAT Done": 0, "Revenue Realized": 0 }
                ],
                "allowedTrendTypes": ["bar", "hbar"],
                "allowedDistTypes": ["bar", "hbar"],
                "allowedDurations": ["As on latest SAT"],
                "isTimeSeries": false
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
            "totalKPIs": 1,
            "totalAnomalies": 1,
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
                    "name": "Active",
                    "value": 10
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
                    "name": "Active",
                    "value": 22
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
                    "value": 1
                },
                {
                    "name": "Analytics",
                    "value": 1
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
