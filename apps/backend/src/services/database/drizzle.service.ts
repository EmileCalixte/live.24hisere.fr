import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ExtractTablesWithRelations } from "drizzle-orm";
import { drizzle, MySql2Database, MySql2PreparedQueryHKT, MySql2QueryResultHKT } from "drizzle-orm/mysql2";
import { MySqlTransaction } from "drizzle-orm/mysql-core";
import mysql from "mysql2/promise";
import * as schema from "../../../drizzle/schema";
import { EnvService } from "../env.service";

export type Transaction = MySqlTransaction<
  MySql2QueryResultHKT,
  MySql2PreparedQueryHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger("DrizzleService");

  constructor(private readonly envService: EnvService) {}

  private connection: mysql.Pool | undefined = undefined;
  private db: MySql2Database<typeof schema>;

  onModuleInit(): void {
    this.logger.log("Initializing database connection...");

    this.db = drizzle({
      client: this.getConnection(),
      schema,
      mode: "default",
      casing: "snake_case",
    });

    this.logger.log("Database connection established");
  }

  async onModuleDestroy(): Promise<void> {
    await this.connection?.end();
  }

  public getConnection(): mysql.Pool {
    this.connection ??= this.createConnection();

    return this.connection;
  }

  public getDb(): MySql2Database<typeof schema> {
    return this.db;
  }

  private createConnection(): mysql.Pool {
    return mysql.createPool({
      host: this.envService.get("DB_HOST"),
      database: this.envService.get("DB_NAME"),
      user: this.envService.get("DB_USERNAME"),
      password: this.envService.get("DB_PASSWORD"),
    });
  }
}
