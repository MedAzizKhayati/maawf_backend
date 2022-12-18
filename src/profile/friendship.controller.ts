import { Controller, Get, Body, Patch, Param, UseGuards, Query, Post } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GetUser } from '@/auth/decorators/user.decorator';
import { User } from '@/auth/entities/user.entity';
import { FriendshipSerivce } from './friendship.service';
import { Friendship } from './entities/friendship.entity';

@UseGuards(JwtAuthGuard)
@Controller('friendships')
export class FrienshipController {
    constructor(private readonly friendshipService: FriendshipSerivce) { }

    @Get()
    findAll(
        @Query('page') page = 1,
        @Query('limit') take = 10,
        @Query('status') status: Friendship['status'] = 'accepted',
        @GetUser() user: User,
    ) {
        return this.friendshipService.findAll(user.profile, { page, take, status });
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
    ) {
        return this.friendshipService.acceptFriendRequest(id, user.profile);
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
