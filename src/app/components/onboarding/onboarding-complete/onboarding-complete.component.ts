import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OnboardingService, NotificationService, AccountService } from '../../../services/index';
import { OnboardingRequestModel } from '../../../models/index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-onboarding-complete',
  templateUrl: './onboarding-complete.component.html',
  styleUrls: ['./onboarding-complete.component.less']
})
export class OnboardingCompleteComponent implements OnInit {
  @Input() step: number;
  @Output() action: EventEmitter<number> = new EventEmitter<number>();

  public memberTypeId: number;

  constructor(
    private onboardingSrv: OnboardingService,
    private notificationSrv: NotificationService,
    private accountSrv: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.consumePing();
  }

  userAction(action: string) {
    const step = action === 'back' ? (this.step = 5) : (this.step = 7);
    this.action.emit(step);
  }

  goToDashboard(url: string) {
    const onboardingModel = new OnboardingRequestModel();
    onboardingModel.currentStep = this.step;
    this.onboardingSrv.onboarding(onboardingModel).subscribe(
      response => {
        console.log(response);
        if (!response.HasError) {
          console.log('my account');
          this.router.navigate([url], { relativeTo: this.activatedRoute });
        } else {
          this.notificationSrv.showError(response.Message);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  consumePing() {
    this.accountSrv.ping().subscribe(response => {
      // tslint:disable:no-string-literal
      this.memberTypeId = response['member_type_id'];
    });
  }
}
