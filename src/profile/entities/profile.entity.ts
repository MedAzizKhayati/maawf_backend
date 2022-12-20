import { GroupChatToProfile } from "@/chat/entities/group-chat-to-profile.entity";
import { Message } from "@/chat/entities/message.entity";
import { GenericEntity } from "@/generics/entity";
import { Comment } from "@/post/entities/comment.entity";
import { Post } from "@/post/entities/post.entity";
import { React } from "@/post/entities/react.entity";
import capitalize from "@/utils/capitalize";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import { Gender } from "../enums/gender.enum";
import { Friendship } from "./friendship.entity";

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

    @OneToMany(() => GroupChatToProfile, groupChatToProfile => groupChatToProfile.profile)
    public groupChatToProfiles: GroupChatToProfile[];

    @OneToMany(() => Message, message => message.profile)
    public messages: Message[];

    @OneToMany(() => Friendship, friendship => friendship.receiver)
    public incomingFriendRequests: Friendship[];

    @OneToMany(() => Friendship, friendship => friendship.receiver)
    public outgoingFriendRequests: Friendship[];

    @OneToMany(()=>Post, post => post.profile)
    public posts: Post[];
    
    @OneToMany(()=>Comment, comment => comment.profile)
    public comments: Comment[];

    @OneToMany(()=>React,react=>react.profile)
    public reacts: React[];

    

    @BeforeInsert()
    @BeforeUpdate()
    async beforeUpdateOrInsert() {
        this.firstName = capitalize(this.firstName);
        this.lastName = capitalize(this.lastName);
    }
}
