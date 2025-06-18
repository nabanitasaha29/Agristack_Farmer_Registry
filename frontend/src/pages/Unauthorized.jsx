import React from 'react';
import { useAuth } from '../auth/useAuth';
import { Button, Typography, Box } from '@mui/material';

const Unauthorized = () => {
  const { logout } = useAuth();
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
        onClick={logout}// even after being unauthorized the user was authenticated due to correct credentials so we need to logout
      >
        Return to Home
      </Button>
    </Box>
  );
};

export default Unauthorized;