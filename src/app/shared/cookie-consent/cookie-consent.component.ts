import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.less']
})
export class CookieConsentComponent implements OnInit, OnDestroy {
  private popupOpenSubscription: Subscription;
  private popupCloseSubscription: Subscription;
  private initializeSubscription: Subscription;
  private statusChangeSubscription: Subscription;
  private revokeChoiceSubscription: Subscription;
  private noCookieLawSubscription: Subscription;

  constructor(private ccService: NgcCookieConsentService) {}

  ngOnInit() {
    // this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(() => {
    //   // you can use this.ccService.getConfig() to do stuff...
    // });
  }
  ngOnDestroy() {
    // unsubscribe to cookieconsent observables to prevent memory leaks
    // this.popupOpenSubscription.unsubscribe();
    // this.popupCloseSubscription.unsubscribe();
    // this.initializeSubscription.unsubscribe();
    // this.statusChangeSubscription.unsubscribe();
    // this.revokeChoiceSubscription.unsubscribe();
    // this.noCookieLawSubscription.unsubscribe();
  }
}
