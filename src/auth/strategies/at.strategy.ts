import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      ignoreExpiration: false,
      secretOrKey: config.get<string>('AT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies['auth-cookie'];
          if (!data?.access_token) {
            return null;
          }
          return data.access_token;
        },
      ]),
    });
  }

  async validate(payload: any) {
    if (payload === null) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
