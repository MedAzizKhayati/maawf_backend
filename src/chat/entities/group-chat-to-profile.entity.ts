import { GenericEntity } from "@/generics/entity"
import { Profile } from "@/profile/entities/profile.entity"
import { Entity, Column, ManyToOne } from "typeorm"
import { GroupChat } from "./group-chat.entity"

@Entity()
export class GroupChatToProfile extends GenericEntity {
    @Column({
        nullable: true
    })
    public nickname: string

    @Column({
        default: false
    })
    public isAdmin: boolean

    @Column({
        default: false
    })
    public isMuted: boolean

    @Column({
        length: 1024
    })
    public encryptedSymmetricKey: string

    @ManyToOne(
        () => Profile,
        (profile) => profile.groupChatToProfiles,
        {
            eager: true,
            onDelete: 'CASCADE'
        }
    )
    public profile: Profile

    @ManyToOne(
        () => GroupChat,
        (groupChat) => groupChat.groupChatToProfiles,
        {
            onDelete: 'CASCADE'
        }
    )
    public groupChat: GroupChat
}