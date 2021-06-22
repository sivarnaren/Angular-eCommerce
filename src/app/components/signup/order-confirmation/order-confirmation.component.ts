import { DCIModel } from './../../../models/dci.model';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupService, NotificationService, DciService } from 'src/app/services';
import { SignupRequestModel, OrderModel } from 'src/app/models';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.less']
})
export class OrderConfirmationComponent implements OnInit {
  @Input() step: number;
  @Output() action: EventEmitter<number> = new EventEmitter<number>();
  orderInfo: OrderModel;

  constructor(
    private signupSrv: SignupService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationSrv: NotificationService,
    private dciSrv: DciService
  ) { }

  ngOnInit() {
    this.getOrderInformation();
  }

  getOrderInformation() {
    const member = new SignupRequestModel();
    member.currentStep = 5;
    console.log(member);
    this.signupSrv.getSignupInformation(member).subscribe(
      response => {
        if (!response.HasError) {
          this.orderInfo = new OrderModel();
          this.orderInfo.address1 = response.Result.address1;
          this.orderInfo.address2 = response.Result.address2;
          this.orderInfo.city = response.Result.city;
          this.orderInfo.firstName = response.Result.first_name;
          this.orderInfo.lastName = response.Result.last_name;
          this.orderInfo.orderPrice = response.Result.order_price;
          this.orderInfo.paymentPeriod = response.Result.payment_period;
          this.orderInfo.planName = response.Result.plan_name;
          this.orderInfo.state = response.Result.state;
          this.orderInfo.zipcode = response.Result.zipcode;
          this.orderInfo.lastFour = response.Result.lastfour;
          this.orderInfo.email = response.Result.email;
          this.orderInfo.abbreviation = response.Result.abbreviation;
          this.orderInfo.bankAccountNumber = response.Result.bank_account_number;
          this.orderInfo.paymentType = response.Result.payment_type;
          console.log(this.orderInfo);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  async goToOnboarding() {
    const memberModel = new SignupRequestModel();
    memberModel.currentStep = this.step;
    const signupResponse = await this.signupSrv.signup(memberModel).toPromise();
    console.log(signupResponse);
    if (!signupResponse.HasError) {
      // console.log('se creo la relacion');
      this.router.navigate(['../onboarding'], { relativeTo: this.activatedRoute });

      /* TODO: "right now the membership card process is not working because network configuration.
      /When this works, it's only remove this comment. This process was working correctlybefore that."*/

      /*const dciJsonResponse = await this.dciSrv.createDCIJsonRequest({}).toPromise();
      console.log(dciJsonResponse);
      if (!dciJsonResponse.HasError) {
        const createDCICardResponse = await this.dciSrv.createDigitalCard(dciJsonResponse.Result).toPromise();
        console.log(createDCICardResponse);
        if (createDCICardResponse.card && createDCICardResponse.url) {
          console.log('dci card created...');
          const memberCard = new DCIModel();
          memberCard.card_uuid = createDCICardResponse.card;
          memberCard.url = createDCICardResponse.url;
          memberCard.card_content = dciJsonResponse.Result;
          const createMemberCardRelation = await this.dciSrv.createMemberCardRelation(memberCard).toPromise();
          console.log(createMemberCardRelation);
          if (!createMemberCardRelation.HasError) {
            console.log('se creo la relacion');
            this.router.navigate(['../onboarding'], { relativeTo: this.activatedRoute });
          } else {
            console.log('no se creo la relacion');
            this.notificationSrv.showError(createMemberCardRelation.Message);
          }
        } else {
          console.log('error generating dci card...');
        }
      }*/
    } else {
      this.notificationSrv.showError(signupResponse.Message);
    }
  }
}
