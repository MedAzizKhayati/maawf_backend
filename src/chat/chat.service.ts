import { GenericsService } from '@/generics/service';
import { Profile } from '@/profile/entities/profile.entity';
import addPaginationToOptions from '@/utils/addPaginationToOptions';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server } from 'socket.io';
import { Not, Repository } from 'typeorm';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateGroupChatDTO } from './dto/update-group-chat.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { GroupChatToProfile } from './entities/group-chat-to-profile.entity';
import { GroupChat } from './entities/group-chat.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService extends GenericsService<GroupChat, GroupChat, GroupChat> {
    server: Server;
    constructor(
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        @InjectRepository(GroupChat) private groupChatRepository: Repository<GroupChat>,
        @InjectRepository(GroupChatToProfile) private groupChatToProfileRepo: Repository<GroupChatToProfile>,
        @InjectRepository(Message) private messageRepository: Repository<Message>
    ) {
        super(groupChatRepository);
    }

    setServer(server: Server) {
        this.server = server;
    }

    async getGroupChats(profile: Profile | string): Promise<GroupChat[]> {
        const id = typeof profile === 'string' ? profile : profile.id;
        const groupChatToProfile = await this.groupChatToProfileRepo.find({
            where: {
                profile: {
                    id
                }
            },
            relations: ['groupChat']
        });

        const groupChat = groupChatToProfile.map(groupChatToProfile => groupChatToProfile.groupChat);
        return groupChat;
    }

    async createGroupChat(creator: Profile, members: Profile[] | string[]): Promise<GroupChat> {
        members = members.map(
            (member: Profile | string) =>
                typeof member === 'string' ?
                    this.profileRepository.create({ id: member }) :
                    member
        );

        members = [...members, creator]
            .filter(
                (member, index, self) => self.findIndex(m => m.id === member.id) === index
            );

        const groupChatToProfiles = members.map(member => {
            const groupChatToProfile = new GroupChatToProfile();
            if (member.id === creator.id) groupChatToProfile.isAdmin = true;
            groupChatToProfile.profile = member;
            return groupChatToProfile;
        });

        const groupChat = new GroupChat();
        groupChat.groupChatToProfiles = groupChatToProfiles;
        if (members.length <= 2) groupChat.isPrivate = true;

        const gc = await this.groupChatRepository.save(groupChat);

        // send a hello message
        const message = new SendMessageDto();
        message.groupChatId = gc.id;
        message.text = '👋';

        await this.sendMessage(message, creator);

        return gc;
    }

    async isUserAdminOfGroupChat(groupChat: GroupChat | string, profile: Profile | string): Promise<boolean> {
        const groupChatId = typeof groupChat === 'string' ? groupChat : groupChat.id;
        const profileId = typeof profile === 'string' ? profile : profile.id;
        return this.groupChatToProfileRepo
            .findOne({
                where: {
                    groupChat: {
                        id: groupChatId
                    },
                    profile: {
                        id: profileId
                    },
                    isAdmin: true
                }
            })
            .then(crToProfile => !!crToProfile);
    }

    async updateGroupChat(updateDTO: UpdateGroupChatDTO): Promise<GroupChat> {
        const groupChat = await this.findOne(updateDTO.id);
        const members = updateDTO.newMembers.map(
            (member: Profile | string) =>
                typeof member === 'string' ?
                    this.profileRepository.create({ id: member }) :
                    member
        );

        const groupChatToProfiles = [
            ...groupChat.groupChatToProfiles,
            ...members.map(member => {
                const groupChatToProfile = new GroupChatToProfile();
                groupChatToProfile.profile = member;
                return groupChatToProfile;
            })
        ].filter(m => !updateDTO.removeMembers.includes(m.profile.id));

        return await this.groupChatRepository.save({
            id: groupChat.id,
            groupChatToProfiles: groupChatToProfiles,
            ...updateDTO
        });
    }

    async isUserInGroupChat(groupChat: GroupChat | string, profile: Profile | string): Promise<boolean> {
        const groupChatId = typeof groupChat === 'string' ? groupChat : groupChat.id;
        const profileId = typeof profile === 'string' ? profile : profile.id;
        return this.groupChatToProfileRepo.findAndCount({
            where: {
                groupChat: {
                    id: groupChatId
                },
                profile: {
                    id: profileId
                }
            }
        }).then(([_, count]) => count > 0);
    }

    async getMessages(groupChat: GroupChat | string, page = 1, take = 10): Promise<Message[]> {
        const id = typeof groupChat === 'string' ? groupChat : groupChat.id;
        return this.messageRepository.find(addPaginationToOptions<Message>({
            where: {
                groupChat: {
                    id
                }
            },
            loadRelationIds: {
                relations: ['profile']
            },
            order: {
                createdAt: 'DESC'
            }
        }, page, take)).then(messages => {
            messages.forEach((message: any) => {
                const id = message.profile;
                message.profile = this.profileRepository.create();
                message.profile.id = id;
            });
            return messages;
        });
    }

    async sendMessage(message: SendMessageDto, sender: string | Profile): Promise<Message> {
        sender = typeof sender === 'string' ? this.profileRepository.create({ id: sender }) : sender;
        const groupChat = this.groupChatRepository.create({ id: message.groupChatId });
        const messageEntity = new Message();
        messageEntity.groupChat = groupChat;
        messageEntity.profile = sender;
        messageEntity.data = {
            text: message.text,
            attachments: message.attachments
        };

        const [messageResult, concernedProfiles] = await Promise.all([
            this.messageRepository.save(messageEntity),
            this.getConcernedProfiles(groupChat)
                .then(profiles => profiles.map(profile => profile.id))
        ]);
        if (this.server)
            this.server.to(concernedProfiles).emit('message', {
                groupChatId: message.groupChatId,
                message: messageResult
            });

        return messageResult;
    }

    async markAsRead(message: Message | string, profile: Profile | string): Promise<Message> {
        message = typeof message === 'string' ?
            await this.messageRepository.findOne({
                where: { id: message },
                relations: ['groupChat']
            }) :
            message;
        profile = typeof profile === 'string' ? profile : profile.id;
        message.seen[profile] = true;
        await this.messageRepository.save(message);
        const savedMessage = await this.messageRepository.findOne({
            where: { id: message.id },
            relations: ['groupChat', 'profile']
        });
        const concernedProfiles = await this.getConcernedProfiles(message.groupChat)
            .then(profiles => profiles.map(profile => profile.id));
        if (this.server)
            this.server.to(concernedProfiles).emit('message', {
                groupChatId: message.groupChat.id,
                message: savedMessage
            });
        return savedMessage;
    }

    async getConcernedProfiles(groupChat: GroupChat | string): Promise<Profile[]> {
        const id = typeof groupChat === 'string' ? groupChat : groupChat.id;
        return this.groupChatToProfileRepo.find({
            where: {
                groupChat: {
                    id
                }
            },
            relations: ['profile']
        }).then(
            crToProfiles => crToProfiles
                .map(crToProfile => crToProfile.profile)
        );
    }


    async addMember(groupChat: GroupChat | string, member: Profile | string): Promise<GroupChat> {
        const id = typeof groupChat === 'string' ? groupChat : groupChat.id;
        const groupChatToProfile = new GroupChatToProfile();
        groupChatToProfile.profile = typeof member === 'string' ? this.profileRepository.create({ id: member }) : member;
        groupChatToProfile.groupChat = this.groupChatRepository.create({ id });
        return this.groupChatToProfileRepo
            .save(groupChatToProfile)
            .then(() => this.findOne(id));
    }

    async removeMember(groupChat: GroupChat | string, member: Profile | string): Promise<GroupChat> {
        const groupChatId = typeof groupChat === 'string' ? groupChat : groupChat.id;
        const profileId = typeof member === 'string' ? member : member.id;

        return this.groupChatToProfileRepo
            .delete({
                groupChat: { id: groupChatId },
                profile: { id: profileId },
                isAdmin: false
            }).then(() => this.findOne(groupChatId));
    }

    async findOne(id: string): Promise<GroupChat> {
        const groupChat = await this.groupChatRepository
            .createQueryBuilder('gc')
            .where('gc.id = :id', { id })
            .leftJoinAndSelect('gc.groupChatToProfiles', 'gctps')
            .leftJoinAndSelect('gctps.profile', 'profiles')
            .leftJoinAndMapOne('gc.lastMessage', Message, 'messages', 'messages.groupChatId = gc.id')
            .leftJoinAndSelect('messages.profile', 'p')
            .orderBy('messages.createdAt', 'DESC')
            .getOne() as any;

        groupChat?.lastMessage?.fromJson();

        return groupChat;
    }

    async findChatsByProfile(profile: Profile | string, page = 1, take = 10): Promise<any> {
        const id = typeof profile === 'string' ? profile : profile.id;
        const results = await this.groupChatToProfileRepo
            .createQueryBuilder('gctp')
            .where('gctp.profileId = :id', { id })
            .leftJoinAndSelect('gctp.groupChat', 'gc')
            .leftJoinAndSelect('gc.groupChatToProfiles', 'gctps')
            .leftJoinAndSelect('gctps.profile', 'profiles')
            .leftJoinAndMapOne(
                'gc.lastMessage',
                Message,
                'messages',
                `messages.groupChatId = gc.id and 
                 messages.createdAt = (
                    select max(messages.createdAt) from message messages where messages.groupChatId = gc.id
                )`
            )
            .leftJoinAndSelect('messages.profile', 'p')
            .orderBy('messages.createdAt', 'DESC')
            .skip((page - 1) * take)
            .take(take)
            .getMany();

        const groupChats = results.map(res => {
            const groupChat = res.groupChat as any;
            groupChat?.lastMessage?.fromJson();
            return groupChat;
        });

        return groupChats;
    }

    async updateMember(
        groupChat: GroupChat | string,
        updateMemberDto: UpdateMemberDto
    ): Promise<GroupChatToProfile> {
        const id = typeof groupChat === 'string' ? groupChat : groupChat.id;
        const groupChatToProfileId = updateMemberDto.id;
        updateMemberDto.nickname = updateMemberDto.nickname.trim();
        const groupChatToProfile = await this.groupChatToProfileRepo.findOne({
            where: {
                id: groupChatToProfileId,
                groupChat: { id }
            }
        });
        if (!groupChatToProfile)
            throw new NotFoundException('This user is not a member of this group chat');

        groupChatToProfile.nickname = updateMemberDto.nickname;

        return this.groupChatToProfileRepo.save(groupChatToProfile);
    }
}
