import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User as UserModel, Prisma } from '@prisma/client';
import { compare, genSalt, hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(user: Prisma.UserCreateInput): Promise<UserModel> {
    const { email, name, password } = user;
    const salt = await genSalt(10);
    const passwordHash = await hash(password, salt);
    return await this.prisma.user.create({
      data: { email, name, password: passwordHash },
    });
  }
  async findUser(email: string): Promise<UserModel> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  async validateUser(email: string, password: string): Promise<UserModel> {
    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('wrong password');
    }
    return user;
  }
  async login(email: string) {
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
