import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";

import * as bcrypt from "bcryptjs";

import { UsersRepository } from "./users.repository";
import { UserEntity } from "./entities/user.entity";

import { UpdateProfileDto } from "./dto/update-profile.dto";
import { RegisterDto } from "./dto/register.dto";

const BCRYPT_ROUNDS = 12;

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepo: UsersRepository
    ) {}
    
    async register(dto: RegisterDto): Promise<UserEntity> {
        const existingUser = await this.usersRepo.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException("Email is already in use");
        }

        const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

        return this.usersRepo.createUser({
            email: dto.email,
            passwordHash,
            displayName: dto.displayName,
            previousSessionId: dto.previousSessionId ?? null,
        });
    }

    async validatePassword(email: string, password: string): Promise<UserEntity | null> {
        const user = await this.usersRepo.findByEmail(email);
        if (!user) {
            return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        return isValid ? user : null;
    }

    async findById(id: string): Promise<UserEntity> {
        const user = await this.usersRepo.findById(id);
        if (!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }

    async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserEntity> {
        await this.usersRepo.updateUser(userId, dto);

        return this.findById(userId);
    }

    async setRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
        const hash = refreshToken
            ? await bcrypt.hash(refreshToken, BCRYPT_ROUNDS)
            : null;

        await this.usersRepo.setRefreshToken(userId, hash);
    }

    async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
        const user = await this.findById(userId);
        if (!user.refreshTokenHash) {
            return false;
        }

        return await bcrypt.compare(refreshToken, user.refreshTokenHash);
    }
}