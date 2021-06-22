import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, NotificationService, MyFamilyService, MyFamilyPersistData } from 'src/app/services';
import { TranslateService } from 'src/app/translator/translate.service';

import { RelationType, FamilyUser, EditUser } from 'src/app/models/myFamily.model';
import { GenderModel } from 'src/app/models';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationStackedModalComponent } from 'src/app/components/common-components/index';
@Component({
  selector: 'app-edit-invitation',
  templateUrl: './edit-invitation.component.html',
  styleUrls: ['./edit-invitation.component.less']
})
export class EditInvitationComponent implements OnInit {
  @Input() relationId: number;
  @Input() isActive: boolean;
  @Input() index: number;

  // tslint:disable-next-line: ban-types
  @Output() action: EventEmitter<Object> = new EventEmitter<Object>();

  closeResult: string;
  modalReference: NgbModalRef;

  showGender = true;
  addMemberForm: FormGroup;
  relationTypes: RelationType[];
  guestRelationTypes: RelationType[];
  genderList: GenderModel[];
  familyUser: EditUser;
  constructor(
    private modalSvr: NgbModal,

    private fb: FormBuilder,
    private accountSrv: AccountService,
    private myFamilySrv: MyFamilyService,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.addMemberForm = this.fb.group(
      {
        member_relation_id: ['', []],
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        email: ['', [Validators.email, Validators.required]],
        member_relation_type_id: [{ value: 0, disabled: this.showGender }, [Validators.required, Validators.min(1)]]
      },
      {}
    );
  }
  setLang(lang: string) {
    localStorage.setItem('lng', lang);
    this.translate.use();
  }
  ngOnInit() {}

  //  1: edit, 2: delete
  editInvitation() {
    const formData = this.addMemberForm.getRawValue();

    this.myFamilySrv.putInvitation(formData).subscribe(res => {
      if (!res.HasError) {
        this.returnResult(1, res.Result, res.Message);
        this.modalReference.close();
        this.getDismissReason('logic');
      } else {
        this.returnResult(1, null, res.Message);
        this.modalReference.close();
        this.getDismissReason('logic');
      }
    });
  }
  cancel() {
    this.router.navigate(['../../family'], { relativeTo: this.activatedRoute });
  }

  removeInvitation() {
    const confirmationModal: NgbModalRef = this.modalSvr.open(ConfirmationStackedModalComponent, {
      centered: true
    });

    (confirmationModal.componentInstance as ConfirmationStackedModalComponent).confirmationWording = `Are you sure
    you want to
    remove this invitation?`;

    confirmationModal.result.then(
      result => {
        console.log(result);
        if (result.localeCompare('Delete') === 0) {
          this.myFamilySrv.deleteMyFamilyMember(this.relationId).subscribe(res => {
            if (!res.HasError) {
              const memberToDelete = { index: this.index, relationId: this.relationId };
              this.returnResult(2, memberToDelete, res.Message);
              this.modalReference.close();
              this.getDismissReason('logic');
            } else {
              this.returnResult(2, null, res.Message);
              this.modalReference.close();
              this.getDismissReason('logic');
            }
          });
        }
      },
      reason => {
        console.log(reason);
      }
    );
  }

  open(content) {
    this.genderList = JSON.parse(localStorage.getItem('genderList'));
    this.relationTypes = JSON.parse(localStorage.getItem('familyRelationTypeList'));
    this.guestRelationTypes = JSON.parse(localStorage.getItem('guestRelationTypeList'));

    if (!isNaN(this.relationId)) {
      this.myFamilySrv.getInvitation(this.relationId).subscribe(res => {
        if (!res.HasError) {
          this.familyUser = res.Result;
          this.addMemberForm.setValue({
            member_relation_id: this.familyUser.member_relation_id,
            first_name: this.familyUser.first_name,
            last_name: this.familyUser.last_name,
            email: this.familyUser.email,
            member_relation_type_id: this.familyUser.member_relation_type_id
          });
        }
        this.modalReference = this.modalSvr.open(content);
      });
    } else {
      this.router.navigate(['../../family'], { relativeTo: this.activatedRoute });
    }

    this.modalReference.result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
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

  // method is a number to determine if is edit or is delete
  //  1: edit, 2: delete

  returnResult(method: number, member, message: string) {
    const result = { method, member, message };
    this.action.emit(result);
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
}
