import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  findUser(email: string, options: FindOneOptions = {}): Promise<UserEntity> {
    return this.repository.findOne({ email }, options);
  }

  findAllUsers(): Promise<UserEntity[]> {
    return this.repository.find({});
  }

  findUserById(id: number): Promise<UserEntity> {
    return this.repository.findOne({
      id,
    });
  }
  updateUser(id: number, dto: any) {
    return this.repository.update(id, dto);
  }

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const user = await this.repository.create(dto);
    return await this.repository.save(user);
  }
}
