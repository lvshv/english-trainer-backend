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
import { AtGuard } from 'src/auth/guards';
import { ExerciseService } from './exercise.service';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @UseGuards(AtGuard)
  @Post('create')
  async createExercise(@Body() dto: any) {
    return this.exerciseService.create(dto);
  }
}
