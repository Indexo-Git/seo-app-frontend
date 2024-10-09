import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Services
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  static toasterService: any;

  static setError(title: string, body: string) {
    return {
      type: 'error',
      title: title,
      body: body,
      timeout: 3000
    };
  }

  constructor(private _toasterService: ToasterService) {
    InterceptorService.toasterService = this._toasterService;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(this.handleError)
    );
  }

  handleError( error: HttpErrorResponse) {
    console.log('interceptor error', error);
    InterceptorService.toasterService.pop(InterceptorService.setError('Error!', error.error.message));
    if (error.error.errors) {
      InterceptorService.toasterService.pop(InterceptorService.setError('Error details', error.error.errors.message));
    }
    return throwError(error);
  }

}
