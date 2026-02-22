import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { ConfigService } from "@nestjs/config";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

import { JwtAccessStrategy } from "./strategies/jwt-access.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";

import { JwtAccessGuard } from "./guards/jwt-access.guard";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";

import { UsersModule } from "../users/users.module";

import { OsKafkaClient } from "@ospetitions/kafka-client";

@Module({
    imports: [
        UsersModule,
        PassportModule,

        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService)=> ({
                secret: config.get('JWT_ACCESS_SECRET'),
            }),
        }),
    ],

    controllers: [AuthController],

    providers: [
        AuthService,
        JwtAccessStrategy,
        JwtRefreshStrategy,
        JwtAccessGuard,
        JwtRefreshGuard,

        {
            provide: OsKafkaClient,
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const client = new OsKafkaClient({
                    clientId: 'user-service',
                    brokers: config.get<string>('KAFKA_BROKERS')!.split(','),
                });

                client.connect();

                return client;
            },
        },
    ]
})
export class AuthModule {}
