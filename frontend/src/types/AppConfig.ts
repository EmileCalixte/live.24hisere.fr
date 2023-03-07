/**
 * An object representing the application configuration
 */
interface AppConfig {
    /**
     * The base URL of the API
     */
    apiUrl: string;

    /**
     * Whether the application is in development mode or not. Should be false in production
     */
    devMode: boolean;
}

export default AppConfig;
