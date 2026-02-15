import pandas as pd
import os

input_file = "dummy_kpi_data.csv"
output_file = "KPI_REFERENCE.md"

if not os.path.exists(input_file):
    print(f"Error: {input_file} not found.")
else:
    df = pd.read_csv(input_file)
    
    # Normalize
    df['Department'] = df['Department'].fillna('Unassigned')
    
    with open(output_file, 'w') as f:
        f.write("# Smart Meter KPI Reference\n\n")
        f.write("This document lists all **105 KPIs** extracted from the source CSV, organized by Department.\n\n")
        
        # Get unique departments
        departments = df['Department'].unique()
        
        for dept in departments:
            dept_df = df[df['Department'] == dept]
            f.write(f"## {dept} ({len(dept_df)})\n\n")
            f.write("| KPI Name | Priority | Category |\n")
            f.write("| :--- | :--- | :--- |\n")
            
            for _, row in dept_df.iterrows():
                # Handle possible NaN
                name = row.get('KPI Name', 'N/A')
                prio = row.get('Priority', '-')
                cat = row.get('Category', '-')
                f.write(f"| {name} | {prio} | {cat} |\n")
            
            f.write("\n")
            
    print(f"Successfully generated {output_file} with {len(df)} KPIs.")
