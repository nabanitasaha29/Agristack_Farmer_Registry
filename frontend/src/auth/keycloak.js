


// src/auth/keycloak.js
import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'https://developer.agristack.gov.in/auth',
  realm: 'FR_Workflow',
  clientId: 'farmer-registry',
};

let keycloakInstance = new Keycloak(keycloakConfig);

export const getKeycloak = () => keycloakInstance;

export const clearKeycloak = () => {
  keycloakInstance = new Keycloak(keycloakConfig);
};

