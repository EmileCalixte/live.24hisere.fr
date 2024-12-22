import { HttpStatus, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { useContainer } from "class-validator";
import { AppModule } from "./app.module";
import { NODE_ENV_DEVELOPMENT } from "./constants/env.constants";
import { setupSwagger } from "./swagger";

/**
 * Web app entrypoint
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,

      // Prevent unwanted properties in request body by only taking into account properties listed in DTOs
      whitelist: true,
    }),
  );

  app.enableCors({
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    origin: process.env.NODE_ENV === NODE_ENV_DEVELOPMENT ? "*" : (process.env.FRONTEND_URL ?? " "),
    allowedHeaders: ["Authorization", "Content-Type"],
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  setupSwagger(app);

  await app.listen(8000);
}

void bootstrap();
