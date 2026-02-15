import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GenericDashboard from './pages/GenericDashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import DepartmentPerformance from './pages/DepartmentPerformance';
import DashboardGallery from './pages/DashboardGallery';

function App() {
  return (
    <Router>
      <Routes>
        {/* Executive Summary as Main Dashboard */}
        <Route path="/" element={<Home />} />

        {/* Department Performance */}
        <Route path="/departments" element={<DepartmentPerformance />} />

        {/* Placeholders for new Executive Sections using GenericDashboard for now */}
        <Route path="/risk" element={<GenericDashboard title="Risk Overview" description="Comprehensive risk assessment and mitigation strategies." dataKey="dashboard3" />} />
        <Route path="/trends" element={<GenericDashboard title="Long-term Trends" description="Historical performance analysis and future forecasting." dataKey="dashboard8" />} />
        <Route path="/recommendations" element={<GenericDashboard title="Strategic Recommendations" description="Actionable insights for performance improvement." dataKey="dashboard5" />} />

        {/* Gallery & Legacy Routes for Showcase */}
        <Route path="/gallery" element={<DashboardGallery />} />
        <Route path="/dashboard1" element={<GenericDashboard title="Dashboard 1: Executive Overview" description="High-level business summary and key performance indicators." dataKey="dashboard1" />} />
        <Route path="/dashboard2" element={<GenericDashboard title="Dashboard 2: Department KPIs" description="Detailed performance metrics broken down by department." dataKey="dashboard2" />} />
        <Route path="/dashboard3" element={<GenericDashboard title="Dashboard 3: Anomaly Monitoring" description="Real-time detection and tracking of data anomalies." dataKey="dashboard3" />} />
        <Route path="/dashboard4" element={<GenericDashboard title="Dashboard 4: Data Gap Analysis" description="Identification of missing, incomplete, or inconsistent data points." dataKey="dashboard4" />} />
        <Route path="/dashboard5" element={<GenericDashboard title="Dashboard 5: Feasibility Tracking" description="Tracking the technical and operational feasibility of KPI implementation." dataKey="dashboard5" />} />
        <Route path="/dashboard6" element={<GenericDashboard title="Dashboard 6: Priority Analysis" description="Focus on High-Priority KPIs and critical alert items." dataKey="dashboard6" />} />
        <Route path="/dashboard7" element={<GenericDashboard title="Dashboard 7: Source System Dependency" description="Monitoring the status and health of data source systems." dataKey="dashboard7" />} />
        <Route path="/dashboard8" element={<GenericDashboard title="Dashboard 8: Performance Trends" description="Long-term historical performance analysis and forecasting." dataKey="dashboard8" />} />
        <Route path="/dashboard9" element={<GenericDashboard title="Dashboard 9: KPI Dictionary" description="Comprehensive definition and metadata for all localized KPIs." dataKey="dashboard9" />} />

      </Routes>
    </Router>
  );
}

export default App;
