import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NotificationService, AccountService, DateService } from 'src/app/services';

@Component({
  selector: 'app-account-my-profile',
  templateUrl: './account-my-profile.component.html',
  styleUrls: ['./account-my-profile.component.less']
})
export class AccountMyProfileComponent implements OnInit {

  public editProfile = false;
  public myProfileForm: FormGroup;
  public days = [];
  public months = [];
  public years = [];
  public mobilePhoneBackup = null;

  constructor(
    private fb: FormBuilder,
    private notificationSrv: NotificationService,
    private accountSrv: AccountService,
    private dateSrv: DateService
  ) { }

  ngOnInit() {

    this.myProfileForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        genderId: [0, [Validators.required, Validators.min(1)]],
        gender: ['', [Validators.required]],
        maleGender: ['', [Validators.required]],
        femaleGender: ['', [Validators.required]],
        dateOfBirth: ['', [Validators.required]],
        day: [''],
        month: [''],
        year: [''],
        email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
        billingPhoneId: [''],
        billingPhone: ['', [Validators.required]],
        mobilePhoneId: [''],
        mobilePhone: ['', [Validators.required]],
        billingPhoneSameShipping: [''],
        emergencyContactName: [''],
        emergencyContactPhone: [''],
        emergencyContactRelationship: ['']
      });

    this.getMemberInformation();
    this.getDateInfo();
    this.mobileNumberSameBilling();
    this.setMaleGender();
    this.setFemaleGender();

  }

  public getMemberInformation() {
    this.accountSrv.getUserData().subscribe(response => {
      if (!response.HasError) {
        this.setMemberInformation(response.Result.userData[0], response.Result.userPhones);
      } else {
        this.notificationSrv.showError(response.Message);
      }
    });
  }

  getDateInfo() {
    this.dateSrv.getDateInfo().subscribe(
      response => {
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

  setMaleGender() {
    this.maleGender.valueChanges.subscribe(status => {
      if (status) {
        this.gender.setValue('Male');
        this.genderId.setValue(1);
        this.femaleGender.setValue(false);
      }
    });
  }

  setFemaleGender() {
    this.femaleGender.valueChanges.subscribe(status => {
      if (status) {
        this.gender.setValue('Female');
        this.genderId.setValue(2);
        this.maleGender.setValue(false);
      }
    });
  }

  public setMemberInformation(personalData, phonesData) {
    this.firstName.setValue(personalData.first_name);
    this.lastName.setValue(personalData.last_name);
    this.email.setValue(personalData.email);
    this.dateOfBirth.setValue(personalData.date_of_birth);
    this.genderId.setValue(personalData.gender_id);

    if (this.genderId.value === 1) {
      this.gender.setValue('Male');
      this.maleGender.setValue(true);
    } else if (this.genderId.value === 2) {
      this.gender.setValue('Female');
      this.femaleGender.setValue(true);
    }

    const date = new Date(personalData.date_of_birth);

    this.day.setValue(date.getDate().toString());
    this.month.setValue(date.getMonth() + 1);
    this.year.setValue(date.getFullYear().toString());

    phonesData.forEach(phoneElement => {

      if (phoneElement.phone_type === 1) {
        this.mobilePhone.setValue(phoneElement.phone_number);
        this.mobilePhoneId.setValue(phoneElement.member_phone);
        this.mobilePhoneBackup = this.mobilePhone.value;
      } else if (phoneElement.phone_type === 2) {
        this.billingPhone.setValue(phoneElement.phone_number);
        this.billingPhoneId.setValue(phoneElement.member_phone);
      }

    });

    if (this.billingPhone.value === this.mobilePhone.value) {
      this.billingPhoneSameShipping.setValue(true);
    }

    this.emergencyContactName.setValue(personalData.emergency_contact_first_name);
    this.emergencyContactPhone.setValue(personalData.emergency_contact_phone);
    this.emergencyContactRelationship.setValue(personalData.emergency_contact_relationship);

  }

  public editMyProfile() {
    this.editProfile = !this.editProfile;
  }

  public mobileNumberSameBilling() {
    this.billingPhoneSameShipping.valueChanges.subscribe(status => {
      if (status) {
        this.mobilePhone.setValue(this.billingPhone.value);
      } else {
        this.mobilePhone.setValue(this.mobilePhoneBackup);
      }
    });
  }

  formatDateOfBirth() {
    const dateOfBirthUpdated = new Date(this.year.value.toString(), this.month.value - 1, this.day.value.toString());
    this.dateOfBirth.setValue(dateOfBirthUpdated);
  }

  /*onSearchChange() {
    console.log(this.mobilePhone.value);
    if (this.mobilePhone.value === this.billingPhone.value && this.mobilePhone.value.length === 10) {
      this.billingPhoneSameShipping.setValue(true);
    } else if (this.mobilePhone.value !== this.billingPhone.value && this.mobilePhone.value.length === 10) {
      this.billingPhoneSameShipping.setValue(false);
    }
  }*/

  // user form getters
  get firstName() {
    return this.myProfileForm.get('firstName');
  }
  get lastName() {
    return this.myProfileForm.get('lastName');
  }

  get email() {
    return this.myProfileForm.get('email');
  }

  get gender() {
    return this.myProfileForm.get('gender');
  }

  get maleGender() {
    return this.myProfileForm.get('maleGender');
  }

  get femaleGender() {
    return this.myProfileForm.get('femaleGender');
  }

  get genderId() {
    return this.myProfileForm.get('genderId');
  }

  get dateOfBirth() {
    return this.myProfileForm.get('dateOfBirth');
  }

  get day() {
    return this.myProfileForm.get('day');
  }

  get month() {
    return this.myProfileForm.get('month');
  }

  get year() {
    return this.myProfileForm.get('year');
  }

  get billingPhone() {
    return this.myProfileForm.get('billingPhone');
  }

  get billingPhoneId() {
    return this.myProfileForm.get('billingPhoneId');
  }

  get mobilePhone() {
    return this.myProfileForm.get('mobilePhone');
  }

  get mobilePhoneId() {
    return this.myProfileForm.get('mobilePhoneId');
  }

  get billingPhoneSameShipping() {
    return this.myProfileForm.get('billingPhoneSameShipping');
  }

  get emergencyContactName() {
    return this.myProfileForm.get('emergencyContactName');
  }

  get emergencyContactPhone() {
    return this.myProfileForm.get('emergencyContactPhone');
  }

  get emergencyContactRelationship() {
    return this.myProfileForm.get('emergencyContactRelationship');
  }

  public saveMyProfileInformation() {
    console.log(this.myProfileForm.getRawValue());
    this.formatDateOfBirth();
    this.accountSrv.updateUserData(this.myProfileForm.getRawValue()).subscribe(res => {
      if (!res.HasError) {
        this.notificationSrv.showSuccess(res.Message);
        this.editProfile = false;
      } else {
        this.notificationSrv.showError(res.Message);
      }
    });
  }



}
