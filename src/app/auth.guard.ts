import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@app/core';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {

	constructor(
		private authService: AuthService,
		private router: Router
	) { }

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		/*
		if (this.authService.user) {
			return true;
		} else {
			this.router.navigate(['/login']);
		}
		return false;
		*/
		if (localStorage.getItem('user')) {
            // logged in so return true
            return true;
		}
		this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
		return false;
	}
}
