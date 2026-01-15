import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('login')
    async login(@Body() body: { email: string; password: string}) {
        const user = await this.authService.validateUser(
            body.email,
            body.password,
        );

        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }

        return this.authService.login(user);
    }
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@CurrentUser() user) {
        console.log(user)
        return user;
    }
}
