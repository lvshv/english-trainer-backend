import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class TranslateService {
  constructor(private httpService: HttpService) {}
  async translate(dto) {
    console.log('🚀 ~ translate ~ dto', dto);
    const res = await this.httpService
      .get(
        `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&source=input&sl=auto&tl=ru&q=${dto.data} `,
      )
      .toPromise();
    return res.data;
  }
}
