import { GenericsService } from '@/generics/service';
import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { Payload } from './interfaces/payload';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LdapService } from './ldap.service';
import { CryptoService } from './crypto.service';

@Injectable()
export class AuthService extends GenericsService<User, CreateAuthDto, UpdateAuthDto> {
    constructor(
        @InjectRepository(User) userRepository: Repository<User>,
        private jwtService: JwtService,
        private ldapService: LdapService,
        private cryptoService: CryptoService
    ) {
        super(userRepository);
    }

    async test() {
        // const users = await this.repository.find();
        // // pick random user from db
        // const user = users[Math.floor(Math.random() * users.length)];
        // try {
        //     // generate certificate for user using crypto 
        //     const certificate = this.cryptoService.createSelfSignedCertificate(user);
        //     const pem = this.cryptoService.certToPem(certificate);

        //     // try to create user 
        //     const ldapUser = await this.ldapService.addUser(user, pem);
        //     return ldapUser;
            
        // } catch (error) {
        //     console.log(error);
        //     return "error";
        // }
        return 'test';
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
