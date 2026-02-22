import { Injectable } from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { UsersService } from "../users/users.service";
import { UserEntity } from "../users/entities/user.entity";

import { OsKafkaClient } from "@ospetitions/kafka-client";
import { UserRegisteredEvent } from "@ospetitions/shared-types";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
        private readonly kafkaClient: OsKafkaClient,
    ) {}

    async generateTokens(user: UserEntity) {
        const payload = { sub: user.id, email: user.email };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_ACCESS_SECRET'),
                expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN'),
            }),

            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
                expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
            }),
        ]);

        await this.usersService.setRefreshToken(user.id, refreshToken);

        return { accessToken, refreshToken };
    }

    async logout(userId: string): Promise<void> {
        await this.usersService.setRefreshToken(userId, null);
    }

    async emitUserRegistered(user: UserEntity): Promise<void> {
        const event: UserRegisteredEvent = {
            eventType: 'user.registered',
            userId: user.id,
            sessionId: user.previousSessionId ?? undefined,
            timestamp: new Date().toISOString(),
        };

        await this.kafkaClient.emit(event);
    }
}
