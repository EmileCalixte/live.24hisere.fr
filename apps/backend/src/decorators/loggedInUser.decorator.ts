import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "../types/User";

export interface AuthData {
    user: User;
    accessToken: string;
}

type RequestWithAuthData = Request & AuthData;

/**
 * Returns currently logged-in user and the access token which is used
 *
 * This decorator should be used only in controllers using the {@link AuthGuard}
 */
export const LoggedInUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): AuthData => {
        const request: RequestWithAuthData = ctx.switchToHttp().getRequest();

        return {
            user: request.user,
            accessToken: request.accessToken,
        };
    },
);
