import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIResponse, SignupRequestModel, InvoiceModel, GetStartUpResponseModel } from './../models/index';
import { CommonService } from './common.service';

@Injectable()
export class SignupService {
  constructor(private commonSrv: CommonService, private http: HttpClient) {}

  serviceURl: string = this.commonSrv.apiURL + 'en/';

  signupCognito(signupRequestModel: SignupRequestModel) {
    const url: string = this.serviceURl + 'signup/cognito';
    return this.http.post<APIResponse<any>>(url, signupRequestModel);
  }

  signup(signupRequestModel: SignupRequestModel) {
    const url: string = this.serviceURl + 'signup';
    return this.http.post<APIResponse<any>>(url, signupRequestModel);
  }

  register(signupRequestModel: SignupRequestModel) {
    const url: string = this.serviceURl + 'register';
    return this.http.post<APIResponse<any>>(url, signupRequestModel);
  }

  getSignupInformation(signupRequestModel: SignupRequestModel) {
    const url: string = this.serviceURl + 'signup/info';
    return this.http.post<APIResponse<any>>(url, signupRequestModel);
  }

  getInvoicePdf() {
    const url: string = this.serviceURl + 'signup/get-invoice-pdf';
    return this.http.post<InvoiceModel>(url, null);
  }

  getCommonFormData() {
    const url = `${this.serviceURl}startup/data`;
    return this.http.get<APIResponse<any>>(url);
  }

  getRegisterInvitationData(uuid) {
    const url = `${this.serviceURl}myfamily/register-invitation/${uuid}`;
    return this.http.get<APIResponse<any>>(url);
  }
}
