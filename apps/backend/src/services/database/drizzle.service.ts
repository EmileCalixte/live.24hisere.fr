import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from "@nestjs/common";
import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../../../drizzle/schema";
import { EnvService } from "../env.service";

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger("DrizzleService");

    constructor(private readonly envService: EnvService) {}

    private connection: mysql.Pool;
    private db: MySql2Database<typeof schema>;

    onModuleInit(): void {
        this.logger.log("Initializing database connection...");

        this.initConnection();

        this.db = drizzle({
            client: this.connection,
            schema,
            mode: "default",
            casing: "snake_case",
        });

        this.logger.log("Database connection established");
    }

    async onModuleDestroy(): Promise<void> {
        await this.connection.end();
    }

    public getConnection(): mysql.Pool {
        return this.connection;
    }

    public getDb(): MySql2Database<typeof schema> {
        return this.db;
    }

    private initConnection(): void {
        if (this.connection) {
            return;
        }

        this.connection = mysql.createPool({
            host: this.envService.get("DB_HOST"),
            database: this.envService.get("DB_NAME"),
            user: this.envService.get("DB_USERNAME"),
            password: this.envService.get("DB_PASSWORD"),
        });
    }
}
