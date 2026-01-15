// src/auth/auth-module.options.ts
import type { JwtSignOptions } from "@nestjs/jwt";
export interface AuthModuleOptions {
  jwtSecret: string;
  tokenExpiresIn?: JwtSignOptions['expiresIn'];
}
