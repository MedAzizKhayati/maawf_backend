import { GenericsService } from '@/generics/service';
import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Payload } from './interfaces/payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService extends GenericsService<User, CreateAuthDto, UpdateAuthDto> {
    constructor(
        @InjectRepository(User) userRepository: Repository<User>,
        private jwtService: JwtService
    ) {
        super(userRepository);
    }

    async create(createDto: CreateAuthDto): Promise<User> {
        const user = this.repository.create(createDto);
        user.profile = createDto.getProfileEntity();
        const userResponse = await this.repository.save(user);
        return this.userWithoutPassword(userResponse);
    }

    async login(email: string, password: string): Promise<{ user: User, token: string }> {
        const user = await this.repository.findOneBy({ email });
        if (user && await bcrypt.compare(password, user.password))
            return {
                user: this.userWithoutPassword(user),
                token: this.signPayload({ id: user.id, email: user.email })
            };

        throw new UnauthorizedException("Invalid credentials");
    }

    userWithoutPassword(user: User): User {
        delete user.password;
        return user;
    }

    signPayload(payload: Payload) {
        return this.jwtService.sign(payload);
    }
}
