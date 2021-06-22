import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-membership-card',
  templateUrl: './membership-card.component.html',
  styleUrls: ['./membership-card.component.less']
})
export class MembershipCardComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {}

  getMembershipCard(format: string) {
    const url = 'https://dw4a391qgl.execute-api.us-west-2.amazonaws.com/prod/';
    const cardUuid = 'card=e91a23e8-d5ec-4c47-911b-e055c1fb66e8';
    this.http.get(`${url}?${cardUuid}&${format}&cache=true}`).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.error(error);
      }
    );
  }
}
