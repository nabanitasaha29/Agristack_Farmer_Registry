import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../../auth/useAuth';

const AppBar = ({ role }) => {
  const { logout } = useAuth();
  
  return (
    <MuiAppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {role === 'farmer' ? 'Farmer Portal' : 'Operator Portal'}
        </Typography>
        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;