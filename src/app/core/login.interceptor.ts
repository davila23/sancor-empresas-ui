import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { _throw } from 'rxjs/observable/throw'
import { retryWhen, catchError, mergeMap, finalize } from 'rxjs/operators';
import { UtilService } from './util.service';

@Injectable()
export class LoginInterceptor implements HttpInterceptor {
	constructor(private router: Router,
				private utilService: UtilService
	) { }

	currentRequests: HttpRequest<any>[] = [];
	currentNotifications: any[] = [];

	statusErrors = [400, 401, 404, 500, 503];

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		this.checkInternet();

		return next
		.handle(req).pipe(
			retryWhen(this.genericRetryStrategy(1, 300, this.statusErrors, req, next)),
			catchError((error:any) => this.handleError(error)));
	}

   genericRetryStrategy(maxRetryAttempts: number = 3, 
					   scalingDuration: number = 500, 
					   includedStatusCodes: number[] = [],
					   request?,
					   next?) 
   {
	   return (attempts: Observable<any>) => {
		   return attempts.pipe(
			   mergeMap((error, i) => {
				   let retryAttempt = i + 1;

				   this.checkInternet();

				   // if maximum number of retries have been met
				   // or response is a status code we don't wish to retry, throw error
				   if (retryAttempt > maxRetryAttempts || !includedStatusCodes.find(e => e === error.status)) 
				   {
					   if (error.status == 0 && !window.navigator.onLine) {
						   retryAttempt = 1;
						   this.intercept(request, next);
					   } else {
						   return _throw(error);
					   }
				   }

				   console.log(`Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration}ms`);
				   // retry after 1s, 2s, etc...
				   return timer(retryAttempt * scalingDuration);
			   }),
			   finalize(() => console.log('We are done!'))
		   );
	   }
   }
   
   checkInternet() {
		if (!window.navigator.onLine) {
			setTimeout(() => {
				this.notification('Sin conexion, reintentando...', 'retrying', 5000);
				this.checkInternet();
			}, 3000);
		}
	}

	handleError(error): Observable<any> {
		if (error instanceof HttpErrorResponse) {
			switch(error.status) {
				case 400:
					this.notification('Bad request', 'warning');
					break;
				case 401:
          this.notification('No autorizado, por favor, vuelva a logear.', 'warning');
					this.router.navigate([`/login`,{returnUrl: this.router.url, error: 401}]);
					break;
				case 404:
					this.notification('No se pudo alcanzar al servidor, refresque o contacte a su administrador', 'error');
					break;
				case 500:
					this.notification('Ocurrió un error, refresque la página', 'error');
					break;
			}
		}
		return timer();
	}

	// Función recursiva para mostrar notificaciones vinculadas con los errores de request.
	notification(message?: string, type?: string, duration?: number) {
		if (message && type) {
			if (!this.currentNotifications.length) {
				this.currentNotifications.push({message, type, duration});
				this.utilService.notification(message, type, duration).afterDismissed().subscribe(r => {
					this.currentNotifications.shift();
					while (this.currentNotifications.length && (this.currentNotifications[0].message == message && this.currentNotifications[0].type == type)) {
						this.currentNotifications.shift();
					}
				});
			}
			else {
				this.currentNotifications.push({message, type, duration});		
			}
		} else if (this.currentNotifications.length)  {
			const current = this.currentNotifications[0];
			this.utilService.notification(current.message, current.type, current.duration).afterDismissed().subscribe(r => { 
				this.currentNotifications.shift();
				this.notification(); 
			});
		}
	}
}
