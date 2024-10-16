import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { useContainer } from "class-validator";
import { AppModule } from "../../src/app.module";

export async function initApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
        new ValidationPipe({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,

            // Prevent unwanted properties in request body by only taking into account properties listed in DTOs
            whitelist: true,
        }),
    );

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.init();

    return app;
}
