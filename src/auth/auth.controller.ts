import {
  Body,
  Controller,
  Post,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { User as UserModel, Prisma } from '@prisma/client';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() userData: UserModel): Promise<UserModel> {
    const oldUser = await this.authService.findUser(userData.email);
    if (oldUser) {
      throw new BadRequestException('user already exist');
    }
    return this.authService.createUser(userData);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    const user = await this.authService.validateUser(dto);
    return this.authService.login(user.email);
  }

  // @Post('logout')
  // @HttpCode(HttpStatus.OK)
  // logout(@GetCurrentUserId() userId: number) {
  //   return this.authService.logout(userId);
  // }

  // @Public()
  // @UseGuards(RtGuard)
  // @Post('refresh')
  // @HttpCode(HttpStatus.OK)
  // refreshTokens(
  //   @GetCurrentUserId() userId: number,
  //   @GetCurrentUser('refreshToken') refreshToken: string,
  // ) {
  //   return this.authService.refreshTokens(userId, refreshToken);
  // }
}
