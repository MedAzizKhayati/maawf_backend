// controller boiler plate

import { GetUser } from '@/auth/decorators/user.decorator';
import { User } from '@/auth/entities/user.entity';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UnauthorizedException, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateGroupChatDTO } from './dto/update-group-chat.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import uniqueFileName from '@/utils/uniqueFileName';
import { ApiConsumes } from '@nestjs/swagger';
import { CreateGroupChatDTO } from './dto/create-chat.dto';
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get()
    findAll(
        @GetUser() user: User,
        @Query('page') page = 1,
        @Query('limit') take = 10,
    ) {
        return this.chatService.getRecentChats(user.profile, page, take);
    }

    @Post()
    createGroupChat(
        @GetUser() user: User,
        @Body() dto: CreateGroupChatDTO
    ) {
        return this.chatService.createChat(user.profile, dto);
    }

    @Get('messages/:id')
    async getMessages(
        @Query('page') page = 1,
        @Query('limit') take = 10,
        @Param('id') id: string,
        @GetUser() user: User
    ) {
        const isUserInGroupChat = await this.chatService.isUserInGroupChat(id, user.profile.id);
        if (!isUserInGroupChat) throw new UnauthorizedException();
        return this.chatService.getMessages(id, page, take);
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
        @GetUser() user: User
    ) {
        return this.chatService.findOne(id);
    }

    @Get('with/:id')
    async getProfileChats(
        @GetUser() user: User,
        @Param('id') id: string,
    ) {
        return this.chatService.findChat([user.profile.id, id], true);
    }

    @Patch(':id')
    async updateGroupChat(
        @GetUser() user: User,
        @Body() updateGroupChatDTO: UpdateGroupChatDTO,
    ) {
        const isUserInGroupChat = await this.chatService.isUserAdminOfGroupChat(updateGroupChatDTO.id, user.profile.id);
        if (!isUserInGroupChat) throw new UnauthorizedException();
        return this.chatService.updateGroupChat(updateGroupChatDTO);
    }

    @Patch('members/:chatId')
    async updateMember(
        @GetUser() user: User,
        @Param('chatId') chatId: string,
        @Body() updateMemberDto: UpdateMemberDto,
    ) {
        const isUserInGroupChat = await this.chatService.isUserInGroupChat(chatId, user.profile.id);
        if (!isUserInGroupChat) throw new UnauthorizedException("You don't have permission to update this group chat");
        return this.chatService.updateMember(chatId, updateMemberDto);
    }

    @Post('send-message')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor('files', 24, {
        storage: diskStorage({
            destination: './public/uploads/chat',
            filename: uniqueFileName
        }),
        limits: {
            fileSize: 12_000_000, // 12MB
        }
    }))
    async sendMessage(
        @GetUser() user: User,
        @Body() sendMessageDto: SendMessageDto,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        return this.chatService.sendMessage(sendMessageDto, user.profile, files);
    }

    @Delete('message/:id')
    async deleteMessage(
        @GetUser() user: User,
        @Param('id') id: string,
    ) {
        return this.chatService.deleteContentOfMessage(id, user.profile.id);
    }
}