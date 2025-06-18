import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Layout from "../components/layout/Layout";
import FarmerDashboard from "../pages/farmer/FarmerDashboard";
import MainFormPage from "../pages/MainFormPage/MainFormPage";
import FarmerDetailsPage from "../pages/farmer/FarmerDetailsPage";
import StatusView from "../pages/farmer/components/FarmerDetails/StatusView";
import OperatorDashboard from "../pages/operator/OperatorDashboard";
import RegisteredFarmers from "../pages/operator/components/RegisteredFarmers";
import FarmerDetails from "../pages/operator/components/FarmerDetails";
import RegistrationDetails from "../pages/farmer/components/RegistrationDetails";


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
          <Route path="/farmer/details" element={<FarmerDetailsPage />} />
          <Route path="/farmer/registration-details" element={<StatusView />} />
          <Route path="/farmer/registration-detail" element={<RegistrationDetails />} />
        </Route>
      </Route>

      {/* Operator Routes */}
      <Route element={<ProtectedRoute requiredRole="operator" />}>
        <Route path="/operator" element={<Layout role="operator" />}>
          <Route path="dashboard" element={<OperatorDashboard />} />
          <Route path="registered-farmers" element={<RegisteredFarmers />} />
          <Route path="farmer-details/:farmerId" element={<FarmerDetails />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
