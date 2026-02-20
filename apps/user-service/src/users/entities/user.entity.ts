import { 
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, UpdateDateColumn
} from "typeorm";

@Entity({ schema: 'users', name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    passwordHash!: string;

    @Column({ nullable: true })
    displayName!: string;

    @Column('simple-array',  { default: '' })
    preferredCategories!: string[];

    @Column('simple-array',  { default: '' })
    preferredTags!: string[];

    @Column({ nullable: true })
    refreshTokenHash!: string | null;

    @Column({ nullable: true })
    previousSessionId!: string | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
