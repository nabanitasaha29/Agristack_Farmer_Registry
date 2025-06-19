// src/auth/AuthProvider.jsx
import React from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { getKeycloak } from "./keycloak";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorBoundary from "./ErrorBoundary";

const AuthProvider = ({ children }) => {
  const keycloak = getKeycloak();

  // In your AuthProvider.jsx
  const handleOnEvent = (event, error) => {
    if (event === "onAuthError") {
      console.error("Authentication error:", error);
    }

    if (event === "onTokenExpired") {
      keycloak.updateToken(30).catch((e) => {
        console.error("Token refresh error:", e);
        keycloak.login(); // Force re-authentication if refresh fails
      });
    }
  };

  return (
    <ErrorBoundary>
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{
          // onLoad: 'login-required', // or 'login-required'
          onLoad: "check-sso",
          pkceMethod: "S256",
          checkLoginIframe: false,
        }}
        onEvent={handleOnEvent}
        autoRefreshToken={true}
        LoadingComponent={
          <LoadingSpinner message="Initializing authentication..." />
        }
      >
        {children}
      </ReactKeycloakProvider>
    </ErrorBoundary>
  );
};

export default AuthProvider;
