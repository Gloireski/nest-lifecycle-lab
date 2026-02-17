import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private config: ConfigService
    ) {}

    async validateUser(email: string, password: string) {
        const user =  this.usersService.findByEmail(email);
        if(!user) return null;

        const isMatch =   await bcrypt.compare(password, user.password)
        if (!isMatch) throw new UnauthorizedException();

        const { password: _, ...result } = user;
        return result;
    }

    private async signAccessToken(userId: number, email: string) {
        return this.jwtService.signAsync(
            {sub: userId, email },
            { expiresIn: this.config.getOrThrow<JwtSignOptions['expiresIn']>(
                            'JWT_EXPIRES_IN')}
        )
    }

    private async signRefreshToken(userId: number) {
        return this.jwtService.signAsync(
            { sub: userId },
            { expiresIn: this.config.getOrThrow<JwtSignOptions['expiresIn']>(
                            'JWT_REFRESH_TOKEN_EXPIRES_IN') },
        )
    }

    async login(user: any) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        }

        return {
            // access_token: this.jwtService.sign(payload),
            access_token: await this.signAccessToken(user.id, user.email),
            refresh_token: await this.signRefreshToken(user.id),
        };
    }

    async refresh(token: string) {
        const payload = await this.jwtService.verifyAsync(token);

        // en prod: vérifier en db que toekn est valide
        return {
            accessToken: await this.signAccessToken(payload.sub, payload.email)
        }
    }
}
