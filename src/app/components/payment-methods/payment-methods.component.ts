import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  SignupService, CommonService, PlanService, DateService,
  NotificationService, GooglePlacesService, PaymentProviderService, AccountService, AddressValidationService
} from '../../services/index';
import { CardValidator } from 'src/app/validators';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.less']
})
export class PaymentMethodsComponent implements OnInit {

  @ViewChild('address') address: ElementRef;
  @ViewChild('addressContent') addressContent: ElementRef;

  public modalReference: NgbModalRef;
  public modalAddressReference: NgbModalRef;

  public paymentForm: FormGroup;
  public currentMask = '';
  public typeMask = '';
  public years = [];
  public states = [];
  public paymentMethods = [];
  public allowACH;
  public currentPaymentMethodId: string;

  constructor(
    private signupSrv: SignupService,
    private commonSrv: CommonService,
    private fb: FormBuilder,
    private planSrv: PlanService,
    private dateSrv: DateService,
    private notificationSrv: NotificationService,
    private googlePlaceSrv: GooglePlacesService,
    private paymentSrv: PaymentProviderService,
    private modalSvr: NgbModal,
    private accountSrv: AccountService,
    private addressValidatonSrv: AddressValidationService
  ) {
    this.getStates();
    this.getDateInfo();
    this.getPaymentMethods();
  }

