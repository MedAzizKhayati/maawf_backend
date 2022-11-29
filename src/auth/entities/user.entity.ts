import { GenericEntity } from '@/generics/entity';
import { Profile } from '@/profile/entities/profile.entity';
import { Entity, Column, OneToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';

// https://online.visual-paradigm.com/app/diagrams/#LUML%20ANGULAR%20PROJECT
@Entity()
export class User extends GenericEntity {
    @Column({
        unique: true
    })
    email: string;

    @Column()
    password: string;

    @Column({
        nullable: true
    })
    phonenumber: string;

    @OneToOne(
        () => Profile,
        {
            cascade: true,
            eager: true,
        }
    )
    @JoinColumn()
    profile: Profile;

    @BeforeInsert()
    @BeforeUpdate()
    async updatePassword() {
        this.password = await this.hashPassword(this.password);
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }
}