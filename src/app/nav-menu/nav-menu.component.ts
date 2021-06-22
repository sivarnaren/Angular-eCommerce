import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from './../translator/translate.service';
import { MenuService } from './../services';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.less']
})
export class NavMenuComponent implements OnInit {
  lang = localStorage.getItem('lng');
  isUserAuthenticated = false;
  // tslint:disable-next-line: variable-name
  member_type_id = 0;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private menuService: MenuService
  ) {
    this.menuService.updateStatus();

    this.menuService.AuthenticationStatus().subscribe(status => {
      this.isUserAuthenticated = status;
    });

    this.menuService.member_type_id_obs().subscribe(result => {
      this.member_type_id = result;
    });
  }

  navbarOpen = false;

  showSideNav() {
    console.log(this.navbarOpen);
    $('#mobile-demo').sidenav({
      edge: 'left'
    });
  }

  showSideNavRight() {
    console.log(this.navbarOpen);
    $('#right-sidevar').sidenav({
      edge: 'right'
    });
  }

  ngOnInit() {
    // tslint:disable-next-line: only-arrow-functions
    $(document).ready(function() {
      $('.dropdown-trigger').dropdown();
    });
  }
  setLang(language: string) {
    this.lang = language;
    localStorage.setItem('lng', language);
    this.translate.use();
  }

  signout() {
    sessionStorage.removeItem('token');
    this.menuService.updateStatus();
    this.router.navigate([this.lang, './'], { relativeTo: this.activatedRoute });
  }

  sendYouHome() {
    if (this.isUserAuthenticated === true) {
      this.router.navigate([this.lang, 'account'], { relativeTo: this.activatedRoute });
    } else {
      this.router.navigate([this.lang, './'], { relativeTo: this.activatedRoute });
    }
  }
}
