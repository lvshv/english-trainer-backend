import { Query, Controller, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { TranslateService } from 'src/translate/translate.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Get('translate')
  @HttpCode(HttpStatus.OK)
  async create(@Query() dto: any) {
    return this.categoriesService.create(dto);
  }
}
