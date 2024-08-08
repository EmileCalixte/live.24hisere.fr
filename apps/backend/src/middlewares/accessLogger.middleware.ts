import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class AccessLoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger("Access");

    use(request: Request, response: Response, next: NextFunction): void {
        const startMs = new Date().getTime();

        const { ip, method, originalUrl: url } = request;
        const userAgent = request.get("user-agent");

        response.on("finish", () => {
            const { statusCode } = response;
            const contentLength = response.get("content-length");
            const duration = new Date().getTime() - startMs;

            this.logger.log(
                `${method} ${url} - ${statusCode} (${duration} ms, length: ${contentLength ?? "unknown"}) - ${userAgent ?? "Unknown user-agent"} ${ip}`,
            );
        });

        next();
    }
}
