import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { useAuth } from '../../auth/useAuth'; // Consistent named import

const HomePage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFarmerLogin = async () => {
    try {
      await login('farmer');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleOperatorLogin = async () => {
    try {
      await login('operator');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="landing-container">
      <header className="header">
        <h1>Farmer Registry System</h1>
        <p>Select your login option to continue</p>
      </header>

      <div className="login-options">
        <div className="login-card farmer-card">
          <div className="card-content">
            <div className="icon">
              <i className="fas fa-tractor"></i>
            </div>
            <h2>Farmer </h2>
            <button className="login-btn farmer-btn" onClick={handleFarmerLogin}>
              Login as Farmer
            </button>
            <div className="register-section">
              <p className="register-text">Don't have an account?</p>
              <button
                className="login-btn farmer-btn"
                onClick={() => navigate('/register')}
              >
                Click Here to Register
              </button>
            </div>
          </div>
        </div>

        <div className="login-card operator-card">
          <div className="card-content">
            <div className="icon">
              <i className="fas fa-user-cog"></i>
            </div>
            <h2>Operator </h2>
            <button className="login-btn operator-btn" onClick={handleOperatorLogin}>
              Login as Operator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;