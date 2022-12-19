import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { WsGuard } from '@/auth/guards/jwt-ws-auth.guard';
import { GetUser } from '@/auth/decorators/user.decorator';
import { User } from '@/auth/entities/user.entity';
import { SendMessageDto } from './dto/send-message.dto';

@UseGuards(WsGuard)
@WebSocketGateway({
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  constructor(
    private chatService: ChatService
  ) { }

  @SubscribeMessage('connect-to-rooms')
  enterGroupChat(
    @ConnectedSocket() client: Socket,
    @GetUser() user: User
  ) {
    client.join(user.profile.id);
    this.logger.log(`Profile ${user.profile.id} connected to chat`);
    return true;
  }

  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() payload: SendMessageDto,
    @GetUser() user: User,
  ) {
    this.logger.log(`Profile ${user.profile.id} sent message to Group:${payload.groupChatId}`);
    return this.chatService.sendMessage(payload, user.profile.id);
  }

  @SubscribeMessage('mark-as-seen')
  markAsRead(
    @MessageBody() messageId: string,
    @GetUser() user: User,
  ) {
    this.chatService.markAsRead(messageId, user.profile.id);
    return true;
  }

  afterInit() {
    this.logger.log('Init');
    this.chatService.setServer(this.server);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}