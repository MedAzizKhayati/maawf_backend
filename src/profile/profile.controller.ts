import { Controller, Get, Body, Patch, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GetUser } from '@/auth/decorators/user.decorator';
import { User } from '@/auth/entities/user.entity';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }


  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    if (user.profile.id !== id) throw new ForbiddenException("You can't update other user's profile");
    return this.profileService.update(id, updateProfileDto);
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
