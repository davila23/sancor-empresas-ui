import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Md5} from 'ts-md5/dist/md5';
import { Observable } from 'rxjs';
import { environment } from '@env';

@Injectable()
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.baseUrl;
  baseUrlEmpresas = environment.baseUrlEmpresas;

  login(username: string, password: string): Observable<any> {
    let passwordHashed = Md5.hashStr(password);

    const url = `${this.baseUrlEmpresas}/Seguridad/webresources/ServicioUsuario/Usuario_Login`;

    return this.http.post(url, {usuario: username, password: passwordHashed});
  }

  getRol(id): Observable<any> {

    const url = `${this.baseUrlEmpresas}/Seguridad/webresources/ServicioUsuario/Usuario_Obtener?id=${id}`;

    return this.http.get(url);
  }

  getConveniosTemporalesSteps(rolId): Observable<any> {

    const url = `${this.baseUrl}/Empresas/api/permisos?rolID=${rolId}`;

    return this.http.get(url);
  }

  logout() {  
    localStorage.removeItem('user');
  }
}