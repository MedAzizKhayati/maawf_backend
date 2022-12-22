import { Controller, Get, Body, Patch, Param, UseGuards, ForbiddenException, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GetUser } from '@/auth/decorators/user.decorator';
import { User } from '@/auth/entities/user.entity';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') take = 10,
    @Query('query') query?: string,
    @GetUser() user?: User,
  ) {
    return this.profileService.query(user?.profile?.id || '', {
      page,
      take,
      query,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  updateMyProfile(
    @GetUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return this.profileService.update(user.profile.id, updateProfileDto);
  }

}
