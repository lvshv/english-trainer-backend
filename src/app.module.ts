import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import { TranslateModule } from './translate/translate.module';
import { CategoriesModule } from './category/category.module';
import { CategoryEntity } from './category/entities/category.entity';
import { ExerciseModule } from './exercise/exercise.module';
import { ExerciseEntity } from './exercise/entities/exercise.entity';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'english',
      entities: [UserEntity, CategoryEntity, ExerciseEntity],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    TranslateModule,
    CategoriesModule,
    ExerciseModule,
    ArticleModule,
  ],
})
export class AppModule {}
