import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      passReqToCallback: true,
      ignoreExpiration: true,
      secretOrKey: config.get<string>('RT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies['auth-cookie'];
          if (!data?.refresh_token) {
            return null;
          }
          return data.refresh_token;
        },
      ]),
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req?.cookies['auth-cookie'].refresh_token;
    return {
      ...payload,
      refreshToken,
    };
  }
}
