import { Component, OnInit } from '@angular/core';
import { SignupService, MenuService } from '../../services/index';
import { SignupRequestModel } from '../../models/index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit {
  public currentStep = 1;
  // tslint:disable-next-line: variable-name
  member_type_id: number;

  constructor(
    private signupSrv: SignupService,
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
    const member = new SignupRequestModel();
    member.currentStep = this.currentStep;
    console.log(member.currentStep);
    this.signupSrv.getSignupInformation(member).subscribe(
      response => {
        console.log(response);
        if (!response.HasError) {
          const result = response.Result;
          console.log(this.member_type_id);
          if (response.Result.current_step === 5 || this.member_type_id !== 1) {
            this.router.navigate(['../onboarding'], { relativeTo: this.activatedRoute });
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

  userAction(step: number) {
    this.currentStep = step;
  }
}
