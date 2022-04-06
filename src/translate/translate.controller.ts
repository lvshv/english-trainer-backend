import { Query, Controller, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { TranslateService } from './translate.service';

@Controller()
export class TranslateController {
  constructor(private translateService: TranslateService) {}
  @Get('translate')
  @HttpCode(HttpStatus.OK)
  async translate(@Query() query: any) {
    return this.translateService.translate(query);
  }
}
