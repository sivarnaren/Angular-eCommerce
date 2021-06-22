import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {APIResponse, PolicyModel} from './../models/index';
import {CommonService} from './common.service';

@Injectable({
  providedIn: 'root'
})
export class PoliciesService {

  constructor(private commonSrv: CommonService, private http: HttpClient) {}
  serviceURl: string = this.commonSrv.apiURL;

  getPolicies() {
    /**
     * Preguntar a Jorge como hacer para que sea la misma url que la de Cognito
     */
    const url = 'https://rcgkdcymzi.execute-api.us-west-2.amazonaws.com/dev/get-policies';
    return this.http.get<APIResponse<PolicyModel[]>>(url);
  }
}
