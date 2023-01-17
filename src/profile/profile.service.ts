import { GenericsService } from '@/generics/service';
import addPaginationToOptions from '@/utils/addPaginationToOptions';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService extends GenericsService<Profile, CreateProfileDto, UpdateProfileDto> {
  constructor(
    @InjectRepository(Profile) repo: Repository<Profile>
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
    options.page = options.page || 1;
    options.take = options.take || 10;
    return this.repository.createQueryBuilder('profile')
      .where('profile.id != :profile', { profile })
      .andWhere("CONCAT(profile.firstName, ' ', profile.lastName) LIKE :query", { query: `%${options?.query}%` })
      .skip((options.page - 1) * options.take)
      .take(options.take)
      .getMany();
  }

}
