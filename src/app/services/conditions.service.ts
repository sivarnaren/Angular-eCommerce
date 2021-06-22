import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { APIResponse, ConditionsModel } from '../models/index';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConditionsService {
  constructor(private commonSrv: CommonService, private http: HttpClient) { }

  serviceURl: string = this.commonSrv.apiURL + 'en/';

  getConditions() {
    const url = this.serviceURl + 'conditions';
    return this.http.get<APIResponse<any>>(url);
  }
}
