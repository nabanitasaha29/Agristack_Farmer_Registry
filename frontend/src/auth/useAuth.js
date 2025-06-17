// src/auth/useAuth.js
import { useKeycloak } from '@react-keycloak/web';

export const useAuth = () => {
  const { keycloak, initialized } = useKeycloak();

  const login = async (role) => {
    try {
      await keycloak.login({
        redirectUri: `${window.location.origin}/${role}/dashboard`,
        prompt: 'login',
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };

  const isAuthenticated = keycloak?.authenticated;
  const roles = keycloak?.tokenParsed?.realm_access?.roles || [];
  const username = keycloak?.tokenParsed?.preferred_username || keycloak?.tokenParsed?.name || "User";

  return {
    initialized,
    isAuthenticated,
    roles,
    username,  // Add this line
    userInfo: keycloak?.tokenParsed,  // Add this for full user info
    login,
    logout,
    hasRole: (role) => roles.includes(role),
  };
};