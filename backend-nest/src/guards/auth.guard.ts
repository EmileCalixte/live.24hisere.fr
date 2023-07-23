import { type CanActivate, type ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { type Request } from "express";
import { AuthService } from "../services/auth.service";

const ACCESS_TOKEN_MUST_BE_PROVIDED_MESSAGE = "Access token must be provided";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.getTokenFromHeaders(request);

        if (!token) {
            throw new ForbiddenException(ACCESS_TOKEN_MUST_BE_PROVIDED_MESSAGE);
        }

        request.user = await this.authService.authenticateUser(token);

        return true;
    }

    private getTokenFromHeaders(request: Request): string | undefined {
        return request.headers.authorization;
    }
}
