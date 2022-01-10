import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { compare, genSalt, hash } from 'bcryptjs';
import { UserService } from 'src/user/user.service';

import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    const user = await this.validateUser(email, password);
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return { ...user, ...tokens };
  }

  async registerUser(user: any): Promise<any> {
    const { email, fullName, password } = user;
    const salt = await genSalt(10);
    const passwordHash = await hash(password, salt);
    const createdUser = await this.userService.createUser({
      email,
      fullName,
      password: passwordHash,
    });
    const tokens = await this.getTokens(createdUser.id, createdUser.email);
    await this.updateRtHash(createdUser.id, tokens.refresh_token);
    return { ...createdUser, ...tokens };
  }

  async logout(userId: number) {
    await this.userService.updateUser(userId, { hashRt: null });
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.userService.findUserById(userId);
    if (!user || !user.hashRt) throw new ForbiddenException('Access Denied');

    const isRtMatches = await compare(rt, user.hashRt);
    if (!isRtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async findUser(email: string): Promise<any> {
    return this.userService.findUser(email);
  }
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findUser(email);

    if (!user) {
      throw new UnauthorizedException(`user with email: ${email} not found`);
    }
    const isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('wrong password');
    }
    return user;
  }

  hashData(data: string) {
    return hash(data, 10);
  }

  async updateRtHash(userId: number, rt: string) {
    const hashRt = await this.hashData(rt);
    await this.userService.updateUser(userId, { hashRt });
  }

  async getTokens(userId: number, email: string): Promise<any> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get<string>('AT_SECRET'),
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get<string>('RT_SECRET'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
