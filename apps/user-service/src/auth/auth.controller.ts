// apps/user-service/src/auth/auth.controller.ts
import {
    Controller, Post, Body, UseGuards,
    Request, HttpCode, HttpStatus
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { UsersService } from '../users/users.service';
import { RegisterDto } from '../users/dto/register.dto';

import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAccessGuard } from './guards/jwt-access.guard';

import { UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const user = await this.usersService.register(dto);
        const tokens = await this.authService.generateTokens(user);

        await this.authService.emitUserRegistered(user);

        return {
            user: { id: user.id, email: user.email, displayName: user.displayName },
            ...tokens,
        };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.usersService.validatePassword(body.email, body.password);

        if (!user) {
            throw new UnauthorizedException('Неверный email или пароль');
        }

        const tokens = await this.authService.generateTokens(user);

        return {
            user: { id: user.id, email: user.email, displayName: user.displayName },
            ...tokens,
        };
    }

    @Post('refresh')
    @UseGuards(JwtRefreshGuard)
    @HttpCode(HttpStatus.OK)
    async refresh(@Request() req: any) {
        return this.authService.generateTokens(req.user);
    }

    @Post('logout')
    @UseGuards(JwtAccessGuard)
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req: any) {
        await this.authService.logout(req.user.id);
        
        return { message: 'Выход выполнен успешно' };
    }
}
