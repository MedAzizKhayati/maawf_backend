import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Payload } from '../interfaces/payload';
import { UserService } from '../user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: Payload) {
        const user = await this.userService.findOne(payload.id);
        if (!user) {
            throw new UnauthorizedException('Account not found');
        }
        else if (user.status === 'disabled') {
            throw new UnauthorizedException('Your account has been temporary disabled');
        }
        else if (user.status === 'banned') {
            throw new UnauthorizedException('Your account has been permanently banned');
        }
        return user;
    }
}