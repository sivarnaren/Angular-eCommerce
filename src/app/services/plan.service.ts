import { PlanModel } from './../models/plans.model';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { APIResponse } from './../models/index';
import { CommonService } from './common.service';

@Injectable()
export class PlanService {
  constructor(private commonSrv: CommonService, private http: HttpClient) { }

  serviceURl: string = this.commonSrv.apiURL + 'en/';

  getPlans() {
    const url = this.serviceURl + 'plans';
    return this.http.get<APIResponse<PlanModel[]>>(url);
  }
}
