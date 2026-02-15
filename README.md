# Smart Meter KPI Executive Dashboard

## Project Overview

This is a **High-Performance KPI Monitoring Platform** designed for the Smart Metering ecosystem. It transforms raw operational data (CSV) into actionable insights for executives and technical teams.

The platform is structured into three main layers:
1.  **Executive Control Center (Home)**: High-level health scores and critical risk indicators.
2.  **Department Performance**: Deep-dive analysis for specific operational units (Operations, Finance, Technical, Analytics).
3.  **Dashboard Gallery (Detailed Views)**: A suite of 9 specialized dashboards for granular analysis (Anomalies, Data Gaps, Trends, etc.).

## Key Features

### 1. Executive Control Center (Home)
The landing page provides an immediate system status:
-   **System Health Score**: A weighted reliability metric (0-100%) calculated from the density of Critical and High-priority issues.
-   **AI-Driven Insights**: Automatically generated findings (e.g., "Critical Feeder Loss in Finance") based on live data.
-   **Risk Heatmap**: Visual breakdown of issues by severity.

### 2. Department Performance
A dedicated view (`/departments`) for operational leaders:
-   **"Working Well" vs. "Critical Issues"**: Clearly separates stable KPIs from those needing attention.
-   **Impact Statements**: Dynamically generated summaries of departmental health.
-   **Trend Analysis**: Historical performance charts for each department.

### 3. Dashboard Gallery (Detailed Reports)
Accessible via the "Dashboard Gallery" sidebar link, this section hosts 9 specialized dashboards:
-   **Dashboard 1**: Executive Overview
-   **Dashboard 2**: Department KPIs
-   **Dashboard 3**: Anomaly Monitoring
-   **Dashboard 4**: Data Gap Analysis
-   **Dashboard 5**: Feasibility Tracking
-   **Dashboard 6**: Priority Analysis (High/Critical Items)
-   **Dashboard 7**: Source System Dependency
-   **Dashboard 8**: Performance Trends
-   **Dashboard 9**: KPI Dictionary

## Technical Architecture

-   **Frontend**: React 18 (Vite)
-   **Styling**: Tailwind CSS (Executive/Premium Theme)
-   **Visualization**: Recharts (Responsive, Interactive Charts)
-   **Routing**: React Router v6
-   **Icons**: Lucide React

## Project Structure

```bash
src/
├── components/          # Reusable UI components
│   ├── charts/          # Recharts wrappers (Bar, Pie, Line)
│   ├── Sidebar.jsx      # Main Navigation
│   └── DashboardLayout  # Common Wrapper
├── pages/               # Application Views
│   ├── Home.jsx                  # Main Executive/Landing Page
│   ├── DepartmentPerformance.jsx # Department Analysis Page
│   ├── DashboardGallery.jsx      # Navigation Hub for Dashboards 1-9
│   ├── GenericDashboard.jsx      # Template for Dashboards 1-9
│   └── ExecutiveDashboard.jsx    # (Backup/Legacy View)
├── data/
│   ├── executiveDummyData.js     # Data for Home & Department Pages
│   └── dashboardData.js          # Specific Data for Dashboards 1-9
└── App.jsx              # Routing Configuration
```

## Data Management

The application features a **Python-to-JS Data Pipeline** to ensure the dashboard reflects the latest CSV data:

1.  **Source**: `dummy_kpi_data.csv` (Contains raw KPI names, departments, priorities).
2.  **Processing Scripts**:
    *   `update_dummy_data.py`: Generates `executiveDummyData.js` (Calculates Health Scores, Insights).
    *   `update_dashboard_js.py`: Generates `dashboardData.js` (Creates subsets for Dashboards 1-9).
3.  **Frontend**: Consumes the generated JS files to render the UI.

To update the data, simply modify the CSV and run the Python scripts.

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```

## Customization Guide

-   **Health Score Logic**: The score is calculated in `Home.jsx` as `100 - (Defect Density %)`.
    *   *Critical Issues* = 100% weight.
    *   *High Priority* = 20% weight.
-   **Adding Dashboards**: Add a new entry to `DashboardGallery.jsx` and a route in `App.jsx`.
-   **Renaming Departments**: Update the mapping in `update_dummy_data.py`.
