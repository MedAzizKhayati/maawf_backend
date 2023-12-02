import { GenericsService } from '@/generics/service';
import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { BadRequestException, Logger, UnauthorizedException } from '@nestjs/common';
import { Payload } from './interfaces/payload';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService extends GenericsService<User, CreateAuthDto, UpdateAuthDto> {
  private logger = new Logger(AuthService.name);
  constructor(@InjectRepository(User) userRepository: Repository<User>, private jwtService: JwtService) {
    super(userRepository);
  }

  async create(createDto: CreateAuthDto): Promise<User> {
    const isEmailTaken = await this.repository.findOneBy({ email: createDto.email });
    if (isEmailTaken) {
      throw new BadRequestException('Email already taken');
    }
    const user = this.repository.create(createDto);
    user.profile = createDto.getProfileEntity();
    const userResponse = await this.repository.save(user);
    this.logger.log(`User ${userResponse.email} created`);
    return this.userWithoutPassword(userResponse);
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.repository.findOneBy({ email });
    if (user && (await bcrypt.compare(password, user.password)))
      return {
        user: this.userWithoutPassword(user),
        token: this.signPayload({ id: user.id, email: user.email }),
      };
    
    this.logger.error(`User ${email} failed to login`);
    throw new UnauthorizedException('Invalid credentials');
  }

  userWithoutPassword(user: User): User {
    delete user.password;
    return user;
  }

  signPayload(payload: Payload) {
    return this.jwtService.sign(payload);
  }
}
