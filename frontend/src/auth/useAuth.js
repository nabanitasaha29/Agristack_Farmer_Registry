// src/auth/useAuth.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getKeycloak } from './keycloak';

export const useAuth = () => {
  const [authState, setAuthState] = useState({
    authenticated: false,
    roles: [],
    loginType: null,
    error: null,
    loading: false,
  });

  const navigate = useNavigate();

 const login = async (role) => {
  try {
    setAuthState((prev) => ({ ...prev, loading: true, loginType: role }));

    const kc = getKeycloak();
    await kc.login({
      redirectUri: `${window.location.origin}/${role}/dashboard`, // ✅ Let Keycloak handle redirect
      prompt: 'login',
    });

    // ❌ REMOVE this navigate call (it's never hit after redirect)
    // navigate(`/${role}/dashboard`);
  } catch (error) {
    setAuthState({
      authenticated: false,
      roles: [],
      loginType: null,
      error: error.message,
      loading: false,
    });
    throw error;
  }
};

  const logout = () => {
    const kc = getKeycloak();
    if (kc.authenticated) {
      kc.logout({ redirectUri: window.location.origin });
    }

    setAuthState({
      authenticated: false,
      roles: [],
      loginType: null,
      error: null,
      loading: false,
    });

    navigate('/');
  };

  return {
    authState,
    login,
    logout,
    hasRole: (role) => authState.roles.includes(role),
    isAuthenticated: authState.authenticated,
  };
};


