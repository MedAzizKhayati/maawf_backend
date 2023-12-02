import { User } from '@/auth/entities/user.entity';
import { GenericsService } from '@/generics/service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService extends GenericsService<Profile, CreateProfileDto, UpdateProfileDto> {
  constructor(
    @InjectRepository(Profile) repo: Repository<Profile>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(repo);
  }

  async query(
    profile: Profile | string,
    options?: {
      page?: number;
      take?: number;
      query?: string;
    },
  ) {
    profile = typeof profile === 'string' ? profile : profile.id;
    options.page = options.page || 1;
    options.take = options.take || 10;
    const results = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('profile.id != :profile', { profile })
      .andWhere("CONCAT(profile.firstName, ' ', profile.lastName) LIKE :query", { query: `%${options?.query}%` })
      .skip((options.page - 1) * options.take)
      .take(options.take)
      .getMany();

    return results.map(result => result.profile);
  }

  async updateProfile(
    profile: Profile | string,
    avatar: Express.Multer.File,
    cover: Express.Multer.File,
    updateProfileDto: UpdateProfileDto,
  ) {
    profile = typeof profile === 'string' ? profile : profile.id;
    const updatedProfile = new Profile();
    updatedProfile.id = profile;
    Object.assign(updatedProfile, updateProfileDto);
    if (avatar) updatedProfile.avatar = avatar.path.replace('public', '').split('\\').join('/');
    if (cover) updatedProfile.cover = cover.path.replace('public', '').split('\\').join('/');
    //check if the updatedProfile is empty
    if (Object.keys(updatedProfile).length === 0) throw new BadRequestException('Nothing to update');
    await this.repository.save(updatedProfile);
    return this.repository.findOneBy({ id: profile });
  }
}
