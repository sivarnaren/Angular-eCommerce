import { Injectable } from '@angular/core';

import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MenuService } from './../app/services';
import { Router } from '@angular/router';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(private menuService: MenuService, private router: Router) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = sessionStorage.getItem('token');

    if (token) {
      request = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        headers: request.headers.set('Content-Type', 'application/json')
      });
    }

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // console.log('event--->>>', event);
          // this.errorDialogService.openDialog(event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let data = {};
        data = {
          reason: error && error.error.reason ? error.error.reason : '',
          status: error.status
        };
        this.handleAuthError(error);
        // this.errorDialogService.openDialog(data);
        return throwError(error);
      })
    );
  }

  handleAuthError(err: HttpErrorResponse): Observable<any> {
    // handle your auth error or rethrow
    if (err.status === 401 || err.status === 403 || err.status === 0) {
      this.menuService.updateStatus();
      // navigate /delete cookies or whatever
      console.error('handled error ' + err.status);

      this.router.navigate(['/']);

      /* if you've caught/handled the error, you don't want to rethrow
            it unless you also want downstream consumers to have to handle it as well. */
      return of(err.message);
    }
    return of(err);
  }
}
