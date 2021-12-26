import {
  Body,
  Controller,
  Post,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { User as UserModel, Prisma } from '@prisma/client';
import { AuthService } from './auth.service';

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
  async login(@Body() userData: UserModel) {
    const user = await this.authService.validateUser(
      userData.email,
      userData.password,
    );
    return this.authService.login(user.email);
  }
}
