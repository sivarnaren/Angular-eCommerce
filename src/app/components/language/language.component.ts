import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from './../../translator/translate.service';
@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.less']
})
export class LanguageComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private translateService: TranslateService) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.lang !== 'en' && params.lang !== 'es') {
        localStorage.setItem('lng', 'en');
      } else {
        localStorage.setItem('lng', params.lang);
      }

      this.translateService.use();
    });
  }
}
