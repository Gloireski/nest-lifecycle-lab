import { 
  CanActivate,
  ExecutionContext,
  Injectable 
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    // const token = this.ex
    return req.headers.authorization === 'Bearer valid-token';
  }
}
