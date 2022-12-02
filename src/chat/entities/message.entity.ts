import { GenericEntity } from "@/generics/entity";
import { Profile } from "@/profile/entities/profile.entity";
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from "typeorm";
import { GroupChat } from "./group-chat.entity";

export type MessageData = {
    text?: string;
    attachments?: string[];
}

export type SeenData = {
    [key: string]: boolean;
}

@Entity()
export class Message extends GenericEntity {
    @Column({
        type: "json",
        default: JSON.stringify({}),
    })
    data: MessageData;

    @Column({
        type: "json",
        default: JSON.stringify({}),
    })
    seen: SeenData;

    @ManyToOne(
        () => GroupChat,
        (groupChat) => groupChat.messages,
        {
            onDelete: "CASCADE",
        }
    )
    groupChat: GroupChat;

    @ManyToOne(() => Profile, (profile) => profile.messages)
    profile: Profile;

    @BeforeUpdate()
    @BeforeInsert()
    toJson() {
        if (this.seen) {
            this.seen = JSON.stringify(this.seen) as any;
        }
        if (this.data) {
            this.data = JSON.stringify(this.data) as any;
        }
    }

    @AfterLoad()
    fromJson() {
        if (this.seen && typeof this.seen === "string") {
            this.seen = JSON.parse(this.seen) as SeenData;
        }
        if (this.data && typeof this.data === "string") {
            this.data = JSON.parse(this.data) as MessageData;
        }
    }
}