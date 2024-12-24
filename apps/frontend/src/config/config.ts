/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type AppConfig } from "../types/AppConfig";

const config: AppConfig = {
  apiUrl: import.meta.env.VITE_API_URL,
  devMode: import.meta.env.MODE === "development",
};

export default config;
