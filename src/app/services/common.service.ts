import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable()
export class CommonService {
  constructor(private http: HttpClient) {}

  apiURL = environment.apiURL;
  contentPatientEducation = environment.apiURL;
  dciURL = environment.dciURL;

  getStates() {
    const url = '../../assets/files/states.json';
    return this.http.get<any>(url);
  }
}
