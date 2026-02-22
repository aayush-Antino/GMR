import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import GenericDashboard from './pages/GenericDashboard';

import DepartmentPerformance from './pages/DepartmentPerformance';

import DepartmentDashboardList from './pages/DepartmentDashboardList';
import DeptSpecificDashboard from './pages/DeptSpecificDashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={<Navigate to="/departments/dept_1" replace />} />
          <Route path="/executive" element={<ProtectedRoute><Home /></ProtectedRoute>} />

          {/* New Department Flow */}
          <Route path="/departments/:deptId" element={<ProtectedRoute><DepartmentDashboardList /></ProtectedRoute>} />
          <Route path="/departments/:deptId/dashboard/:dashKey" element={<ProtectedRoute><DeptSpecificDashboard /></ProtectedRoute>} />
          <Route path="/departments/:deptId/dashboard/:dashKey/kpi/:kpiName" element={<ProtectedRoute><DeptSpecificDashboard /></ProtectedRoute>} />

          {/* Department Performance */}
          <Route path="/departments" element={<ProtectedRoute><DepartmentPerformance /></ProtectedRoute>} />

          {/* Placeholders for new Executive Sections */}
          <Route path="/risk" element={<ProtectedRoute><GenericDashboard title="Risk Overview" description="Comprehensive risk assessment and mitigation strategies." dataKey="dashboard3" /></ProtectedRoute>} />
          <Route path="/risk/kpi/:kpiName" element={<ProtectedRoute><GenericDashboard title="Risk Overview" description="Comprehensive risk assessment and mitigation strategies." dataKey="dashboard3" /></ProtectedRoute>} />

          <Route path="/trends" element={<ProtectedRoute><GenericDashboard title="Long-term Trends" description="Historical performance analysis and future forecasting." dataKey="dashboard8" /></ProtectedRoute>} />
          <Route path="/trends/kpi/:kpiName" element={<ProtectedRoute><GenericDashboard title="Long-term Trends" description="Historical performance analysis and future forecasting." dataKey="dashboard8" /></ProtectedRoute>} />

          <Route path="/recommendations" element={<ProtectedRoute><GenericDashboard title="Strategic Recommendations" description="Actionable insights for performance improvement." dataKey="dashboard5" /></ProtectedRoute>} />
          <Route path="/recommendations/kpi/:kpiName" element={<ProtectedRoute><GenericDashboard title="Strategic Recommendations" description="Actionable insights for performance improvement." dataKey="dashboard5" /></ProtectedRoute>} />

          {/* Gallery & Legacy Routes */}

          <Route path="/dashboard1" element={<ProtectedRoute><GenericDashboard title="Dashboard 1: Executive Overview" description="High-level business summary and key performance indicators." dataKey="dashboard1" /></ProtectedRoute>} />
          <Route path="/dashboard1/kpi/:kpiName" element={<ProtectedRoute><GenericDashboard title="Dashboard 1: Executive Overview" description="High-level business summary and key performance indicators." dataKey="dashboard1" /></ProtectedRoute>} />

          <Route path="/dashboard2" element={<ProtectedRoute><GenericDashboard title="Dashboard 2: Department KPIs" description="Detailed performance metrics broken down by department." dataKey="dashboard2" /></ProtectedRoute>} />
          <Route path="/dashboard2/kpi/:kpiName" element={<ProtectedRoute><GenericDashboard title="Dashboard 2: Department KPIs" description="Detailed performance metrics broken down by department." dataKey="dashboard2" /></ProtectedRoute>} />

          <Route path="/dashboard3" element={<ProtectedRoute><GenericDashboard title="Dashboard 3: Anomaly Monitoring" description="Real-time detection and tracking of data anomalies." dataKey="dashboard3" /></ProtectedRoute>} />
          <Route path="/dashboard3/kpi/:kpiName" element={<ProtectedRoute><GenericDashboard title="Dashboard 3: Anomaly Monitoring" description="Real-time detection and tracking of data anomalies." dataKey="dashboard3" /></ProtectedRoute>} />

          <Route path="/dashboard4" element={<ProtectedRoute><GenericDashboard title="Dashboard 4: Data Gap Analysis" description="Identification of missing, incomplete, or inconsistent data points." dataKey="dashboard4" /></ProtectedRoute>} />
          <Route path="/dashboard4/kpi/:kpiName" element={<ProtectedRoute><GenericDashboard title="Dashboard 4: Data Gap Analysis" description="Identification of missing, incomplete, or inconsistent data points." dataKey="dashboard4" /></ProtectedRoute>} />

          <Route path="/dashboard5" element={<ProtectedRoute><GenericDashboard title="Dashboard 5: Anomaly Analytics" description="Real-time detection, severity analysis, and trend tracking of anomalies." dataKey="dashboard5" chartTitles={{ bar: "Top Repeat Offenders (Meters)", pie: "Anomalies by Severity", line: "Anomaly Volume Trends" }} /></ProtectedRoute>} />
          <Route path="/dashboard5/kpi/:kpiName" element={<ProtectedRoute><GenericDashboard title="Dashboard 5: Anomaly Analytics" description="Real-time detection, severity analysis, and trend tracking of anomalies." dataKey="dashboard5" chartTitles={{ bar: "Top Repeat Offenders (Meters)", pie: "Anomalies by Severity", line: "Anomaly Volume Trends" }} /></ProtectedRoute>} />

          <Route path="/dashboard6" element={<ProtectedRoute><GenericDashboard title="Dashboard 6: Priority Analysis" description="Focus on High-Priority KPIs and critical alert items." dataKey="dashboard6" /></ProtectedRoute>} />
          <Route path="/dashboard6/kpi/:kpiName" element={<ProtectedRoute><GenericDashboard title="Dashboard 6: Priority Analysis" description="Focus on High-Priority KPIs and critical alert items." dataKey="dashboard6" /></ProtectedRoute>} />

          <Route path="/dashboard7" element={<ProtectedRoute><GenericDashboard title="Dashboard 7: Source System Dependency" description="Monitoring the status and health of data source systems." dataKey="dashboard7" /></ProtectedRoute>} />
          <Route path="/dashboard7/kpi/:kpiName" element={<ProtectedRoute><GenericDashboard title="Dashboard 7: Source System Dependency" description="Monitoring the status and health of data source systems." dataKey="dashboard7" /></ProtectedRoute>} />

          <Route path="/dashboard8" element={<ProtectedRoute><GenericDashboard title="Dashboard 8: Performance Trends" description="Long-term historical performance analysis and forecasting." dataKey="dashboard8" /></ProtectedRoute>} />
          <Route path="/dashboard8/kpi/:kpiName" element={<ProtectedRoute><GenericDashboard title="Dashboard 8: Performance Trends" description="Long-term historical performance analysis and forecasting." dataKey="dashboard8" /></ProtectedRoute>} />

          <Route path="/dashboard9" element={<ProtectedRoute><GenericDashboard title="Dashboard 9: KPI Dictionary" description="Comprehensive definition and metadata for all localized KPIs." dataKey="dashboard9" /></ProtectedRoute>} />
          <Route path="/dashboard9/kpi/:kpiName" element={<ProtectedRoute><GenericDashboard title="Dashboard 9: KPI Dictionary" description="Comprehensive definition and metadata for all localized KPIs." dataKey="dashboard9" /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
