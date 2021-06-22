import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { APIResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private commonSrv: CommonService, private http: HttpClient) {}

  serviceURl: string = this.commonSrv.apiURL + 'en/';

  getDashboardData() {
    const url = `${this.serviceURl}startup/dashboard`;
    return this.http.get<any>(url);
  }
}
