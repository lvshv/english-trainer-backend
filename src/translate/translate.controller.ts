import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TranslateService } from './translate.service';

@Controller()
export class TranslateController {
  constructor(private translateService: TranslateService) {}
  @Post('translate')
  @HttpCode(HttpStatus.OK)
  async translate(@Body() dto: any) {
    return this.translateService.translate(dto);
  }
}
