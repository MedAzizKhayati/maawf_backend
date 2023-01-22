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
import { LdapService } from './ldap.service';
import { CryptoService } from './crypto.service';
import { pki } from 'node-forge';
import { readFileSync } from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService extends GenericsService<User, CreateAuthDto, UpdateAuthDto> {
    private authorityKey: pki.rsa.PrivateKey;
    public authorityCert: pki.Certificate;
    private logger = new Logger(AuthService.name);
    constructor(
        @InjectRepository(User) userRepository: Repository<User>,
        private jwtService: JwtService,
        private ldapService: LdapService,
        private cryptoService: CryptoService
    ) {
        super(userRepository);
        this.loadAuthority();
    }

    async create(createDto: CreateAuthDto): Promise<User> {
        const isCSRValid = this.cryptoService.verifyCSR(createDto.csr, createDto.publicKey);
        if (!isCSRValid) {
            throw new BadRequestException("Invalid CSR");
        }

        const isEmailTaken = await this.repository.findOneBy({ email: createDto.email });
        if (isEmailTaken) {
            throw new BadRequestException("Email already taken");
        }

        const userCert = this.cryptoService.createCertificateFromCertificationRequest(
            createDto.csr,
            this.authorityCert,
            this.authorityKey
        );

        const userPem = this.cryptoService.certToPem(userCert);
        const user = this.repository.create(createDto);
        user.profile = createDto.getProfileEntity();
        await this.ldapService.addUser(user, userPem);
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

    loadAuthority() {
        try {
            const caDir = path.resolve(__dirname, '../../certification_authority');

            // load them from files cert.pem and key.pem using fs
            const keyPem = readFileSync(
                caDir + '/key.pem',
                { encoding: 'utf8' }
            );
            const certPem = readFileSync(
                caDir + '/cert.pem',
                { encoding: 'utf8' }
            );

            // convert them to forge objects
            this.authorityKey = pki.privateKeyFromPem(keyPem);
            this.authorityCert = pki.certificateFromPem(certPem);
            this.logger.log("Loaded authority key and certificate");
        } catch (error) {
            this.logger.error("Error loading authority key and certificate");
            throw new Error(`
                Error loading authority key and certificate.
                Make sure you have a key.pem and cert.pem file in the root of the project 
                inside a folder called certication_authority
            `);
        }
    }
}
