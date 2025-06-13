// import React from 'react'
// import LandingPage from './pages/LandingPage/LandingPage'
// import HomePage from './pages/HomePage/HomePage'

// const App = () => {
//   return (
//     <div>
//       <HomePage/>
//     </div>
//   )
// }

// export default App


import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './auth/AuthProvider';
import AppRoutes from './routes';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
