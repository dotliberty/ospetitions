import { 
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, UpdateDateColumn
} from "typeorm";

import { PetitionHistoryEntry, PetitionInteractionType } from "@ospetitions/shared-types";

@Entity({ schema: 'users', name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('varchar', { unique: true })
    email!: string;

    @Column('varchar')
    passwordHash!: string;

    @Column('varchar', { nullable: true })
    displayName!: string;

    @Column('simple-array',  { default: '' })
    preferredCategories!: string[];

    @Column('simple-array',  { default: '' })
    preferredTags!: string[];

    @Column('jsonb', { default: [] })
    signedPetitionIds!: string[];

    @Column('jsonb', { default: [] })
    petitionHistory!: PetitionHistoryEntry[];

    @Column('varchar', { nullable: true })
    refreshTokenHash!: string | null;

    @Column('varchar', { nullable: true })
    previousSessionId!: string | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
