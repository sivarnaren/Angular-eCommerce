import { DCIModel } from '../models/index';
import { APIResponse } from './../models/common.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable()
export class DciService {
  constructor(private commonSrv: CommonService, private http: HttpClient) {}

  dicURl: string = this.commonSrv.dciURL;
  serviceURL: string = this.commonSrv.apiURL;

  createDCIJsonRequest(json: any) {
    const url = this.serviceURL + 'dci/create';
    return this.http.post<APIResponse<any>>(url, json);
  }

  createDigitalCard(digitalCard: any) {
    const url = this.dicURl;
    return this.http.post<any>(url, digitalCard);
  }

  createMemberCardRelation(digitalCard: DCIModel) {
    const url = this.serviceURL + 'dci/member-card';
    return this.http.post<APIResponse<any>>(url, digitalCard);
  }
}
