import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { useContainer } from "class-validator";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        origin: process.env.NODE_ENV === "development" ? "*" : process.env.FRONTEND_URL ?? " ",
        allowedHeaders: ["Authorization"],
    });

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.listen(3000);
}

void bootstrap();
