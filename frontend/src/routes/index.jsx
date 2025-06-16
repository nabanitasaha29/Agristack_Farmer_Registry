import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import Unauthorized from '../pages/Unauthorized';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Layout from '../components/layout/Layout';
import FarmerDashboard from '../pages/farmer/FarmerDashboard';
import MainFormPage from '../pages/MainFormPage/MainFormPage';
import FarmerDetailsPage from '../pages/farmer/FarmerDetailsPage';
import StatusView from '../pages/farmer/components/FarmerDetails/StatusView';
// Import operator components similarly...

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/register" element={<MainFormPage />} />
      {/* Farmer Routes */}
      <Route element={<ProtectedRoute requiredRole="farmer" />}>
        <Route path="/farmer" element={<Layout role="farmer" />}>
          <Route index element={<MainFormPage />} />
          <Route path="dashboard" element={<FarmerDashboard />} />
          {/* More farmer routes */}
          <Route path="/farmer/details" element={<FarmerDetailsPage />} />
          <Route path="/farmer/registration-details" element={<StatusView />} />
        </Route>
      </Route>

      {/* Operator Routes (similar structure) */}
      <Route element={<ProtectedRoute requiredRole="operator" />}>
        <Route path="/operator" element={<Layout role="operator" />}>
          <Route path="dashboard" element={<div>Operator Dashboard</div>} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
