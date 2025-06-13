import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';

const Unauthorized = () => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        You don't have permission to access this page.
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/')}
      >
        Return to Home
      </Button>
    </Box>
  );
};

export default Unauthorized;