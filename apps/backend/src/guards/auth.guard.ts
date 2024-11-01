import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { User } from "@live24hisere/core/types";
import { AuthService } from "../services/auth.service";

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
      throw new UnauthorizedException(ACCESS_TOKEN_MUST_BE_PROVIDED_MESSAGE);
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
