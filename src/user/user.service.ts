import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}
  findUser(email: string) {
    return this.repository.findOne({ email });
  }
  findAllUsers() {
    return this.repository.find({});
  }
  findUserById(id: number) {
    return this.repository.findOne({
      id,
    });
  }
  updateUser(id: number, dto: any) {
    return this.repository.update(id, dto);
  }
  async createUser(dto): Promise<any> {
    const user = await this.repository.create(dto);
    return await this.repository.save(user);
  }
  // async findUser(email: string): Promise<UserModel> {
  //   return this.prisma.user.findUnique({
  //     where: { email },
  //   });
  // }
}
