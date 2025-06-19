import React from 'react';
import { Button, Typography, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import './FarmerDashboard.css';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { username } = useAuth();

  const handleViewDetails = () => {
    navigate('/farmer/registration-detail');
  };

  return (
    <Container 
      maxWidth={false} 
      disableGutters 
      className="dashboard-container"
    >
      <Paper className="welcome-paper">
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            color: 'primary.main',
            mb: 4,
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}
        >
          Welcome {username}!
        </Typography>
        
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 6,
            fontWeight: 500,
            color: 'text.secondary',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          Your registration is complete
        </Typography>
        
        <Button 
          variant="contained" 
          size="large"
          onClick={handleViewDetails}
          sx={{
            px: 8,
            py: 2,
            fontSize: '1.2rem',
            borderRadius: 2,
            fontWeight: 600,
            minWidth: 300,
            height: 60
          }}
        >
          View Your Details
        </Button>
      </Paper>
    </Container>
  );
};

export default FarmerDashboard;