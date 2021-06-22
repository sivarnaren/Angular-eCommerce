import { Injectable } from '@angular/core';
import { APIResponse, GetMyFamilyResult, FamilyUser } from '../models/index';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';
import { GetMyFamilyEditResult, AddDependent, EditUser } from '../models/myFamily.model';

@Injectable({
  providedIn: 'root'
})
export class MyFamilyService {
  // TODO : Upgrade method names
  constructor(private commonSrv: CommonService, private http: HttpClient) {}

  serviceURl: string = this.commonSrv.apiURL + 'en/';

  getMyFamily() {
    const url = `${this.serviceURl}userfamily`;
    return this.http.get<APIResponse<GetMyFamilyResult>>(url);
  }
  deleteMyFamilyMember(relationId: number) {
    const url = `${this.serviceURl}myfamily/member/${relationId}`;
    return this.http.delete<APIResponse<boolean>>(url);
  }
  addMyFamilyMember(member: FamilyUser) {
    const url = `${this.serviceURl}myfamily/member`;
    return this.http.post<APIResponse<FamilyUser>>(url, member);
  }
  getFamilyMember(memberRelationId: number) {
    const url = `${this.serviceURl}myfamily/member/${memberRelationId}`;
    return this.http.get<APIResponse<EditUser>>(url);
  }

  getAccountBasicData() {
    const url = `${this.serviceURl}myfamily/getBasicData`;
    return this.http.get<APIResponse<EditUser>>(url);
  }

  getInvitation(memberRelationId: number) {
    const url = `${this.serviceURl}myfamily/invitation/${memberRelationId}`;
    return this.http.get<APIResponse<EditUser>>(url);
  }
  putInvitation(invitation) {
    const url = `${this.serviceURl}myfamily/invitation`;
    return this.http.put<APIResponse<FamilyUser>>(url, invitation);
  }
  putEditMyFamily(familyMember) {
    const url = `${this.serviceURl}myfamily/member`;
    return this.http.put<APIResponse<FamilyUser>>(url, familyMember);
  }

  getGuestMember(memberRelationId: number) {
    const url = `${this.serviceURl}myfamily/guest/${memberRelationId}`;
    return this.http.get<APIResponse<EditUser>>(url);
  }

  addDependent(dependent: AddDependent) {
    const url = `${this.serviceURl}myfamily/dependent`;
    return this.http.post<APIResponse<boolean>>(url, dependent);
  }

  upgradePhamilyAccount() {
    const url = `${this.serviceURl}upgrade-account`;
    return this.http.post<APIResponse<boolean>>(url, {});
  }
}
@Injectable()
export class MyFamilyPersistData {
  private relationId: number;
  private isNewDependant: boolean;
  getRelationId(): number {
    return this.relationId;
  }

  setRelationId(relationId: number) {
    this.relationId = relationId;
  }

  getIsNewDependant(): boolean {
    return this.isNewDependant;
  }

  setIsNewDependantt(isNewDependant: boolean) {
    this.isNewDependant = isNewDependant;
  }
}
