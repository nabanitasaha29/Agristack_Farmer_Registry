// src/routes/FarmerRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Layout from "../components/layout/Layout";
import FarmerDashboard from "../pages/farmer/FarmerDashboard";
import StatusView from "../pages/farmer/components/FarmerDetails/StatusView";
import CredentialsForm from "../pages/farmer/components/FarmerDetails/CredentialsForm"; // Add this if not already

const FarmerRoutes = () => {
  return (
    <ProtectedRoute requiredRole="farmer">
      <Layout role="farmer">
        <Routes>
          <Route index element={<FarmerDashboard />} />
          <Route path="dashboard" element={<FarmerDashboard />} />
          <Route path="details" element={<CredentialsForm />} />
          <Route path="registration-details" element={<StatusView />} />
        </Routes>
      </Layout>
    </ProtectedRoute>
  );
};

export default FarmerRoutes;
