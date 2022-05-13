import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class TranslateService {
  constructor(private httpService: HttpService) {}
  async translate(query: { word: string }) {
    const res = this.httpService
      .get(
        encodeURI(
          `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&source=input&sl=auto&tl=en&q=${query.word}`,
        ),
      )
      .pipe(
        map((axiosResponse) => {
          return axiosResponse.data;
        }),
      );
    return res;
  }
}
