// controller boiler plate

import { GetUser } from '@/auth/decorators/user.decorator';
import { User } from '@/auth/entities/user.entity';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Body, Controller, Get, Param, Patch, Post, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UpdateGroupChatDTO } from './dto/update-group-chat.dto';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get('rooms')
    findAll(
        @GetUser() user: User,
        @Query('page') page = 1,
        @Query('limit') take = 10,
    ) {
        return this.chatService.findByProfile(user.profile, page, take);
    }

    @Get('room/:roomId')
    findOne(
        @Param('roomId') roomId: string,
    ) {
        return this.chatService.findOne(roomId);
    }

    @Post('room')
    createGroupChat(
        @GetUser() user: User,
        @Body() members: string[]
    ) {
        return this.chatService.createGroupChat(user.profile, members);
    }

    @Get('messages/:roomId')
    async getMessages(
        @Query('page') page = 1,
        @Query('limit') take = 10,
        @Param('roomId') roomId: string,
        @GetUser() user: User
    ) {
        const isUserInGroupChat = await this.chatService.isUserInGroupChat(roomId, user.profile.id);
        if (!isUserInGroupChat) throw new UnauthorizedException();
        return this.chatService.getMessages(roomId, page, take);
    }


    @Patch('room/:roomId')
    async updateGroupChat(
        @GetUser() user: User,
        @Body() updateGroupChatDTO: UpdateGroupChatDTO,
    ) {
        const isUserInGroupChat = await this.chatService.isUserAdminOfGroupChat(updateGroupChatDTO.id, user.profile.id);
        if (!isUserInGroupChat) throw new UnauthorizedException();
        return this.chatService.updateGroupChat(updateGroupChatDTO);
    }

}