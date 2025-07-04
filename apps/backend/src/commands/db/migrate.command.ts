import { Injectable, Logger } from "@nestjs/common";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { Command, CommandRunner } from "nest-commander";
import path from "node:path";
import { DrizzleService } from "../../services/database/drizzle.service";

@Injectable()
@Command({
  name: "migrate",
  description: "Run Drizzle migrations",
})
export class MigrateCommand extends CommandRunner {
  private readonly logger = new Logger("MigrateCommand");

  constructor(private readonly drizzleService: DrizzleService) {
    super();
  }

  async run(): Promise<void> {
    // TODO Find a way to avoid hardcoding the path (careful: at runtime, we're in the dist dir)
    const migrationsFolder = path.resolve(__dirname, "../../../../drizzle/migrations");
    this.logger.log(migrationsFolder);

    this.logger.log("Running Drizzle migrations...");
    await migrate(this.drizzleService.getDb(), { migrationsFolder });
    this.logger.log("Done");
  }
}
