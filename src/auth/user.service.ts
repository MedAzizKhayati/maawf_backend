import { Injectable } from '@nestjs/common/decorators';
import { GenericsService } from '@/generics/service';
import { CreateAuthDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';

@Injectable()
export class UserService extends GenericsService<User, CreateAuthDto, UpdateAuthDto> {
  constructor(
    @InjectRepository(User) userRepository: Repository<User>,
    private readonly authService: AuthService
  ) {
    super(userRepository);
  }

  create(createDto: CreateAuthDto): Promise<User> {
    return this.authService.create(createDto);
  }

}
