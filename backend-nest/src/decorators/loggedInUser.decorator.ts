import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {User} from "@prisma/client";

interface RequestWithUser extends Request {
    user?: User;
}

export const LoggedInUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): User | undefined => {
        const request: RequestWithUser = ctx.switchToHttp().getRequest();
        return request.user;
    }
);
