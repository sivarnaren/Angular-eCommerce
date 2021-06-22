import { OnboardingRequestModel } from './../../models/index';
import { Component, OnInit } from '@angular/core';
import { OnboardingService, MenuService } from '../../services/index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.less']
})
export class OnboardingComponent implements OnInit {
  public currentStep = 0;
  // tslint:disable-next-line: variable-name
  member_type_id: number;

  constructor(
    private onboardingSrv: OnboardingService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private menuService: MenuService
  ) {
    this.menuService.member_type_id_obs().subscribe(result => {
      this.member_type_id = result;
    });
    this.menuService.updateStatus();
  }

  ngOnInit() {
    this.getOnboardingInfo();
  }

  userAction(step: number) {
    console.log('Step received: ', step);
    this.currentStep = step;
    console.log(this.currentStep);
  }

  getOnboardingInfo() {
    const onboardingModel = new OnboardingRequestModel();
    onboardingModel.currentStep = this.currentStep;
    this.onboardingSrv.getOnboardingInfo(onboardingModel).subscribe(
      response => {
        console.log(response);
        if (!response.HasError) {
          //  console.log('The last step the user complete was: ', response.Result.last_step_completed_onboarding);
          // console.log('The current step is: ', response.Result.current_step);
          console.log('The current step is: ', this.member_type_id);

          if (response.Result.current_step === 5 || this.member_type_id !== 1) {
            this.router.navigate(['../account'], { relativeTo: this.activatedRoute });
          } else {
            this.currentStep = response.Result.current_step;
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
