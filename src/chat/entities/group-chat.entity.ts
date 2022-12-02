import { GenericEntity } from '@/generics/entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { GroupChatToProfile } from './group-chat-to-profile.entity';
import { Message } from './message.entity';

@Entity()
export class GroupChat extends GenericEntity {
    @Column({
        nullable: true
    })
    name: string;

    @Column({
        nullable: true
    })
    picture: string;

    @Column({
        default: false
    })
    isPrivate: boolean;

    @OneToMany(
        () => GroupChatToProfile,
        groupChatToProfile => groupChatToProfile.groupChat,
        {
            eager: true,
            cascade: true,
        }
    )
    public groupChatToProfiles: GroupChatToProfile[];

    @OneToMany(
        () => Message,
        message => message.groupChat,
        {
            cascade: true,
        }
    )
    public messages: Message[];
}