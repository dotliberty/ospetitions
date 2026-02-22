import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health/health.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './users/entities/user.entity';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),

        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                url: config.get('DATABASE_URL'),
                schema: 'users', // Используем отдельную схему для изоляции
                entities: [UserEntity],
                synchronize: config.get('NODE_ENV') !== 'production',
                logging: config.get('NODE_ENV') === 'development',
            }),
        }),

        UsersModule,
        AuthModule,
    ],
    controllers: [HealthController],
})
export class AppModule {}
