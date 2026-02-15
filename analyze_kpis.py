import pandas as pd
import os

# Define the file path
csv_file = "Smart_Meter_All_KPIs_Anomalies_From_PDF_UPDATED_With_Feeder_DT_v1(All_KPIs_&_Anomalies).csv"
output_file = "dummy_kpi_data.csv"

# Check if file exists
if not os.path.exists(csv_file):
    print(f"Error: File '{csv_file}' not found in {os.getcwd()}")
else:
    try:
        # Read the CSV with encoding handling
        df = pd.read_csv(csv_file, encoding='latin1')
        
        # Normalize column names by stripping whitespace
        df.columns = [col.strip() for col in df.columns]

        print("--- CSV Headers ---")
        print(df.columns.tolist())
        
        print("\n--- Unique Departments ---")
        if 'Department' in df.columns:
            print(df['Department'].unique().tolist())
        else:
            print("Column 'Department' not found.")
            
        print("\n--- All KPI Names ---")
        # dynamic search for KPI Name column
        kpi_col = [col for col in df.columns if 'KPI' in col or 'Name' in col][0] 
        print(f"Using column '{kpi_col}' for KPI Names")
        kpis = df[kpi_col].dropna().unique().tolist()
        print(kpis)

        # Create dummy_kpi_data.csv
        cols_to_keep = []
        for col in ['Category', 'KPI / Anomaly Name', 'Department', 'Priority', 'Remarks']:
             # check if col exists (case insensitive match potential)
             match = next((c for c in df.columns if c.lower() == col.lower()), None)
             if match:
                 cols_to_keep.append(match)
        
        if cols_to_keep:
            dummy_df = df[cols_to_keep].copy()
            # Standardize column names for output
            dummy_df.columns = [c.replace('KPI / Anomaly Name', 'KPI Name') for c in dummy_df.columns]
            
            # Add dummy columns
            dummy_df['Status'] = 'Good'
            dummy_df['Trend'] = 'Stable'
            
            dummy_df.to_csv(output_file, index=False)
            print(f"\nSuccessfully created '{output_file}' with columns:", dummy_df.columns.tolist())
            print(f"File path: {os.path.abspath(output_file)}")
        else:
             print("\nCould not find relevant columns to create dummy CSV.")

    except Exception as e:
        print(f"An error occurred: {e}")
