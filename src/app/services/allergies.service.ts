import { Injectable } from '@angular/core';
import { AllergiesModel, APIResponse } from '../models/index';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AllergiesService {
  constructor(private commonSrv: CommonService, private http: HttpClient) { }

  serviceURl: string = this.commonSrv.apiURL + 'en/';

  getAllergies() {
    const url = this.serviceURl + 'allergies';
    return this.http.get<APIResponse<any>>(url);
  }
}
