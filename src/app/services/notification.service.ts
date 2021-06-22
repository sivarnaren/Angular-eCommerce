import { Injectable } from '@angular/core';
/*import { NotifierService } from 'angular-notifier';*/
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class NotificationService {
  constructor(private notifierSrv: ToastrService) { }

  showInfo(message: string) {
    this.notifierSrv.info( message, '',  {closeButton: true} );
  }
  showWarning(message: string) {
    this.notifierSrv.warning( message, '', {closeButton: true});
  }
  showSuccess(message: string) {
    this.notifierSrv.success( message, '', {closeButton: true});
  }
  showError(message: string) {
    this.notifierSrv.error( message, '', {closeButton: true});
  }

  HideNotifications() {
   // this.notifierSrv.hideAll();
  }

}
