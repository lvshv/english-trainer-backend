import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RtStrategy } from './strategies/rt.strategy';
import { UserModule } from '../user/user.module';
import { AtStrategy } from './strategies';

@Module({
  controllers: [AuthController],
  imports: [UserModule, PassportModule, JwtModule.register({})],
  providers: [AuthService, AtStrategy, RtStrategy],
})
export class AuthModule {}
