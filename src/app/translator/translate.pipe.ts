import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(nskey: any): any {
    const ns = nskey.split('.')[0];
    const key = nskey.split('.')[1];
    return this.translate.data[ns][key] || nskey;
  }
}
