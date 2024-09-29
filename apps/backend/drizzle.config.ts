/**
 * Config for drizzle-kit
 */
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./drizzle/schema.ts",
    out: "./drizzle/migrations",
    dialect: "mysql",
    dbCredentials: {
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
});
