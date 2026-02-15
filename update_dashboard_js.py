import pandas as pd
import json
import random

# Load CSV
df = pd.read_csv("dummy_kpi_data.csv")
df['KPI Name'] = df['KPI Name'].fillna('Unknown')
df['Department'] = df['Department'].fillna('General')
df['Priority'] = df['Priority'].fillna('Low')

def get_status(p):
    p = str(p).lower()
    if 'critical' in p or 'p0' in p: return 'Critical'
    if 'high' in p or 'p1' in p: return 'Warning'
    return 'Stable'

def get_priority(p):
    p = str(p).lower()
    if 'p0' in p: return 'High'
    if 'p1' in p: return 'Medium'
    return 'Low'

dash_items = []
for _, row in df.iterrows():
    dash_items.append({
        "name": row['KPI Name'],
        "department": row['Department'], # Raw: 'Operation', 'Finance', etc.
        "priority": get_priority(row['Priority']),
        "status": get_status(row['Priority']), 
        "feasibility": "Feasible" if random.random() > 0.2 else "In Progress"
    })

# Logical Split
dashboard1 = dash_items[:20] 
dashboard2 = sorted(dash_items, key=lambda x: x['department']) 
dashboard3 = [d for d in dash_items if 'Anomaly' in d['name'] or 'Reliability' in d['name']]
if not dashboard3: dashboard3 = dash_items[20:40]
dashboard4 = [d for d in dash_items if 'Map' in d['name'] or 'Data' in d['name']]
if not dashboard4: dashboard4 = dash_items[40:60]
dashboard5 = [d for d in dash_items if 'Efficiency' in d['name'] or 'Loss' in d['name']]
if not dashboard5: dashboard5 = dash_items[60:80]

# Dashboard 6: Priority Analysis
dashboard6 = [d for d in dash_items if d['priority'] == 'High']

# Dashboard 7: Source System (Mock subset)
dashboard7 = dash_items[::5] 

# Dashboard 8: Trends 
dashboard8 = dash_items

# Dashboard 9: Dictionary
dashboard9 = sorted(dash_items, key=lambda x: x['name'])

# Chart Data - Aggregate by Raw Department
dept_counts = df['Department'].value_counts().to_dict()
bar_data = [{"name": k, "value": v} for k, v in dept_counts.items()]

data = {
    "dashboard1": dashboard1,
    "dashboard2": dashboard2[:50],
    "dashboard3": dashboard3,
    "dashboard4": dashboard4,
    "dashboard5": dashboard5,
    "dashboard6": dashboard6,
    "dashboard7": dashboard7,
    "dashboard8": dashboard8[:50],
    "dashboard9": dashboard9,
    "summary": {
        "dashboard1": { "totalKPIs": len(df), "totalAnomalies": 12, "highPriority": 10, "notFeasible": 2 },
        "dashboard2": { "totalKPIs": len(df), "totalAnomalies": 5, "highPriority": 20, "notFeasible": 5 },
        "dashboard3": { "totalKPIs": len(dashboard3), "totalAnomalies": len(dashboard3), "highPriority": int(len(dashboard3)/2), "notFeasible": 0 },
        "dashboard4": { "totalKPIs": len(dashboard4), "totalAnomalies": 10, "highPriority": 5, "notFeasible": 1 },
        "dashboard5": { "totalKPIs": len(dashboard5), "totalAnomalies": 0, "highPriority": 8, "notFeasible": 2 },
        "dashboard6": { "totalKPIs": len(dashboard6), "totalAnomalies": 10, "highPriority": len(dashboard6), "notFeasible": 5 },
        "dashboard7": { "totalKPIs": len(dashboard7), "totalAnomalies": 2, "highPriority": 5, "notFeasible": 1 },
        "dashboard8": { "totalKPIs": len(dashboard8), "totalAnomalies": 12, "highPriority": 30, "notFeasible": 5 },
        "dashboard9": { "totalKPIs": len(dashboard9), "totalAnomalies": 0, "highPriority": 0, "notFeasible": 0 },
    },
    "chartData": {
        "dashboard1": {
            "bar": bar_data, # Dynamic
            "pie": [
                { "name": 'Feasible', "value": 70 },
                { "name": 'In Progress', "value": 20 },
                { "name": 'Not Feasible', "value": 10 },
            ],
            "line": [
                { "name": 'Jan', "value": 65 },
                { "name": 'Feb', "value": 59 },
                { "name": 'Mar', "value": 80 },
                { "name": 'Apr', "value": 81 },
                { "name": 'May', "value": 56 },
                { "name": 'Jun', "value": 55 }
            ]
        },
        # Placeholders for others - can be expanded later
        "dashboard2": {
            "bar": [{ "name": 'HR', "value": 15 }, { "name": 'Finance', "value": 45 }, { "name": 'IT', "value": 30 }],
            "pie": [{ "name": 'Active', "value": 60 }, { "name": 'Pending', "value": 30 }, { "name": 'Closed', "value": 10 }],
            "line": [{ "name": 'Q1', "value": 30 }, { "name": 'Q2', "value": 45 }, { "name": 'Q3', "value": 20 }]
        }
    }
}

js_content = f"export const dashboardData = {json.dumps(data, indent=4)};"

with open("src/data/dashboardData.js", "w") as f:
    f.write(js_content)

print("Successfully updated src/data/dashboardData.js with Raw Names")
