import { PlanService, SignupService } from 'src/app/services/index';
import { PlanModel, SignupRequestModel } from './../../../models/index';
import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';

import { trigger, keyframes, animate, transition } from '@angular/animations';
import * as kf from './keyframes';

@Component({
  selector: 'app-select-my-plan',
  templateUrl: './select-my-plan.component.html',
  styleUrls: ['./select-my-plan.component.less'],
  animations: [
    trigger('cardAnimator', [
      transition('* => wobble', animate(1000, keyframes(kf.wobble))),
      transition('* => swing', animate(1000, keyframes(kf.swing))),
      transition('* => jello', animate(1000, keyframes(kf.jello))),
      transition('* => zoomOutRight', animate(1000, keyframes(kf.zoomOutRight))),
      transition('* => slideOutLeft', animate(1000, keyframes(kf.slideOutLeft))),
      transition('* => slideOutRight', animate(1000, keyframes(kf.slideOutRight))),
      transition('* => rotateOutUpRight', animate(1000, keyframes(kf.rotateOutUpRight))),
      transition('* => flipOutY', animate(1000, keyframes(kf.flipOutY)))
    ])
  ]
})
export class SelectMyPlanComponent implements OnInit {
  @Input() step: number;
  @Output() action: EventEmitter<number> = new EventEmitter<number>();

  public plans: PlanModel[] = new Array<PlanModel>();
  public planSelected: PlanModel = new PlanModel();

  selectedPlanMobile = {};
  disableBack = true;
  disableNext = false;
  currentPlan = 0;
  animationState: string;

  constructor(private planSrv: PlanService, private signupSrv: SignupService) { }

  ngOnInit() {
    this.getPlans();
  }

  startAnimation(state, index) {
    console.log(state);
    console.log(index);
    this.animationState = state;
    console.log(this.plans.length - 1);
    if (this.animationState === 'slideOutLeft' && index !== (this.plans.length - 1)) {
      console.log('para la izquierda');
      this.next();
    } else if (this.animationState === 'slideOutRight' && index !== 0) {
      console.log('para la derecha');
      this.back();
    }
    // if (!this.animationState) {
    /*if (this.animationState === 'slideOutLeft') {
      console.log('para la izquierda');
      this.next();
    } else if (this.animationState === 'slideOutRight') {
      console.log('para la derecha');
      this.back();
      // }
    }*/

  }

  resetAnimationState() {
    // this.animationState = '';
  }

  userAction(action: string) {
    const step = action === 'back' ? (this.step -= 1) : (this.step += 1);
    this.action.emit(step);
  }

  getPlans() {
    this.planSrv.getPlans().subscribe(
      response => {
        console.log(response);
        if (!response.HasError) {
          this.plans = response.Result;
          console.log(this.plans);
          this.selectedPlanMobile = this.plans[0];
          if (this.plans.length <= 1) {
            this.disableNext = true;
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  selectPlan(plan: PlanModel) {
    const planMember = new SignupRequestModel();
    planMember.planId = plan.plan_id;
    planMember.currentStep = this.step;
    this.signupSrv.signup(planMember).subscribe(
      response => {
        if (!response.HasError) {
          this.step = 3;
          this.action.emit(this.step);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  back() {
    console.log(this.selectedPlanMobile);
    this.currentPlan -= 1;
    this.selectedPlanMobile = this.plans[this.currentPlan];
    this.disableNext = false;
    if (this.currentPlan === 0) {
      this.disableBack = true;
    }
  }

  next() {
    console.log(this.selectedPlanMobile);
    this.currentPlan += 1;
    this.selectedPlanMobile = this.plans[this.currentPlan];
    this.disableBack = false;
    if (this.currentPlan === this.plans.length - 1) {
      this.disableNext = true;
    }
  }
}
