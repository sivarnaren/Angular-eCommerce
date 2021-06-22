import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { AmIAuthenticatedModel } from '../models';
@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private isAuthenticated = new Subject<boolean>();

  // tslint:disable: variable-name
  private member_type_id = new Subject<number>();

  private serviceURL: string;

  constructor(private commonSrv: CommonService, private http: HttpClient) {
    this.serviceURL = this.commonSrv.apiURL + 'en/';
  }

  updateStatus(): void {
    const url = `${this.serviceURL}amIAuthenticated`;
    this.http.post<AmIAuthenticatedModel>(url, null).subscribe(result => {
      this.member_type_id.next(result.data ? result.data.member_type_id : 0);
      this.isAuthenticated.next(result.success);
    });
  }

  member_type_id_obs(): Observable<number> {
    return this.member_type_id.asObservable();
  }

  AuthenticationStatus(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }
}
