import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '@/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '@/profile/entities/profile.entity';
import { GroupChat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { GroupChatToProfile } from './entities/chat-to-profile.entity';
import { ChatController } from './chat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Message, GroupChat, GroupChatToProfile]), AuthModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
