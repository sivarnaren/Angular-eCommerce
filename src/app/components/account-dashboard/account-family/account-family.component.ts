import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, NotificationService, MyFamilyService, MyFamilyPersistData } from 'src/app/services';
import { TranslateService } from 'src/app/translator/translate.service';

import { RelationType, FamilyUser } from 'src/app/models/myFamily.model';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationStackedModalComponent } from 'src/app/components/common-components/index';

@Component({
  selector: 'app-account-family',
  templateUrl: './account-family.component.html',
  styleUrls: ['./account-family.component.less']
})
export class AccountFamilyComponent implements OnInit {
  addMemberForm: FormGroup;
  addGuestMemberForm: FormGroup;
  relationTypes: RelationType[];
  guestRelationTypes: RelationType[];

  familyUsers: FamilyUser[];
  guestUsers: FamilyUser[];

  activeFamilyUsers: FamilyUser[];
  activeGuestUsers: FamilyUser[];

  memberFullName: string;

  constructor(
    private fb: FormBuilder,
    private accountSrv: AccountService,
    private myFamilySrv: MyFamilyService,
    private notificationSrv: NotificationService,
    private modalSvr: NgbModal,

    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.addMemberForm = this.fb.group(
      {
        email: ['', [Validators.email, Validators.required]],
        member_relation_type_id: [0, [Validators.required, Validators.min(1)]]
      },
      {}
    );
    this.addGuestMemberForm = this.fb.group(
      {
        email: ['', [Validators.email, Validators.required]],
        member_relation_type_id: [0, [Validators.required, Validators.min(1)]]
      },
      {}
    );
  }

  setLang(lang: string) {
    localStorage.setItem('lng', lang);
    this.translate.use();
  }

  ngOnInit() {
    this.relationTypes = JSON.parse(localStorage.getItem('familyRelationTypeList'));
    this.guestRelationTypes = JSON.parse(localStorage.getItem('guestRelationTypeList'));
    this.myFamilySrv.getMyFamily().subscribe(res => {
      if (!res.HasError) {
        const resulData = res.Result;
        this.memberFullName = resulData.memberName;
        this.familyUsers = resulData.familyUsers;
        this.guestUsers = resulData.guestUsers;
        this.activeFamilyUsers = resulData.activeFamilyUsers;
        this.activeGuestUsers = resulData.activeGuestUsers;
        this.familyUsers = this.familyUsers.concat(this.activeFamilyUsers);
        this.guestUsers = this.guestUsers.concat(this.activeGuestUsers);
      }
    });
  }

  removefromList(index, isGuest) {
    if (isGuest) {
      this.guestUsers.splice(index, 1);
    } else {
      this.familyUsers.splice(index, 1);
    }
  }
  addMember() {
    this.myFamilySrv.addMyFamilyMember(this.addMemberForm.value).subscribe(res => {
      if (!res.HasError) {
        this.familyUsers.push(res.Result);
        this.notificationSrv.showSuccess(res.Message);
      } else {
        this.notificationSrv.showError(res.Message);
      }
    });
  }
  addGuestMember() {
    this.myFamilySrv.addMyFamilyMember(this.addGuestMemberForm.value).subscribe(res => {
      if (!res.HasError) {
        this.guestUsers.push(res.Result);
        this.notificationSrv.showSuccess(res.Message);
      } else {
        this.notificationSrv.showError(res.Message);
      }
    });
  }
  removeMember(index: number, isGuest: boolean) {
    const confirmationModal: NgbModalRef = this.modalSvr.open(ConfirmationStackedModalComponent, {
      centered: true
    });

    (confirmationModal.componentInstance as ConfirmationStackedModalComponent).confirmationWording = `Are you sure
    you want to
    remove this guest?`;
    confirmationModal.result.then(
      result => {
        console.log(result);
        if (result.localeCompare('Delete') === 0) {
          const member = isGuest ? this.guestUsers[index] : this.familyUsers[index];
          const relationId = member.member_relation_id;

          this.myFamilySrv.deleteMyFamilyMember(relationId).subscribe(res => {
            if (!res.HasError) {
              this.notificationSrv.showSuccess(res.Message);
              this.removefromList(index, isGuest);
            } else {
              this.notificationSrv.showError(res.Message);
            }
          });
        }
      },
      reason => {
        console.log(reason);
      }
    );
  }
  goToAddNewDependent() {
    this.router.navigate(['./dependent'], { relativeTo: this.activatedRoute });
  }

  getEditResult(result) {
    const member = result.member;
    const message = result.message;
    //  1: edit, 2: delete
    const method = result.method;
    if (method === 1) {
      if (member) {
        this.notificationSrv.showSuccess(message);
        const index = this.familyUsers.findIndex(currentMember => currentMember.member_relation_id === member.member_relation_id);
        if (index > -1) {
          this.familyUsers[index].first_name = member.first_name;
          this.familyUsers[index].last_name = member.last_name;
          this.familyUsers[index].member_relation_type_id = member.member_relation_type_id;
        }
      } else {
        this.notificationSrv.showError(message);
      }
    } else {
      // delete
      if (member) {
        this.notificationSrv.showSuccess(message);
        this.removefromList(member.index, false);
      } else {
        this.notificationSrv.showSuccess(message);
      }
    }
  }
  getAddResult(result) {
    const member = result.member;
    const message = result.message;

    if (member) {
      const index = this.guestRelationTypes.findIndex(
        relation => relation.lookup_member_relation_type_id === member.member_relation_type_id
      );

      if (index > -1) {
        this.guestUsers.push(member);
      } else {
        this.familyUsers.push(member);
      }
      this.notificationSrv.showSuccess(message);
    } else {
      this.notificationSrv.showError(message);
    }
  }

  goToProfile() {
    this.router.navigate(['../info'], { relativeTo: this.activatedRoute });
  }
  goToDashboard() {
    this.router.navigate(['../../account'], { relativeTo: this.activatedRoute });
  }
  get email() {
    return this.addMemberForm.get('email');
  }
  get memberEmail() {
    return this.addGuestMemberForm.get('email');
  }
}
