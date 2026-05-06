import { dashboardData } from '../data/dashboardData';
import { 
    Toolbox, 
    Warehouse, 
    Wrench, 
    ClipboardCheck, 
    FileText, 
    IndianRupee, 
    Navigation 
} from 'lucide-react';

export const dashboardMeta = {
    finance: { title: "Finance", description: "Financial performance and audits." },
    operation_parameters: { title: "Operation Parameters", description: "Network reliability and outage metrics." },
    power_quality: { title: "Power Quality", description: "Voltage, frequency, and power factor analysis." },
    load_management: { title: "Load Management", description: "Transformer loading and violation tracking." },
    theft_analysis: { title: "Theft Analysis", description: "Anomaly detection and revenue protection." },
    operation_analytics: { title: "Operation Analytics", description: "Phase monitoring and flow analysis." },
    advanced_analytics: { title: "Advanced Analytics", description: "Asset tracking and mapping accuracy." },
    load_management_analytics: { title: "Load Management", description: "Asset risk and consumption profile analysis." },
    dashboard10: { title: "Smart Meter Operations Dashboard", description: "Real-time monitoring of smart meter operations." },
};

export const businessModules = {
    'Meter-Installation': {
        title: "Meter-Installation",
        icon: Toolbox,
        description: "Installation progress and team productivity tracking."
    },
    'Inventory': {
        title: "Inventory",
        icon: Warehouse,
        description: "Material utilization and stock availability monitoring."
    },
    'O&M': {
        title: "O&M",
        icon: Wrench,
        description: "Maintenance performance, ticket ageing, and communication status."
    },
    'SAT': {
        title: "SAT",
        icon: ClipboardCheck,
        description: "Site acceptance testing progress and root cause analysis."
    },
    'Invoicing': {
        title: "Invoicing",
        icon: FileText,
        description: "Installation to invoicing workflow tracking."
    },
    'Revenue': {
        title: "Revenue",
        icon: IndianRupee,
        description: "Realized and pending revenue analysis with ageing."
    },
    'Meter Journey': {
        title: "Meter Journey",
        icon: Navigation,
        description: "End-to-end tracking of meter lifecycle from install to revenue."
    }
};

export const getDashboardsForDepartment = (deptName) => {
    const availableDashboards = [];

    Object.keys(dashboardData).forEach(dashKey => {
        const data = dashboardData[dashKey];
        // Check if this dashboard has any records for the given department
        // Added safety check for array
        const hasDeptData = Array.isArray(data) && data.some(item => item.department === deptName);

        if (hasDeptData && dashboardMeta[dashKey]) {
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
