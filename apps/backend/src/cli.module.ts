import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { dependencies } from "./dependencies";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    ...dependencies.services.app,
    ...dependencies.services.database,
    ...dependencies.commands,
    ...dependencies.questionSets,
  ],
})
export class CliModule {}
