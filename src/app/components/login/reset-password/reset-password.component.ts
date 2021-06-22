import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less']
})
export class ResetPasswordComponent implements OnInit {
  public currentStep = 1;

  constructor() {}

  ngOnInit() {}

  userAction(step: number) {
    this.currentStep = step;
  }
}
