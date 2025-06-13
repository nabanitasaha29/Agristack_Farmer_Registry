import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Import icons from your preferred icon library
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  
  const farmerItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/farmer/dashboard' },
    // Add more farmer-specific items
  ];
  
  const operatorItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/operator/dashboard' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/operator/settings' },
    // Add more operator-specific items
  ];
  
  const items = role === 'farmer' ? farmerItems : operatorItems;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          marginTop: '64px'
        },
      }}
    >
      <List>
        {items.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;