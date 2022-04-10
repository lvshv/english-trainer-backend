import { Module } from '@nestjs/common';
import { TranslateModule } from 'src/translate/translate.module';
import { CategoriesController } from './category.controller';
import { CategoriesService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';

@Module({
  imports: [TranslateModule, TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoriesController],
  providers: [
    {
      provide: CategoriesService,
      useClass: CategoriesService,
    },
  ],
  // exports: [CategoriesService],
})
export class CategoriesModule {}
