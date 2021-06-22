import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-account-side-menu',
  templateUrl: './account-side-menu.component.html',
  styleUrls: ['./account-side-menu.component.less']
})
export class AccountSideMenuComponent implements OnInit {

  @Input() componentName: string;

  constructor() { }

  ngOnInit() {
  }

}
