import { Body, Controller, Get, Post, Res, Req,
    UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('login')
    async login(
        @Res({passthrough: true}) res,
        @Body() body: { email: string; password: string }
    ) {
        const user = await this.authService.validateUser(
            body.email,
            body.password,
        );

        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }
        const { access_token, refresh_token } = await this.authService.login(user); 
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/auth/refresh'
        })

        return { access_token };
    }

    @Post('refresh')
    async refresh(@Req() req) {
        // const token = req.cookies['refresh_token'];
        const token = req.cookies?.refresh_token;
        if (!token) throw new UnauthorizedException('No refesh token found');

        return this.authService.refresh(token);
    }

    @Post('logout')
    logout(@Res({passthrough: true}) res) {
        res.clearCookie('refresh_token');

        return { success: true}
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@CurrentUser() user) {
        console.log(user)
        return user;
    }
}
