// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import ProtectedRoute from '../components/common/ProtectedRoute';
// import FarmerLayout from '../components/layout/Layout';
// import FarmerDashboard from '../pages/farmer/FarmerDashboard';

// const FarmerRoutes = () => {
//   return (
//     <ProtectedRoute requiredRole="farmer">
//       <FarmerLayout>
//         <Routes>
//           <Route path="dashboard" element={<FarmerDashboard />} />
//           {/* Add other farmer routes here */}
//         </Routes>
//       </FarmerLayout>
//     </ProtectedRoute>
//   );
// };

// export default FarmerRoutes;



import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Layout from '../components/layout/Layout';
import FarmerDashboard from '../pages/farmer/FarmerDashboard';

const FarmerRoutes = () => {
  return (
    <ProtectedRoute requiredRole="farmer">
      <Layout role="farmer">
        <Routes>
          <Route index element={<FarmerDashboard />} />
          <Route path="dashboard" element={<FarmerDashboard />} />
          {/* Add other farmer routes here */}
        </Routes>
      </Layout>
    </ProtectedRoute>
  );
};

export default FarmerRoutes;