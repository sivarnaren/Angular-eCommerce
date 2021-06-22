import { GenderModel, State } from './gender.model';

export class SignupRequestModel {
  email: string;
  pwd?: string;
  firstName?: string;
  lastName?: string;
  acceptTerms?: boolean;
  acceptTermsDate?: boolean;
  languageCodeId?: number;
  optInEmail?: boolean;
  optInSms?: boolean;
  address1?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  longitude?: number;
  latitude?: number;
  sameBillingAddress?: boolean;
  planId?: number;
  paymentPeriod?: string;
  lastFour?: number;
  phoneNumber?: string;
  textMessagingPin?: number;
  currentStep: number;
  awsAccountId: string;
}

/*export class SignupModel {
    address1?: string;
    address1?: string;
    address1?: string;
    address1?: string;
    address1?: string;
    address1?: string;
}*/

export interface InvoiceModel {
  pdf_base64: string;
}

export class GetStartUpResponseModel {
  genderList?: GenderModel[];
  stateList?: State[];
}
