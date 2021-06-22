import { SignupService } from '../../services/index';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupRequestModel } from 'src/app/models';

@Component({
  selector: 'app-my-home',
  templateUrl: './my-home.component.html',
  styleUrls: ['./my-home.component.less']
})
export class MyHomeComponent implements OnInit {
  constructor(private signupSrv: SignupService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.getCommonFormData();
    const member = new SignupRequestModel();
    member.currentStep = 1;
    this.signupSrv.signup(member).subscribe(
      response => {
        // TODO clean consoles
        console.log('My Home OnInit');
        console.log(response);
        if (!response.HasError) {
          // response.Result.last_step_completed === 5 ||
          if (response.Result.last_step_completed === 4) {
            console.log('Signup already done. Go to home page');
            this.router.navigate(['../onboarding'], { relativeTo: this.activatedRoute });
          } else {
            console.log('Last step was: ', response.Result.last_step_completed);
            this.router.navigate(['../signup'], { relativeTo: this.activatedRoute });
          }
        }
        console.log('close My Home OnInit');
      },
      error => {
        console.error(error);
      }
    );
  }
  getCommonFormData() {
    this.signupSrv.getCommonFormData().subscribe(res => {
      if (!res.HasError) {
        // response.Result.last_step_completed === 5 ||
        localStorage.setItem('genderList', JSON.stringify(res.Result.genderList));
        localStorage.setItem('stateList', JSON.stringify(res.Result.stateList));
        localStorage.setItem('familyRelationTypeList', JSON.stringify(res.Result.familyRelationTypeList));
        localStorage.setItem('guestRelationTypeList', JSON.stringify(res.Result.guestRelationTypeList));
      }
    });
  }
}
