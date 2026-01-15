import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string) {
        const user =  this.usersService.findByEmail(email);
        if(!user) return null;

        const isMatch =   await bcrypt.compare(password, user.password)
        if (!isMatch) throw new UnauthorizedException();

        const { password: _, ...result } = user;
        return result;
    }

    async login(user: any) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        }

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
