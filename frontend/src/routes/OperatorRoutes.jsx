import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Layout from '../components/layout/Layout';
import OperatorDashboard from '../pages/operator/OperatorDashboard';

const OperatorRoutes = () => {
  return (
    <ProtectedRoute requiredRole="operator">
      <Layout role="operator">
        <Routes>
          <Route index element={<OperatorDashboard />} />
          <Route path="dashboard" element={<OperatorDashboard />} />
          {/* Add other operator routes here */}
        </Routes>
      </Layout>
    </ProtectedRoute>
  );
};

// Export as default
export default OperatorRoutes;