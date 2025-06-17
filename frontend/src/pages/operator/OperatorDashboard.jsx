// src/pages/operator/OperatorDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import './OperatorDashboard.css';

const OperatorDashboard = () => {
  const { username } = useAuth(); // Get username from Keycloak

  return (
    <div className="operator-dashboard">
      <h1>Welcome, {username}</h1>
      <div className="dashboard-options">
        <Link to="/register" className="dashboard-card">
          <h2>Register a New Farmer</h2>
          <p>Add new farmers to the system</p>
        </Link>
        <Link to="/operator/registered-farmers" className="dashboard-card">
          <h2>Registered Farmers</h2>
          <p>View and manage existing farmers</p>
        </Link>
      </div>
    </div>
  );
};

export default OperatorDashboard;