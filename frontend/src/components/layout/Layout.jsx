// Layout.jsx
import React from 'react';
import AppBar from './AppBar';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';
import { Outlet ,useLocation} from 'react-router-dom';

// const Layout = ({ children, role }) => {
  const Layout = () => {
  const { pathname } = useLocation();
  const role = pathname.includes('/operator') ? 'operator' : 'farmer';
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar role={role} />
      <Sidebar role={role} />
      <Box component="main" sx={{ 
        flexGrow: 1,
        p: 3,
        marginTop: '64px',
        backgroundColor: '#f9f9f9',
        minHeight: 'calc(100vh - 64px)'
      }}>
        {/* {children} */}
          <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;