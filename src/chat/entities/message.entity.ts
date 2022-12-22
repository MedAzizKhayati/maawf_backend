import { GenericEntity } from "@/generics/entity";
import { Profile } from "@/profile/entities/profile.entity";
import { AfterInsert, AfterLoad, AfterRecover, AfterUpdate, BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from "typeorm";
import { GroupChat } from "./group-chat.entity";

export type Attachment = {
    type: string;
    url: string;
}

export type MessageData = {
    text?: string;
    attachments?: Attachment[];
}

export type SeenData = {
    [key: string]: boolean;
}

@Entity()
export class Message extends GenericEntity {
    @Column({
        type: "longtext",
    })
    data: MessageData;

    @Column({
        type: "longtext",
    })
    seen: SeenData;

    @Column({
        default: false,
    })
    isEncrypted: boolean;

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

    @AfterRecover()
    @AfterLoad()
    @AfterInsert()
    @AfterUpdate()
    fromJson() {
        if (this.seen && typeof this.seen === "string") {
            this.seen = JSON.parse(this.seen) as SeenData;
        }
        if (this.data && typeof this.data === "string") {
            this.data = JSON.parse(this.data) as MessageData;
        }
    }
}