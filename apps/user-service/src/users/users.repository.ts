import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repo: Repository<UserEntity>
    ) {}

    async findById(id: string): Promise<UserEntity | null> {
        return this.repo.findOneBy({ id });
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.repo.findOneBy({ email });
    }

    async createUser(user: Partial<UserEntity>): Promise<UserEntity> {
        const newUser = this.repo.create(user);
        return this.repo.save(newUser);
    }

    async updateUser(id: string, data: Partial<UserEntity>): Promise<void> {
        await this.repo.update(id, data);
    }

    async setRefreshToken(id: string, hash: string | null): Promise<void> {
        await this.repo.update(id, { refreshTokenHash: hash });
    }
}
