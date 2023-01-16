import { GenericsService } from '@/generics/service';
import addPaginationToOptions from '@/utils/addPaginationToOptions';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService extends GenericsService<Profile, CreateProfileDto, UpdateProfileDto> {
  constructor(
    @InjectRepository(Profile) private repo: Repository<Profile>
  ) {
    super(repo);
  }

  async query(
    profile: Profile | string,
    options?: {
      page?: number,
      take?: number,
      query?: string
    }) {
    profile = typeof profile === 'string' ? profile : profile.id;
    return this.repository.find(addPaginationToOptions<Profile>({
      where: [
        {
          id: Not(profile),
          firstName: options?.query && Like(`%${options?.query}%`),
        },
        {
          id: Not(profile),
          lastName: options?.query && Like(`%${options?.query}%`),
        }
      ]
    }, options.page, options.take));
  }

  async updateProfile(profile: Profile | string, avatar: Express.Multer.File, cover: Express.Multer.File, updateProfileDto: UpdateProfileDto) {
    profile = typeof profile === 'string' ? profile : profile.id;
    const updatedProfile = new Profile();
    updatedProfile.id = profile;
    Object.assign(updatedProfile, updateProfileDto);
    if (avatar)
      updatedProfile.avatar = avatar.path.replace('public', '').split('\\').join('/');
    if (cover)
      updatedProfile.cover = cover.path.replace('public', '').split('\\').join('/');
    //check if the updatedProfile is empty
    if (Object.keys(updatedProfile).length === 0)
      throw new BadRequestException('Nothing to update');
    await this.repository.save(updatedProfile);
    return this.repository.findOneBy({ id: profile });
  }
}


