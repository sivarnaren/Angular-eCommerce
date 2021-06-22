import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { APIResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PaymentProviderService {
  constructor(private commonSrv: CommonService, private http: HttpClient) {}

  serviceURl: string = this.commonSrv.apiURL + 'en/';

  addPaymentMethod(paymentInformation) {
    const url = this.serviceURl + 'create/payment-profile';
    return this.http.post<APIResponse<any>>(url, paymentInformation);
  }

  getPaymentMethods() {
    const url = this.serviceURl + 'get/payment-methods';
    return this.http.get<APIResponse<any>>(url);
  }

  updateDefaultPaymentMethod(paymentMethod: any) {
    // TODO clean console.log
    console.log('calling this services');
    const url = this.serviceURl + 'update/default-payment-method';
    return this.http.post<APIResponse<any>>(url, paymentMethod);
  }

  deletePaymentMethod(paymentMethod: any) {
    const url = this.serviceURl + 'delete/payment-profile';
    return this.http.post<APIResponse<any>>(url, paymentMethod);
  }
}
