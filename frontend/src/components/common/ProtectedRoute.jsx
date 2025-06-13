// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../../auth/useAuth'; // Changed to named import

// const ProtectedRoute = ({ children, requiredRole }) => {
//   const { isAuthenticated, hasRole } = useAuth();

//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   if (requiredRole && !hasRole(requiredRole)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;

import React from 'react';
import { Navigate,Outlet } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <div>Loading...</div>;
  }

  if (!keycloak.authenticated) {
    return <Navigate to="/" replace />;
  }

  const roles = keycloak?.tokenParsed?.realm_access?.roles || [];

  if (requiredRole && !roles.includes(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // return children;
    return <Outlet />;
};

export default ProtectedRoute;
