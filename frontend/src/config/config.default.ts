// Copy this file to ./config.ts and fill in the values

import AppConfig from "../types/AppConfig";

const config: AppConfig = {
    apiUrl: 'API_URL', // For dev with docker: `${window.location.protocol}//${window.location.hostname}:8000`
    devMode: true, // Must be false in production
};

export default config;
