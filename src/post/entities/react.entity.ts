import { GenericEntity } from "@/generics/entity";
import { Profile } from "@/profile/entities/profile.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Post } from "./post.entity";


@Entity()
export class React extends GenericEntity {
    
    @Column({
        type: "enum",
        enum: ["like", "love", "haha", "wow", "sad", "angry"],
    })
    type: "like" | "love" | "haha" | "wow" | "sad" | "angry";

    @ManyToOne(() => Post, post => post.reacts)
    post: Post;
    @ManyToOne(() => Profile, profile => profile.reacts)
    profile: Profile;

}