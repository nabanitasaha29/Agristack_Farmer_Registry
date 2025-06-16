// import React from 'react';

// const FarmerDashboard = () => {
//   return (
//     <div>
//       <h1>Farmer Dashboard</h1>
//       {/* Farmer dashboard content */}
//     </div>
//   );
// };

// export default FarmerDashboard;
import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useLocation } from "react-router-dom";

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query string
  const queryParams = new URLSearchParams(location.search);
  const farmerId = queryParams.get("farmerId");

  const handleRegisterNow = () => {
    navigate('/farmer/form'); // 👉 update with your actual form route
  };

  const handleAlreadyRegistered = () => {
    navigate('/farmer/details'); // 👉 update with your actual details route
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Farmer Dashboard
      </Typography>
      {farmerId && (
        <div className="bg-green-100 text-green-800 p-4 rounded shadow-md mb-4">
          ✅ You have been successfully registered. <br />
          Your <strong>Registration ID</strong> is:{" "}
          <span className="font-mono">{farmerId}</span>
        </div>
      )}
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleRegisterNow}>
          Register Now
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleAlreadyRegistered}>
          Already Registered
        </Button>
      </Box>
    </Box>
  );
};

export default FarmerDashboard;
