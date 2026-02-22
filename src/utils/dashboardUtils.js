import { dashboardData } from '../data/dashboardData';

export const dashboardMeta = {
    dashboard1: { title: "Dashboard 1", description: "Executive Overview - High-level business summary." },
    dashboard2: { title: "Dashboard 2", description: "Department KPIs - Detailed performance metrics." },
    dashboard3: { title: "Dashboard 3", description: "Anomaly Monitoring - Real-time detection." },
    dashboard4: { title: "Dashboard 4", description: "Data Gap Analysis - Missing/incomplete data." },
    dashboard5: { title: "Dashboard 5", description: "Feasibility Tracking - KPI implementation status." },
    dashboard6: { title: "Dashboard 6", description: "Priority Analysis - Critical alert items." },
    dashboard7: { title: "Dashboard 7", description: "Source System Dependency - Data health." },
    dashboard8: { title: "Dashboard 8", description: "Performance Trends - Historical analysis." },
    dashboard9: { title: "Dashboard 9", description: "KPI Dictionary - Definitions and metadata." },
};

export const getDashboardsForDepartment = (deptName) => {
    const availableDashboards = [];

    Object.keys(dashboardData).forEach(dashKey => {
        const data = dashboardData[dashKey];
        // Check if this dashboard has any records for the given department
        // Added safety check for array
        const hasDeptData = Array.isArray(data) && data.some(item => item.department === deptName);

        if (hasDeptData) {
            availableDashboards.push({
                key: dashKey,
                ...dashboardMeta[dashKey]
            });
        }
    });

    return availableDashboards;
};
export const findKPIOrigin = (kpiName, deptName) => {
    if (!kpiName) return null;
    let result = null;
    const searchName = kpiName.toLowerCase().trim();

    Object.keys(dashboardData).forEach(dashKey => {
        const data = dashboardData[dashKey];
        if (Array.isArray(data)) {
            const kpi = data.find(k =>
                k.name.toLowerCase().trim() === searchName &&
                (!deptName || k.department.toLowerCase().trim() === deptName.toLowerCase().trim())
            );
            if (kpi) {
                result = { dashKey, kpi };
            }
        }
    });
    return result;
};
