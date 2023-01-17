import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Friendship } from './entities/friendship.entity';
import { FriendshipSerivce } from './friendship.service';
import { ChatModule } from '@/chat/chat.module';
import { FrienshipController } from './friendship.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, Friendship]),
    ChatModule
  ],
  controllers: [ProfileController, FrienshipController],
  providers: [ProfileService, FriendshipSerivce]
})
export class ProfileModule { }
