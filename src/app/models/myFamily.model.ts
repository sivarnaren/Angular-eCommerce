import { GenderModel } from './gender.model';

export class RelationType {
  'lookup_member_relation_type_id'?: number;
  'display_value'?: string;
  'is_guest'?: boolean;
}
export class FamilyUser {
  'member_relation_id': number;
  'subscriber_member_id': number;
  'is_active': boolean;
  'status_display': string;
  'member_relation_type_id': number;
  'display_value': string;
  'invitation_code': string;
  'email': string;
  'first_name'?: string;
  'last_name'?: string;
}

export class EditUser extends FamilyUser {
  'member_id'?: number;
  'first_name': string;
  'last_name': string;
  'gender_id': number;
  'date_of_birth': Date;
  'has_login': boolean;
}

export class AddDependent {
  'first_name': string;
  'last_name': string;
  'member_relation_type_id': string;
  'isDependent': boolean;
  'birthday': Date;
}

export class GetMyFamilyResult {
  memberName: string;
  relationTypes: RelationType[];
  guestRelationTypes: RelationType[];
  familyUsers: FamilyUser[];
  guestUsers: FamilyUser[];
  activeFamilyUsers: FamilyUser[];
  activeGuestUsers: FamilyUser[];
}

export class GetMyFamilyEditResult {
  relationTypes: RelationType[];
  guestRelationTypes: RelationType[];
  memberRelation: EditUser;
  genderList: GenderModel[];
}