  ngOnInit() {
    this.paymentForm = this.fb.group({
      creditCardNumber: ['', [Validators.required, CardValidator.checkCardFormat]],
      expirationMonth: [null, [Validators.required]],
      expirationYear: [null, [Validators.required]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      nameOnCard: ['', [Validators.required]],
      address1: ['', [Validators.required]],
      address2: [''],
      city: ['', [Validators.required]],
      state: [null, [Validators.required]],
      stateName: [''],
      stateAbbreviation: [''],
      zipCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      paymentMethod: [false, [Validators.required]], // true = ACH & false = credit card
      routingNumber: ['', [Validators.minLength(9), Validators.maxLength(9)]],
      bankAccountNumber: ['']
    });

    this.onChangePaymentMethod();
    this.getConfigurationById();
  }

  getConfigurationById() {
    this.accountSrv.getConfigirationById(8).subscribe((response) => {
      if (!response.HasError) {
        this.allowACH = response.Result[0].value === 'true' ? true : false;
      }
    });
  }

  onChangePaymentMethod() {
    this.paymentMethod.valueChanges.subscribe((status) => {
      if (status) {
        this.creditCardNumber.setValidators(null);
        this.expirationMonth.setValidators(null);
        this.expirationYear.setValidators(null);
        this.cvv.setValidators(null);
        this.nameOnCard.setValidators(null);
        this.routingNumber.setValidators([Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
        this.bankAccountNumber.setValidators([Validators.required]);
      } else {
        this.routingNumber.setValidators(null);
        this.bankAccountNumber.setValidators(null);
        this.creditCardNumber.setValidators([Validators.required, CardValidator.checkCardFormat]);
        this.expirationMonth.setValidators([Validators.required]);
        this.expirationYear.setValidators([Validators.required]);
        this.cvv.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(3)]);
        this.nameOnCard.setValidators([Validators.required]);
      }

      this.creditCardNumber.updateValueAndValidity();
      this.expirationMonth.updateValueAndValidity();
      this.expirationYear.updateValueAndValidity();
      this.cvv.updateValueAndValidity();
      this.nameOnCard.updateValueAndValidity();
      this.routingNumber.updateValueAndValidity();
      this.bankAccountNumber.updateValueAndValidity();
    });
  }

  // tslint:disable-next-line
  ngAfterViewInit() {
    this.googlePlaceSrv
      .loadMaps(this.address, this.setAddress)
      .then(() => {
        console.log('Google maps loaded');
      })
      .catch(error => {
        console.log('error loading map', error);
      });
  }

  setAddress = (city: string, state: string, zipCode: string, latitude: number, longitude: number, country: string, address: string) => {
    this.city.setValue(city);
    this.zipCode.setValue(zipCode);
    this.country.setValue(country);
    this.address1.setValue(address);

    this.states.forEach(item => {
      if (item.abbreviation === state) {
        this.state.setValue(item.id);
        this.stateName.setValue(state);
        this.stateAbbreviation.setValue(item.abbreviation);
      }
    });
  }

  getDateInfo() {
    this.dateSrv.getDateInfo().subscribe(
      response => {
        if (!response.HasError) {
          this.years = response.Result.years;
          const cardYears = [];
          for (let i = 0; i < 10; i++) {
            cardYears.unshift(parseInt(this.years[0], 10) + i);
          }
          this.years = cardYears;
        }
      },
      error => {
        console.log(error);
      }
    );
  }


  getStates() {
    this.signupSrv.getCommonFormData().subscribe(
      response => {
        if (!response.HasError) {
          this.states = response.Result.stateList;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getCreditCardType(creditCardNumber) {
    let result = 'unknown';

    if (/^5[1-5]/.test(creditCardNumber)) {
      result = 'mastercard';
    } else if (/^4/.test(creditCardNumber)) {
      result = 'visa';
    } else if (/^3[47]/.test(creditCardNumber)) {
      result = 'amex';
    } else if (/3(?:0[0-5]|[68][0-9])[0-9]{11}/.test(creditCardNumber)) {
      result = 'diners';
    } else if (/6(?:011|5[0-9]{2})[0-9]{12}/.test(creditCardNumber)) {
      result = 'discover';
    }
    return result;
  }

  public getMaskType(cardType) {
    const masks = {
      mastercard: '0000 0000 0000 0000',
      visa: '0000-0000-0000-0000',
      amex: '0000 000000 00000',
      diners: '0000 0000 0000 00',
      discover: '0000 0000 0000 0000',
      unknown: '0000 0000 0000 0000'
    };
    return masks[cardType];
  }

  resetForm() {
    this.creditCardNumber.setValue(null);
    this.expirationMonth.setValue(null);
    this.expirationYear.setValue(null);
    this.cvv.setValue('');
    this.nameOnCard.setValue('');
    this.address1.setValue('');
    this.address2.setValue('');
    this.city.setValue('');
    this.state.setValue(null);
    this.stateName.setValue('');
    this.zipCode.setValue('');
    this.country.setValue('');
    this.paymentMethod.setValue(false);
    this.routingNumber.setValue('');
    this.bankAccountNumber.setValue('');
  }

  // Getters

  get creditCardNumber() {
    return this.paymentForm.controls.creditCardNumber;
  }

  get expirationMonth() {
    return this.paymentForm.controls.expirationMonth;
  }

  get expirationYear() {
    return this.paymentForm.controls.expirationYear;
  }

  get cvv() {
    return this.paymentForm.controls.cvv;
  }

  get nameOnCard() {
    return this.paymentForm.controls.nameOnCard;
  }

  get address1() {
    return this.paymentForm.controls.address1;
  }

  get address2() {
    return this.paymentForm.controls.address2;
  }

  get city() {
    return this.paymentForm.controls.city;
  }

  get state() {
    return this.paymentForm.controls.state;
  }

  get stateName() {
    return this.paymentForm.controls.stateName;
  }

  get stateAbbreviation() {
    return this.paymentForm.controls.stateAbbreviation;
  }

  get zipCode() {
    return this.paymentForm.controls.zipCode;
  }

  get country() {
    return this.paymentForm.controls.country;
  }

  get paymentMethod() {
    return this.paymentForm.controls.paymentMethod;
  }

  get routingNumber() {
    return this.paymentForm.controls.routingNumber;
  }

  get bankAccountNumber() {
    return this.paymentForm.controls.bankAccountNumber;
  }

  onChange() {
    this.typeMask = this.getCreditCardType(this.creditCardNumber.value);
    this.currentMask = this.getMaskType(this.typeMask);

    if (this.typeMask === 'amex') {
      this.cvv.setValidators([Validators.required, Validators.minLength(4), Validators.maxLength(4)]);
    } else {
      this.cvv.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(3)]);
    }
    this.cvv.updateValueAndValidity();
  }

  getPaymentMethods() {
    this.paymentSrv.getPaymentMethods().subscribe((response) => {
      this.paymentMethods = [];
      if (!response.HasError) {
        this.paymentMethods = response.Result;
      }
    }, error => { console.log(error); });

  }

  setDefaultPaymentMethod(paymentMethodId: string) {

    const request = {
      paymentProfileId: paymentMethodId
    };

    this.paymentSrv.updateDefaultPaymentMethod(request).subscribe((response) => {
      if (!response.HasError) {
        this.notificationSrv.showSuccess(response.Message);
        this.getPaymentMethods();
      } else {
        this.notificationSrv.showError(response.Message);
      }
    }, error => { console.log(error); });

  }

  deletePaymentMethod() {
    const request = {
      customerPaymentProfileId: this.currentPaymentMethodId
    };

    this.paymentSrv.deletePaymentMethod(request).subscribe((response) => {
      if (!response.HasError) {
        this.notificationSrv.showSuccess(response.Message);
        this.modalReference.close();
        this.getPaymentMethods();
      } else {
        this.notificationSrv.showError(response.Message);
      }
    }, error => { console.log(error); });

  }

  open(content, paymentMethodId: string) {
    this.currentPaymentMethodId = paymentMethodId;
    this.modalReference = this.modalSvr.open(content);
    this.modalReference.result.then(
      result => {
        // this.closeResult = `Closed with: ${result}`;
        console.log('closed with: ', result);
      },
      reason => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        this.modalReference.close();
      }
    );
  }

  openAddressModal(content) {
    this.modalAddressReference = this.modalSvr.open(content);
    this.modalAddressReference.result.then(
      result => {
        // this.closeResult = `Closed with: ${result}`;
        console.log('closed with: ', result);
      },
      reason => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        this.modalAddressReference.close();
      }
    );
  }

  closeAddressModal() {
    console.log('close modal');
    this.modalAddressReference.close();
  }

  async validateAddress() {

    const address = {
      city: this.city.value,
      state: this.stateAbbreviation.value,
      zipcode: this.zipCode.value
    };

    const addressValidation = await this.addressValidatonSrv.validateAddress(address).toPromise();
    console.log(addressValidation);

    if (addressValidation.valid_address) {
      this.createPaymentMethod();
    } else {
      this.openAddressModal(this.addressContent);
    }

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  createPaymentMethod() {
    this.paymentSrv.addPaymentMethod(this.paymentForm.getRawValue()).subscribe((response) => {
      if (!response.HasError) {
        this.paymentForm.reset();
        this.paymentMethod.setValue(false);
        this.closeAddressModal();
        this.notificationSrv.showSuccess(response.Message);
        this.getPaymentMethods();
      } else {
        this.notificationSrv.showError(response.Message);
      }
    }, error => { console.log(error); });
  }

}
