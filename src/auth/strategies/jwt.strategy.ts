import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Payload } from '../interfaces/payload';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LdapService } from '../ldap.service';
import { CryptoService } from '../crypto.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly ldapService: LdapService,
    private readonly cryptoService: CryptoService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: Payload) {
    const user = await this.authService.findOne(payload.id);
    if (!user) {
      throw new UnauthorizedException('Account not found');
    } else if (user.status === 'disabled') {
      throw new UnauthorizedException('Your account has been temporary disabled');
    } else if (user.status === 'banned') {
      throw new UnauthorizedException('Your account has been permanently banned');
    }

    const ldapUser = await this.ldapService.getUser(user.email);
    if (!ldapUser) {
      throw new UnauthorizedException('LDAP account not found');
    }

    const isCertValid = this.cryptoService.isCertificateValid(
      this.cryptoService.pemToCert(ldapUser.certificate),
      this.authService.authorityCert,
    );
    if (!isCertValid) {
      throw new UnauthorizedException('Your certificate is not valid');
    }

    return user;
  }
}
