import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '@/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '@/profile/entities/profile.entity';
import { GroupChat } from './entities/group-chat.entity';
import { Message } from './entities/message.entity';
import { GroupChatToProfile } from './entities/group-chat-to-profile.entity';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, GroupChat, Message, GroupChatToProfile]),
    AuthModule,
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
  exports: [ChatService]
})
export class ChatModule { }
