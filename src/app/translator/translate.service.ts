import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TranslateService {
  data: any = {};
  public currentLanguage = '';
  constructor(private http: HttpClient) {}

  use(): Promise<{}> {
    return new Promise<{}>((resolve, reject) => {
      const lang = localStorage.getItem('lng');
      const langPath = `assets/i18n/${lang}/${lang}.json`;
      this.currentLanguage = lang;
      this.http.get<{}>(langPath).subscribe(
        translation => {
          this.data = Object.assign({}, translation || {});
          resolve(this.data);
        },
        error => {
          this.data = {};
          resolve(this.data);
        }
      );
    });
  }
}
