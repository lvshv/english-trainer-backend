import { Query, Controller, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { TranslateService } from 'src/translate/translate.service';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly translateService: TranslateService,
  ) {}
  @Get('translate')
  @HttpCode(HttpStatus.OK)
  async translate(@Query() query: any) {
    return this.translateService.translate(query);
  }
}
