import {
    Controller, Get, Body,
    Patch, UseGuards, Request
} from "@nestjs/common";

import { UsersService } from "./users.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { JwtAccessGuard } from "../auth/guards/jwt-access.guard";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get("me")
    @UseGuards(JwtAccessGuard)
    async getMe(@Request() req: any) {
        const { passwordHash, refreshTokenHash, ...safeUser } = req.user;
        return safeUser;
    }

    @Patch("me")
    @UseGuards(JwtAccessGuard)
    async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
        const updatedUser = await this.usersService.updateProfile(req.user.id, dto);
        const { passwordHash, refreshTokenHash, ...safeUser } = updatedUser;
        return safeUser;
    }
}
