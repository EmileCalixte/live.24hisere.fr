import {Injectable, Logger, NestMiddleware} from "@nestjs/common";
import {NextFunction, Request, Response} from "express";

@Injectable()
export class AccessLoggerMiddleware implements NestMiddleware {
    private logger = new Logger("Access");

    use(request: Request, response: Response, next: NextFunction) {
        const {ip, method, originalUrl: url} = request;
        const userAgent = request.get("user-agent");

        response.on("finish", () => {
            const {statusCode} = response;
            const contentLength = response.get("content-length");

            this.logger.log(`${method} ${url} - ${statusCode} (length: ${contentLength}) - ${userAgent} ${ip}`);
        });

        next();
    }
}
