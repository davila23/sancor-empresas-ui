import { Component, OnInit, ViewChildren, QueryList, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { UtilService, HttpService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FocusNextDirective } from '@app/shared';
import { AuthService } from '@app/core/auth.service';
import { AuthenticationService } from '@app/services/authentication.service';
import { first } from 'rxjs/operators';
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, AfterViewInit {

	constructor(
		private router: Router,
		private authenticationService: AuthenticationService,
		private route: ActivatedRoute,
		private utilService: UtilService
	) 
	{ 
    this.returnUrl = this.route.snapshot.params['returnUrl'] || '/';

    const tokenError = this.route.snapshot.params['error'] || null;

    const token = localStorage.getItem('token');

    if (token && Number(tokenError) === 401) {
      localStorage.clear();
    } else if (token) {
      this.router.navigate([this.returnUrl]);
    }
  }

	user = '';
	password = '';
	showPass = false;
	returnUrl: string;

	@ViewChildren(FocusNextDirective) focusElements: QueryList<FocusNextDirective>;

	ngOnInit() {
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.focusElements.first.focus();
		});
	}

	reset() {
		this.user = '';
		this.password = '';
	}

	login() {
    this.authenticationService.login(this.user, this.password).subscribe(r => {
      if (!r.token) {
        this.utilService.notification(r.mensaje, 'warning', 4000);
        return false;
      }

      let token = r.token;

      const decodedToken = this.decodeToken(JSON.stringify(token));

      let user = {
        name: r.mensaje,
        role: 'Administrador',
        rolId: decodedToken.usu_rol_id
      }

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', JSON.stringify(token));

      
      this.authenticationService.getConveniosTemporalesSteps(user.rolId)
      .subscribe(r => {
        this.utilService.notification(`Logeado con: ${user.name}`, 'success', 4000);

        localStorage.setItem('steps', JSON.stringify(r));

        this.router.navigate([this.returnUrl]);
      });

    });
  }
  
  public decodeToken(token: string = '') {
    if (token === null || token === '') { return { 'upn': '' }; }
    const parts = token.split('.');
    if (parts.length !== 3) {

        throw new Error('JWT must have 3 parts');
    }
    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
        throw new Error('Cannot decode the token');
    }
    return JSON.parse(decoded);
  }

  private urlBase64Decode(str: string) {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
        default:
            // tslint:disable-next-line:no-string-throw
            throw 'Illegal base64url string!';
    }
    return decodeURIComponent((<any>window).escape(window.atob(output)));
  }

}
