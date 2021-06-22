import { Injectable } from '@angular/core';
import { OnboardingRequestModel, APIResponse } from '../models/index';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  constructor(private commonSrv: CommonService, private http: HttpClient) { }

  serviceURl: string = this.commonSrv.apiURL + 'en/';

  onboarding(onboardingRequestModel: OnboardingRequestModel) {
    const url: string = this.serviceURl + 'onboarding';
    return this.http.post<APIResponse<any>>(url, onboardingRequestModel);
  }

  getOnboardingInfo(onboardingRequestModel: OnboardingRequestModel) {
    const url: string = this.serviceURl + 'onboarding/info';
    return this.http.post<APIResponse<any>>(url, onboardingRequestModel);
  }
}
