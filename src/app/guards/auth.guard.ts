import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService, MenuService, NotificationService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public auth: AccountService,
    public router: Router,
    private notificationSrv: NotificationService,
    private menuService: MenuService
  ) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.amIAuthenticated().pipe(
      map(response => {
        if (response.success) {
          return true;
        } else {
          // TODO implement Translate here!
          this.menuService.updateStatus();
          this.notificationSrv.showInfo('Your session has expired please log in again');

          this.router.navigate(['/'], {
            queryParams: {
              return: state.url
            }
          });
          return false;
        }
      })
    );
  }
}
