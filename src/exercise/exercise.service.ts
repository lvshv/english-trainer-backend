import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExerciseEntity } from './entities/exercise.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(ExerciseEntity)
    private repository: Repository<ExerciseEntity>,
  ) {}
  async create(dto: any) {
    const exercise = await this.repository.create(dto);
    return await this.repository.save(exercise);
  }
}
