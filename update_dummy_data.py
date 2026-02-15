import pandas as pd
import json
import random
import re

# Load the dummy CSV we created
df = pd.read_csv("dummy_kpi_data.csv")
df['KPI Name'] = df['KPI Name'].fillna('Unknown KPI')
df['Priority'] = df['Priority'].fillna('Low')

# No more mapping - use raw names
df['Department'] = df['Department'].fillna('Other')

# Get unique departments from CSV
unique_depts = df['Department'].dropna().unique().tolist()

# Structure for executiveDummyData
data = {
    "summary": {
        "totalKPIs": len(df),
        "totalIssues": 0, 
        "critical": 0,
        "high": 0,
        "departments": len(unique_depts),
        "overallScore": 75 
    },
    "businessAreas": {}, 
    "departments": []
}

# Helper for camelCase keys
def to_camel_case(s):
    s = re.sub(r'[^a-zA-Z0-9]', ' ', s).title().replace(' ', '')
    return s[0].lower() + s[1:]

total_issues = 0
critical_count = 0
high_count = 0

for idx, dept_name in enumerate(unique_depts):
    dept_df = df[df['Department'] == dept_name]
    
    # Normalize Priority/Severity
    def get_severity(p):
        p = str(p).lower()
        if 'critical' in p or 'p0' in p: return 'critical'
        if 'high' in p or 'p1' in p: return 'high'
        if 'medium' in p or 'p2' in p: return 'medium'
        return 'low'

    dept_df['Severity'] = dept_df['Priority'].apply(get_severity)
    
    crit = len(dept_df[dept_df['Severity'] == 'critical'])
    high = len(dept_df[dept_df['Severity'] == 'high'])
    medium = len(dept_df[dept_df['Severity'] == 'medium'])
    low = len(dept_df[dept_df['Severity'] == 'low'])
    
    total_dept_issues = crit + high + medium
    health_score = max(0, 100 - (crit * 5 + high * 2))
    
    total_issues += total_dept_issues
    critical_count += crit
    high_count += high
    
    # Pick top issues for needsAttention (Critical/High)
    attention_kpis = dept_df[dept_df['Severity'].isin(['critical', 'high'])]['KPI Name'].head(5).tolist()
    
    # Pick 'Good' items for workingWell (Low/Medium)
    working_well_kpis = dept_df[dept_df['Severity'].isin(['low', 'medium'])]['KPI Name'].head(5).tolist()
    
    if not attention_kpis: attention_kpis = [f"No critical issues in {dept_name}"]
    if not working_well_kpis: working_well_kpis = [f"All {dept_name} KPIs stable"]

    # Create full list of KPI objects
    kpi_list_objects = []
    for _, row in dept_df.iterrows():
        kpi_list_objects.append({
            "id": f"kpi_{random.randint(1000,9999)}",
            "kpiName": row['KPI Name'],
            "status": "Critical" if row['Severity'] == 'critical' else "Watchlist" if row['Severity'] == 'high' else "Good",
            "trend": "stable",
            "value": f"{random.randint(80, 100)}%"
        })

    # Generate department object
    dept_obj = {
        "id": f"dept_{idx+1}",
        "name": dept_name, 
        "impactStatement": f"{dept_name} performance is { 'stable' if health_score > 80 else 'at risk' } with {crit} critical items.",
        "kpis": len(dept_df),
        "kpiList": kpi_list_objects,
        "issues": { "critical": crit, "high": high, "medium": medium, "low": low },
        "needsAttention": attention_kpis,
        "workingWell": working_well_kpis,
        "trend": [
            { "name": 'Jan', "value": health_score - 5 },
            { "name": 'Feb', "value": health_score - 2 },
            { "name": 'Mar', "value": health_score },
            { "name": 'Apr', "value": health_score + 2 },
            { "name": 'May', "value": health_score + 1 },
            { "name": 'Jun', "value": health_score }
        ]
    }
    data["departments"].append(dept_obj)
    
    # Populate Business Area for this department
    bs_key = to_camel_case(dept_name)
    data["businessAreas"][bs_key] = {
        "health": health_score,
        "issues": total_dept_issues,
        "summary": f"{dept_name} stability is { 'good' if health_score > 80 else 'concerning' }.",
        "link": "/departments"
    }

# ADD PREFORMANCE TREND
data["businessAreas"]["performanceTrend"] = {
    "trendDirection": "up",
    "summary": "Positive overarching trend in system availability.",
    "link": "/trends"
}

# Update Summary
data["summary"]["totalIssues"] = total_issues
data["summary"]["critical"] = critical_count
data["summary"]["high"] = high_count
if data['businessAreas']:
    # exclude performanceTrend from average calculation if it doesn't have health
    scores = [d['health'] for k, d in data['businessAreas'].items() if 'health' in d]
    if scores:
         data["summary"]["overallScore"] = int(sum(scores) / len(scores))
    else:
         data["summary"]["overallScore"] = 75
else:
    data["summary"]["overallScore"] = 0

# Javascript content formatting
js_content = f"export const executiveDummyData = {json.dumps(data, indent=4)};"

with open("src/data/executiveDummyData.js", "w") as f:
    f.write(js_content)

print("Successfully updated src/data/executiveDummyData.js with Raw Names & Performance Trend")
