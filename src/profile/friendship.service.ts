import { ChatService } from '@/chat/chat.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcceptFriendRequestDTO } from './dto/accept-friend-request.dto';
import { Friendship } from './entities/friendship.entity';
import { Profile } from './entities/profile.entity';
import { ProfileService } from './profile.service';

@Injectable()
export class FriendshipSerivce {
  constructor(
    @InjectRepository(Friendship)
    private readonly frienshipRepository: Repository<Friendship>,
    private readonly profileService: ProfileService,
    private readonly chatService: ChatService,
  ) {}

  async findAll(
    profile: Profile | string,
    options?: {
      page?: number;
      take?: number;
      status?: Friendship['status'];
      type?: 'all' | 'incoming' | 'outgoing';
      query?: string;
    },
  ) {
    profile = typeof profile === 'string' ? profile : profile.id;
    options.page = options.page || 1;
    options.take = options.take || 10;
    options.type = options.type || 'all';

    const results = await this.frienshipRepository
      .createQueryBuilder('friendship')
      .leftJoinAndSelect('friendship.sender', 'sender')
      .leftJoinAndSelect('friendship.receiver', 'receiver')
      .where('friendship.status = :status', { status: options?.status || 'accepted' })
      .andWhere(
        `((sender.id = :profile AND CONCAT(receiver.firstName, ' ', receiver.lastName) LIKE :query AND :type in ('all', 'outgoing')) OR
            (receiver.id = :profile AND CONCAT(sender.firstName, ' ', sender.lastName) LIKE :query AND :type in ('all', 'incoming')))`,
        { profile, query: `%${options?.query}%`, type: options?.type },
      )
      .skip((options.page - 1) * options.take)
      .take(options.take)
      .getMany();

    return Promise.all(
      results.map(async friendship => {
        const otherProfile: any = friendship.sender.id === profile ? friendship.receiver : friendship.sender;
        return {
          ...friendship,
          sender: friendship.sender.id === profile ? friendship.sender : otherProfile,
          receiver: friendship.receiver.id === profile ? friendship.receiver : otherProfile,
        };
      }),
    );
  }

  async preparePendingFriendship(
    sender: Profile | string,
    receiver: Profile | string,
  ): Promise<[Friendship, Profile, Profile]> {
    sender = typeof sender === 'string' ? await this.profileService.findOne(sender) : sender;
    receiver = typeof receiver === 'string' ? await this.profileService.findOne(receiver) : receiver;

    if (!sender) throw new NotFoundException('Sender not found');

    if (!receiver) throw new NotFoundException('Receiver not found');

    if (sender.id === receiver.id) throw new UnauthorizedException('You cannot have friend requests from yourself');

    const friendship = await this.findFriendship(sender, receiver);

    if (!friendship) throw new NotFoundException('Friend request not found');

    if (friendship.status !== 'pending') throw new UnauthorizedException('Friend request is not pending');

    return [friendship, sender, receiver];
  }

  async cancelFriendRequest(sender: Profile | string, receiver: Profile | string) {
    let friendship: Friendship;
    [friendship, sender, receiver] = await this.preparePendingFriendship(sender, receiver);

    if (friendship.sender.id !== sender.id)
      throw new UnauthorizedException('You cannot cancel a friend request that you have not sent');

    return await this.frienshipRepository.remove(friendship);
  }

  async rejectFriendRequest(sender: Profile | string, receiver: Profile | string) {
    let friendship: Friendship;
    [friendship, sender, receiver] = await this.preparePendingFriendship(sender, receiver);

    if (friendship.sender.id !== sender.id)
      throw new UnauthorizedException('You cannot reject a friend request that you have sent');

    friendship.status = 'rejected';

    return await this.frienshipRepository.save(friendship);
  }

  async acceptFriendRequest(
    sender: Profile | string,
    receiver: Profile | string,
    acceptFriendRequestDTO: AcceptFriendRequestDTO,
  ) {
    let friendship: Friendship;
    [friendship, sender, receiver] = await this.preparePendingFriendship(sender, receiver);

    if (friendship.sender.id !== sender.id)
      throw new UnauthorizedException('You cannot accept a friend request that you have sent');

    friendship.status = 'accepted';

    await this.frienshipRepository.save(friendship);
    const existingChat = await this.chatService.findChat([sender, receiver], true);

    if (!existingChat)
      await this.chatService.createChat(sender, {
        encryptedSymmetricKey: acceptFriendRequestDTO.senderEncryptedSymmetricKey,
        members: [{ id: receiver.id, encryptedSymmetricKey: acceptFriendRequestDTO.receiverEncryptedSymmetricKey }],
      });

    return friendship;
  }

  async sendFriendRequest(from: Profile | string, to: Profile | string) {
    from = typeof from === 'string' ? await this.profileService.findOne(from) : from;
    to = typeof to === 'string' ? await this.profileService.findOne(to) : to;

    if (!from) throw new NotFoundException('Sender not found');

    if (!to) throw new NotFoundException('Receiver not found');

    if (from.id === to.id) throw new UnauthorizedException('You cannot send a friend request to yourself');

    const existingFriendship = await this.findFriendship(from, to);

    if (existingFriendship) {
      switch (existingFriendship.status) {
        case 'accepted':
          throw new UnauthorizedException('Already friends');
        case 'pending':
          throw new UnauthorizedException('Friend request already sent');
        case 'rejected':
          existingFriendship.status = 'pending';
          return await this.frienshipRepository.save(existingFriendship);
        case 'cancelled':
          existingFriendship.status = 'pending';
          return await this.frienshipRepository.save(existingFriendship);
        case 'blocked':
          throw new Error('This user is blocked');
      }
    }

    const friendship = this.frienshipRepository.create({
      sender: from,
      receiver: to,
      status: 'pending',
    });

    return await this.frienshipRepository.save(friendship);
  }

  async findFriendship(profile1: Profile | string, profile2: Profile | string) {
    const senderId = typeof profile1 === 'string' ? profile1 : profile1.id;
    const receiverId = typeof profile2 === 'string' ? profile2 : profile2.id;

    return await this.frienshipRepository.findOne({
      where: [
        {
          sender: {
            id: senderId,
          },
          receiver: {
            id: receiverId,
          },
        },
        {
          sender: {
            id: receiverId,
          },
          receiver: {
            id: senderId,
          },
        },
      ],
    });
  }
}
