import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '@app/core';
import { Roles } from '../models/permissions/roles';

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivate {

  returnUrl: string;

  constructor(
    private router: Router,
    private utilService: UtilService,
    private route: ActivatedRoute,
	) {
    this.returnUrl = this.route.snapshot.params['returnUrl'] || '/';
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let person = JSON.parse(window.localStorage.getItem('user'));
    let isAllowed = false;
    if (person && person.rolId) {
      if (route.data.roles) {
        isAllowed = route.data.roles.some(rol => rol == person.rolId);
      }      
    }
    if (isAllowed){
      return true;
    } else {
      this.utilService.notification('Acceso denegado.', 'warning');
      if(person && person.rolId){
        switch (person.rolId){
          // case Roles.ESTADOS_CONTABLES: {
          //   this.router.navigate(['/consultas/entidades']);
          //   break;
          // }
          default:{
            this.router.navigate([this.returnUrl]);
            break;
          }
        }
      }
      return false;
    }
  }
  
}
