import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
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
          <Route path="/" element={<Navigate to="/executive" replace />} />
          <Route path="/executive" element={<ProtectedRoute><Home /></ProtectedRoute>} />

          {/* New Dashboard Flow */}
          <Route path="/dashboard/:dashKey" element={<ProtectedRoute><DeptSpecificDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/:dashKey/kpi/*" element={<ProtectedRoute><DeptSpecificDashboard /></ProtectedRoute>} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
