import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { APIResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AddressValidationService {

  constructor(private commonSrv: CommonService, private http: HttpClient) { }

  serviceURl: string = this.commonSrv.apiURL + 'en/';

  validateAddress(address: any) {
    const url = this.serviceURl + 'validate/address';
    return this.http.post<any>(url, address);
  }
}
