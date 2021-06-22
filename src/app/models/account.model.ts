import { GenderModel } from './gender.model';

// tslint:disable: variable-name

export interface Payload {
  sub: string;
  email_verified: boolean;
  iss: string;
  phone_number_verified: boolean;
  'cognito:username': string;
  given_name: string;
  aud: string;
  event_id: string;
  token_use: string;
  auth_time: number;
  phone_number: string;
  exp: number;
  iat: number;
  family_name: string;
  email: string;
}

export class IdToken {
  jwtToken: string;
  payload: Payload;
}

export interface RefreshToken {
  token: string;
}

export interface Payload2 {
  sub: string;
  event_id: string;
  token_use: string;
  scope: string;
  auth_time: number;
  iss: string;
  exp: number;
  iat: number;
  jti: string;
  client_id: string;
  username: string;
}

export interface AccessToken {
  jwtToken: string;
  payload: Payload2;
}

export interface AccountResult {
  idToken: IdToken;
  refreshToken: RefreshToken;
  accessToken: AccessToken;
  clockDrift: number;
}

export interface TokenResult {
  member_full_name: string;
  token: string;
  member_type_id: number;
}

export class LoginRequestModel {
  email: string;
  password: string;
  recaptcha: string;
}

export class SendPassResetEmailResult {
  CodeDeliveryDetails: {
    AttributeName: string;
    DeliveryMedium: string;
    Destination: string;
  };
}

export class SendPassResetEmailRequestModel {
  email: string;
}

export class Address {
  member_address?: number;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  latitude?: number;
  longitude?: number;
}
export class UserPhone {
  member_phone?: number;
  phone_number: string;
  phone_type: number;
}

export class ShippingAddressModel extends Address {
  nickname?: string;
  is_default?: boolean;
}

export class UserInfoResponse extends Address {
  member_id?: number;
  first_name: string;
  last_name: string;
  gender_id: number;
  gender: string;
  date_of_birth: Date;
}

export class SendPassResetConfirmationRequestModel {
  email: string;
  confirmation_code: string;
  new_password: string;
}

export class SendPassResetConfirmationResult {
  message: string;
}

export interface PingResult {
  status: string;
}

export class UserDataResult {
  userData: UserInfoResponse;
  userShippings: ShippingAddressModel[];
  userPhones: UserPhone[];
  genderList: GenderModel[];
}
export class AddAddressRequestModel {
  nickname: string;
  defaultShipping: boolean;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipcode: string;
  member_id: number;
}

export class AccountUpdateRequest {
  member_id: number;
  gender_id: number;
  date_of_birth: Date;
  first_name: string;
  last_name: string;
  billing_addres: Address;
  address: ShippingAddressModel[];
  billing_phone: string;
  mobil_phone: string;
}
export class AddAddressResult {
  userShippings: ShippingAddressModel[];
}

// in my security
export class ChangePasswordModel {
  curerent_password: string;
  new_password: string;
}

export class AmIAuthenticatedModel {
  success: boolean;
  message: string;
  data: { member_type_id: number };
}
