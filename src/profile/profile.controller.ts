import { Controller, Get, Body, Patch, Param, UseGuards, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GetUser } from '@/auth/decorators/user.decorator';
import { User } from '@/auth/entities/user.entity';
import { ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import uniqueFileName from '@/utils/uniqueFileName';
import imageFilter from '@/utils/imageFilter';
import * as fs from 'fs';

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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor(
    [
      {
        name: 'avatar', maxCount: 1,
      },
      {
        name: 'cover', maxCount: 1
      }
    ],
    {
      storage: diskStorage({
        destination: (_, file, cb) => {
          // create folder if not exists
          if (!fs.existsSync('./public/uploads/profiles')) {
            fs.mkdirSync('./public/uploads/profiles/avatar', { recursive: true });
            fs.mkdirSync('./public/uploads/profiles/cover', { recursive: true });
          }
          if (file.fieldname === 'avatar')
            return cb(null, './public/uploads/profiles/avatar');
          if (file.fieldname === 'cover')
            return cb(null, './public/uploads/profiles/cover');
        },
        filename: uniqueFileName,
      }),
      fileFilter: imageFilter,
    }))
  async updateProfile(
    @GetUser() user: User,
    @UploadedFiles() files: { avatar?: Express.Multer.File[], cover?: Express.Multer.File[] },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(user.profile.id, files?.avatar?.[0], files?.cover?.[0], updateProfileDto);
  }

}
