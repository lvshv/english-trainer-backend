import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAllUsers(@Request() req) {
    return this.userService.findAllUsers();
  }

  @Get('me')
  getProfile(@Request() req) {
    return this.userService.findUserById(req.user.id);
  }
}
