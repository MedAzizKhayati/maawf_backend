import { GenericEntity } from "@/generics/entity";
import capitalize from "@/utils/capitalize";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import { Gender } from "../enums/gender.enum";

@Entity()
export class Profile extends GenericEntity {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({
        nullable: true
    })
    birthday: Date;

    @Column({
        default: Gender.PREFER_NOT_TO_SAY,
        type: "enum",
        enum: Gender
    })
    gender: Gender;

    @Column({
        nullable: true
    })
    bio: string;

    @Column({
        nullable: true
    })
    avatar: string;

    @Column({
        nullable: true
    })
    cover: string;

    @BeforeInsert()
    @BeforeUpdate()
    async beforeUpdateOrInsert() {
        this.firstName = capitalize(this.firstName);
        this.lastName = capitalize(this.lastName);
    }
}
