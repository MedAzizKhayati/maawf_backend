import { User } from '@/auth/entities/user.entity';
import { GenericEntity } from '@/generics/entity';
import { Profile } from '@/profile/entities/profile.entity';
import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { GroupChatToProfile } from './chat-to-profile.entity';
import { Message } from './message.entity';

@Entity()
export class GroupChat extends GenericEntity {
    @Column()
    name: string;

    @Column()
    picture: string;

    @Column()
    isPrivate: boolean;

    @OneToOne(
        () => Message,
        {
            eager: true,
            cascade: true,
            onDelete: 'SET NULL',
        }
    )
    @JoinColumn()
    lastMessage: Message;

    @OneToMany(
        () => GroupChatToProfile,
        groupChatToProfile => groupChatToProfile.groupChat,
        {
            eager: true,
            cascade: true
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