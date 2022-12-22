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
    return this.repository.find(addPaginationToOptions<Profile>({
      where: [
        {
          id: Not(profile),
          firstName: options?.query && Like(`%${options?.query}%`),
        },
        {
          id: Not(profile),
          lastName: options?.query && Like(`M${options?.query}%`),
        }
      ]
    }, options.page, options.take));
  }

}
