import {
  Body,
  Controller,
  Post,
  BadRequestException,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { AtGuard, RtGuard } from './guards';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private frontendDomain: string;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private config: ConfigService,
  ) {
    this.frontendDomain = this.config.get<string>('FRONTEND_DOMAIN');
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() userData: CreateUserDto): Promise<UserEntity> {
    const oldUser = await this.userService.findUser(userData.email);
    if (oldUser) {
      throw new BadRequestException('user has already exist');
    }
    return this.authService.registerUser(userData);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userData = await this.authService.login(dto.email, dto.password);
    const tokens = {
      access_token: userData.access_token,
      refresh_token: userData.refresh_token,
    };
    response.cookie('auth-cookie', tokens, {
      httpOnly: true,
      domain: this.frontendDomain,
    });

    return userData;
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: number, @Res() res: Response) {
    await this.authService.logout(userId);
    return res.json({ status: 'success' });
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    response.cookie('auth-cookie', tokens, {
      httpOnly: true,
      domain: this.frontendDomain,
    });
    return tokens;
  }
}
