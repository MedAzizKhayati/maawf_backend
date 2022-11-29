import { GenericsService } from '@/generics/service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
