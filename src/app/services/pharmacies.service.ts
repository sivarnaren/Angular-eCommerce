import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { APIResponse, PharmacyModel } from '../models/index';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PharmaciesService {
  constructor(private commonSrv: CommonService, private http: HttpClient) { }

  serviceURl: string = this.commonSrv.apiURL + 'en/';

  getNearestPharmacies(pharmacyModel: PharmacyModel) {
    const url = this.serviceURl + 'pharmacies';
    return this.http.post<APIResponse<PharmacyModel[]>>(url, pharmacyModel);
  }
}
