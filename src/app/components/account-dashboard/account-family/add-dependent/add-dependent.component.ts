import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, NotificationService, MyFamilyService, MyFamilyPersistData, DateService } from 'src/app/services';
import { ReCaptchaV3Service } from 'ngx-captcha';

import { RelationType, FamilyUser } from 'src/app/models/myFamily.model';
import { GenderModel } from 'src/app/models';

import * as moment from 'moment';
@Component({
  selector: 'app-add-dependent',
  templateUrl: './add-dependent.component.html',
  styleUrls: ['./add-dependent.component.less']
})
export class AddDependentComponent implements OnInit {
  relationId: number;

  addMemberForm: FormGroup;
  relationTypes: RelationType[];
  genderList: GenderModel[];
  public days = [];
  public months = [];
  public years = [];

  constructor(
    private fb: FormBuilder,
    private accountSrv: AccountService,
    private myFamilySrv: MyFamilyService,
    private notificationSrv: NotificationService,
    private dateSrv: DateService,

    private reCaptchaV3Service: ReCaptchaV3Service,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.addMemberForm = this.fb.group(
      {
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        member_relation_type_id: [{ value: 2, disabled: true }, [Validators.required, Validators.min(1)]],
        birthday: [''],
        day: ['0'],
        month: ['0'],
        year: ['0'],
        gender_id: [0, [Validators.required, Validators.min(1)]],
        havePhysician: [false, [Validators.required]],
        physicianFirstName: [{ value: '', disabled: false }, [Validators.required]],
        physicianLastName: [{ value: '', disabled: false }, [Validators.required]],
        physicianPhoneNumber: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        physicianFaxNumber: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]]
      },
      {}
    );
    this.getDateInfo();
  }

  ngOnInit() {
    this.genderList = JSON.parse(localStorage.getItem('genderList'));
    this.relationTypes = JSON.parse(localStorage.getItem('familyRelationTypeList'));
    console.log(this.relationTypes);
  }
  showPysicianControl() {
    this.addMemberForm.controls.havePhysician.valueChanges.subscribe(status => {
      console.log(status);
      if (!status) {
        this.physicianFirstName.setValue('');
        this.physicianFirstName.setValidators([Validators.required]);
        this.physicianFirstName.enable();
        this.physicianLastName.setValue('');
        this.physicianLastName.setValidators([Validators.required]);
        this.physicianLastName.enable();
        this.physicianPhoneNumber.setValue('');
        this.physicianPhoneNumber.setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
        this.physicianPhoneNumber.enable();
        this.physicianFaxNumber.setValue('');
        this.physicianFaxNumber.setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
        this.physicianFaxNumber.enable();
      } else {
        this.physicianFirstName.setValue('');
        this.physicianFirstName.disable();
        this.physicianFirstName.setValidators(null);
        this.physicianLastName.setValue('');
        this.physicianLastName.disable();
        this.physicianLastName.setValidators(null);
        this.physicianPhoneNumber.setValue('');
        this.physicianPhoneNumber.setValidators(null);
        this.physicianPhoneNumber.disable();
        this.physicianFaxNumber.setValue('');
        this.physicianFaxNumber.setValidators(null);
        this.physicianFaxNumber.disable();
      }

      this.physicianFirstName.updateValueAndValidity();
      this.physicianLastName.updateValueAndValidity();
      this.physicianPhoneNumber.updateValueAndValidity();
      this.physicianFaxNumber.updateValueAndValidity();
    });
  }
  addDependentMember() {
    this.formatDateOfBirth();

    const formData = this.addMemberForm.getRawValue();
    this.myFamilySrv.addDependent(formData).subscribe(res => {
      if (!res.HasError) {
        this.notificationSrv.showSuccess(res.Message);
        this.router.navigate(['../../family'], { relativeTo: this.activatedRoute });
      } else {
        this.notificationSrv.showError(res.Message);
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
  formatDateOfBirth() {
    const dateOfBirthUpdated = new Date(this.year.value.toString(), this.month.value - 1, this.day.value.toString());
    this.birthday.setValue(dateOfBirthUpdated);
  }

  cancel() {
    this.router.navigate(['../../family'], { relativeTo: this.activatedRoute });
  }

  goToDashboard() {
    this.router.navigate(['../../../account'], { relativeTo: this.activatedRoute });
  }

  // Getters
  get email() {
    return this.addMemberForm.get('email');
  }

  get firstName() {
    return this.addMemberForm.get('first_name');
  }
  get lastName() {
    return this.addMemberForm.get('last_name');
  }
  get birthday() {
    return this.addMemberForm.get('birthday');
  }
  get day() {
    return this.addMemberForm.get('day');
  }

  get month() {
    return this.addMemberForm.get('month');
  }

  get year() {
    return this.addMemberForm.get('year');
  }
  get havePhysician() {
    return this.addMemberForm.get('havePhysician').value;
  }

  get physicianFirstName() {
    return this.addMemberForm.get('physicianFirstName');
  }
  get physicianLastName() {
    return this.addMemberForm.get('physicianLastName');
  }
  get physicianPhoneNumber() {
    return this.addMemberForm.get('physicianPhoneNumber');
  }
  get physicianFaxNumber() {
    return this.addMemberForm.get('physicianFaxNumber');
  }
}
