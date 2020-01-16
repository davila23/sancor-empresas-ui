import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckEmpresaGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
	  if (Number(next.params.empresaId)) {
		  return true;
	  }
	  this.router.navigate(['/404']);
	  return false;
  }

  /*
    La idea sería patear al servidor para checkear que el ID de la empresa exista,
    de manera que el usuario no ingrese fruta en la URL
  */
}
