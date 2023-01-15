import { Controller, Get, Body, Patch, Param, UseGuards, Query, Post } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GetUser } from '@/auth/decorators/user.decorator';
import { User } from '@/auth/entities/user.entity';
import { FriendshipSerivce } from './friendship.service';
import { Friendship } from './entities/friendship.entity';
import { AcceptFriendRequestDTO } from './dto/accept-friend-request.dto';

@UseGuards(JwtAuthGuard)
@Controller('friendships')
export class FrienshipController {
    constructor(private readonly friendshipService: FriendshipSerivce) { }

    @Get()
    findAll(
        @GetUser() user: User,
        @Query('page') page = 1,
        @Query('limit') take = 10,
        @Query('status') status: Friendship['status'] = 'accepted',
        @Query('type') type: "all" | "incoming" | "outgoing",
        @Query('query') query?: string,
        @Query('id') id?: string,
    ) {
        return this.friendshipService.findAll(id || user.profile, { page, take, status, type, query });
    }

    @Post(':id')
    async sendFriendRequest(
        @Param('id') id: string,
        @GetUser() user: User,
    ) {
        return this.friendshipService.sendFriendRequest(user.profile, id);
    }

    @Patch('accept/:id')
    async acceptFriendRequest(
        @Param('id') id: string,
        @GetUser() user: User,
        @Body() acceptFriendRequestDTO: AcceptFriendRequestDTO,
    ) {
        return this.friendshipService.acceptFriendRequest(id, user.profile, acceptFriendRequestDTO);
    }

    @Patch('reject/:id')
    async rejectFriendRequest(
        @Param('id') id: string,
        @GetUser() user: User,
    ) {
        return this.friendshipService.rejectFriendRequest(id, user.profile);
    }

    @Patch('cancel/:id')
    async cancelFriendRequest(
        @Param('id') id: string,
        @GetUser() user: User,
    ) {
        return this.friendshipService.cancelFriendRequest(user.profile, id);
    }
}
