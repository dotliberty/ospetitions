import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";

import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";

import { UsersService } from "../../users/users.service";
import { JwtPayload } from "./jwt-access.strategy";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(
        private readonly config: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
            secretOrKey: config.get<string>("JWT_REFRESH_SECRET")!,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: JwtPayload) {
        const refreshToken = req.body?.refreshToken;
        const isValid = await this.usersService.validateRefreshToken(payload.sub, refreshToken);
        if (!isValid) {
            throw new UnauthorizedException("Invalid refresh token");
        }
        return await this.usersService.findById(payload.sub);
    }
}
