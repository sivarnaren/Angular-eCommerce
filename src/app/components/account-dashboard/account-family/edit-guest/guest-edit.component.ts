import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, NotificationService, MyFamilyService, MyFamilyPersistData } from 'src/app/services';
import { ReCaptchaV3Service } from 'ngx-captcha';
import * as moment from 'moment';

import { RelationType, FamilyUser, EditUser } from 'src/app/models/myFamily.model';
import { GenderModel } from 'src/app/models';

@Component({
  selector: 'app-guest-edit',
  templateUrl: './guest-edit.component.html',
  styleUrls: ['./guest-edit.component.less']
})
export class GuestEditComponent implements OnInit {
  relationId: number;
  showGender = true;
  addMemberForm: FormGroup;
  relationTypes: RelationType[];
  guestRelationTypes: RelationType[];

  genderList: GenderModel[];
  familyUser: EditUser;

  constructor(
    private fb: FormBuilder,
    private accountSrv: AccountService,
    private myFamilySrv: MyFamilyService,
    private notificationSrv: NotificationService,
    private reCaptchaV3Service: ReCaptchaV3Service,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.addMemberForm = this.fb.group(
      {
        member_id: ['', []],
        member_relation_id: ['', []],
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        member_relation_type_id: [0, [Validators.required, Validators.min(1)]],
        gender_id: [0, [Validators.required, Validators.min(1)]],
        isDependent: [false, []],
        birthday: [Date(), [Validators.required]]
      },
      {}
    );
  }

  ngOnInit() {
    this.genderList = JSON.parse(localStorage.getItem('genderList'));
    this.relationTypes = JSON.parse(localStorage.getItem('familyRelationTypeList'));
    this.guestRelationTypes = JSON.parse(localStorage.getItem('guestRelationTypeList'));

    this.activatedRoute.params.subscribe(params => {
      this.relationId = params.id ? params.id : 0;

      if (!isNaN(this.relationId)) {
        this.myFamilySrv.getGuestMember(this.relationId).subscribe(res => {
          if (!res.HasError) {
            this.familyUser = res.Result;
            this.showGender = this.familyUser.has_login;
            this.addMemberForm.setValue({
              member_id: this.familyUser.subscriber_member_id,
              member_relation_id: this.familyUser.member_relation_id,
              first_name: this.familyUser.first_name,
              last_name: this.familyUser.last_name,
              member_relation_type_id: this.familyUser.member_relation_type_id,
              gender_id: this.familyUser.gender_id,
              isDependent: false,
              birthday: moment(this.familyUser.date_of_birth).format('YYYY-MM-DD')
            });
          }
        });
      } else {
        this.router.navigate(['../account/family'], { relativeTo: this.activatedRoute });
      }
    });
  }

  editFamilyMember() {
    const formData = this.addMemberForm.getRawValue();
    this.myFamilySrv.putEditMyFamily(formData).subscribe(res => {
      if (!res.HasError) {
        this.notificationSrv.showSuccess(res.Message);
      } else {
        this.notificationSrv.showError(res.Message);
      }
    });
  }
  cancel() {
    this.router.navigate(['../account/family'], { relativeTo: this.activatedRoute });
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
  get isDependent() {
    return this.addMemberForm.get('isDependent').value;
  }
}
