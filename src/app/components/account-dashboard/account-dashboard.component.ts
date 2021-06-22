import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MyFamilyService, NotificationService, MenuService, DashboardService } from 'src/app/services';
import * as moment from 'moment';

@Component({
  selector: 'app-account-dashboard',
  templateUrl: './account-dashboard.component.html',
  styleUrls: ['./account-dashboard.component.less']
})
export class AccountDashboardComponent implements OnInit {
  isNormaluser = true;
  // tslint:disable-next-line: variable-name
  member_type_id: number;
  renewalDate = '';
  addedMembers: string;
  addedGuests: number;
  openOrders: number;
  completedOrders: number;
  aviableCredits = 0;

  constructor(
    private router: Router,
    private myFamilySrv: MyFamilyService,

    private myDashboardSrv: DashboardService,
    private menuService: MenuService,
    private notificationSrv: NotificationService,
    private activatedRoute: ActivatedRoute
  ) {
    this.menuService.member_type_id_obs().subscribe(result => {
      this.member_type_id = result;
    });
    this.menuService.updateStatus();
  }

  ngOnInit() {
    this.myDashboardSrv.getDashboardData().subscribe(res => {
      if (!res.HasError) {
        const memberPlan = res.Result.memberPlan;
        const activeFamilyUsers = res.Result.activeFamilyUsers;
        const activeFamilyUsersCount = activeFamilyUsers.length;
        this.completedOrders = res.Result.completedOrders.count;
        this.openOrders = res.Result.procesingOrders.count;
        this.addedGuests = res.Result.activeGuestUsers.length;
        if (memberPlan) {
          this.renewalDate = moment(memberPlan.end_date).format('MM/DD/YYYY');
          this.addedMembers = `${activeFamilyUsersCount + this.addedGuests} of ${memberPlan.user_limit}`;
        }
        // get this from the end point
        this.aviableCredits = 2;
      } else {
        this.notificationSrv.showError(res.Message);
      }
    });
  }
  upgradeMember() {
    this.myFamilySrv.upgradePhamilyAccount().subscribe(res => {
      if (!res.HasError) {
        this.notificationSrv.showInfo('success, please complete the sign up');
        this.router.navigate(['../my-home'], { relativeTo: this.activatedRoute });
      } else {
        this.notificationSrv.showError(res.Message);
      }
    });
  }
  logout() {
    sessionStorage.setItem('token', '');
    this.router.navigate(['../login'], { relativeTo: this.activatedRoute });
  }

  goToRoute(route) {
    if (route.localeCompare('MyPhamily') === 0) {
      this.router.navigate(['./family'], { relativeTo: this.activatedRoute });
    } else if (route.localeCompare('MyInfo') === 0) {
      this.router.navigate(['./my-profile'], { relativeTo: this.activatedRoute });
    }
  }
}
