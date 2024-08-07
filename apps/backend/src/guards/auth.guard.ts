import { type CanActivate, type ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { type User } from "@prisma/client";
import { type Request } from "express";
import { type AuthService } from "../services/auth.service";

const ACCESS_TOKEN_MUST_BE_PROVIDED_MESSAGE = "Access token must be provided";

interface RequestWithAuthenticatedUser extends Request {
    user: User;
    accessToken: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<RequestWithAuthenticatedUser>();
        const token = this.getTokenFromHeaders(request);

        if (!token) {
            throw new ForbiddenException(ACCESS_TOKEN_MUST_BE_PROVIDED_MESSAGE);
        }

        /**
         * Insert user data in request. This data can be retrieved in controllers using param decorator {@link LoggedInUser}
         */
        request.user = await this.authService.authenticateUser(token);
        request.accessToken = token;

        return true;
    }

    private getTokenFromHeaders(request: Request): string | undefined {
        return request.headers.authorization;
    }
}
