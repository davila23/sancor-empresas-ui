import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    
    let token = JSON.parse(localStorage.getItem('token'));
   
    if (token) {
      request = request.clone({
        setHeaders: { 
          token: `${token}`
        }
      });
    }

    return next.handle(request);
  }
}
