import { Logger } from "@nestjs/common";
import { CommandFactory } from "nest-commander";
import { CliModule } from "./cli.module";

async function bootstrap(): Promise<void> {
  await CommandFactory.run(CliModule, new Logger());
}

void bootstrap();
