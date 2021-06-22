import { GenderModel, OnboardingRequestModel } from './../../../models/index';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  OnboardingService,
  NotificationService,
  DateService
} from '../../../services/index';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.less']
})
export class PersonalInformationComponent implements OnInit {
  @Input() step: number;
  @Output() action: EventEmitter<number> = new EventEmitter<number>();
  public genders: GenderModel[] = new Array<GenderModel>();
  public days: Array<string> = new Array<string>();
  public years: Array<string> = new Array<string>();
  public months: Array<any> = Array<any>();
  onboardingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private onboardingSrv: OnboardingService,
    private notificationSrv: NotificationService,
    private dateSrv: DateService
  ) { }

  ngOnInit() {
    this.onboardingForm = this.fb.group({
      genderId: ['', [Validators.required]],
      month: [null, [Validators.required]],
      day: [null, [Validators.required]],
      year: [null, [Validators.required]],
      physicianFirstName: ['', [Validators.required]],
      physicianLastName: ['', [Validators.required]],
      physicianPhoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ],
      physicianFax: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      emergencyContactFirstName: ['', [Validators.required]],
      emergencyContactPhoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ],
      emergencyContactRelationship: ['', [Validators.required]],
      noPhysician: false,
      currentStep: [this.step]
    });

    this.loadPersonalInformation();
    this.getDateInfo();
  }

  userAction(action: string) {
    const step = action === 'back' ? (this.step -= 1) : (this.step = 2);
    this.action.emit(step);
  }

  getDateInfo() {
    this.dateSrv.getDateInfo().subscribe(
      response => {
        console.log(response);
        if (!response.HasError) {
          this.days = response.Result.days;
          this.months = response.Result.months;
          this.years = response.Result.years;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  // Load member information in case he didn't complete the entire onboarding process
  loadPersonalInformation() {
    const onboardingInfo = new OnboardingRequestModel();
    onboardingInfo.currentStep = this.step;
    this.onboardingSrv.getOnboardingInfo(onboardingInfo).subscribe(
      response => {
        console.log(response);
        if (!response.HasError && response.Result) {
          this.onboardingForm.controls.genderId.setValue(
            response.Result.gender_id
          );
          this.onboardingForm.controls.month.setValue(response.Result.month);
          this.onboardingForm.controls.day.setValue(
            response.Result.day.toString()
          );
          this.onboardingForm.controls.year.setValue(
            response.Result.year.toString()
          );
          this.onboardingForm.controls.physicianFirstName.setValue(
            response.Result.physician_first_name
          );
          this.onboardingForm.controls.physicianLastName.setValue(
            response.Result.physician_last_name
          );
          this.onboardingForm.controls.physicianPhoneNumber.setValue(
            response.Result.physician_phone
          );
          this.onboardingForm.controls.physicianFax.setValue(
            response.Result.physician_fax
          );
          this.onboardingForm.controls.emergencyContactFirstName.setValue(
            response.Result.emergency_contact_first_name
          );
          this.onboardingForm.controls.emergencyContactPhoneNumber.setValue(
            response.Result.emergency_contact_phone
          );
          this.onboardingForm.controls.emergencyContactRelationship.setValue(
            response.Result.emergency_contact_relationship
          );
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  setNoPhysician() {

    console.log('this is a test');

    this.noPhysician.valueChanges.subscribe(status => {
      console.log(status);

      if (status) {
        this.physicianFirstName.setValidators(null);
        this.physicianLastName.setValidators(null);
        this.physicianPhoneNumber.setValidators(null);
        this.physicianFax.setValidators(null);
        this.physicianFirstName.setValue('');
        this.physicianLastName.setValue('');
        this.physicianPhoneNumber.setValue('');
        this.physicianFax.setValue('');
      } else {
        this.physicianFirstName.setValidators([Validators.required]);
        this.physicianLastName.setValidators([Validators.required]);
        this.physicianPhoneNumber.setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
        this.physicianFax.setValidators([Validators.minLength(10), Validators.maxLength(10)]);
      }

      this.physicianFirstName.updateValueAndValidity();
      this.physicianLastName.updateValueAndValidity();
      this.physicianPhoneNumber.updateValueAndValidity();
      this.physicianFax.updateValueAndValidity();

    });

  }

  get noPhysician() {
    return this.onboardingForm.controls.noPhysician;
  }

  get physicianFirstName() {
    return this.onboardingForm.get('physicianFirstName');
  }

  get physicianLastName() {
    return this.onboardingForm.get('physicianLastName');
  }

  get physicianPhoneNumber() {
    return this.onboardingForm.get('physicianPhoneNumber');
  }

  get physicianFax() {
    return this.onboardingForm.get('physicianFax');
  }

  get emergencyContactFirstName() {
    return this.onboardingForm.get('emergencyContactFirstName');
  }

  get emergencyContactPhoneNumber() {
    return this.onboardingForm.get('emergencyContactPhoneNumber');
  }

  get emergencyContactRelationship() {
    return this.onboardingForm.get('emergencyContactRelationship');
  }

  nextStep() {
    console.log(this.onboardingForm.value);
    this.onboardingSrv
      .onboarding(this.onboardingForm.value)
      .subscribe(response => {
        console.log(response);
        if (!response.HasError) {
          this.userAction('advance');
        } else {
          this.notificationSrv.showError(response.Message);
        }
      });
  }
}
