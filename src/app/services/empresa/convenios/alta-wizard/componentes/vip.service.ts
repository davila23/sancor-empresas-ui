import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VipService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.baseUrl;

  // ## Convenios temporales ## //

  getUsuariosVip(convenioId): Observable<any> {
    return this.http.get(`${this.baseUrl}/Empresas/api/vip?convenioId=${convenioId}`);
  }

  postUsuariosVip(body): Observable<any> {
    return this.http.post(`${this.baseUrl}/Empresas/api/vip`, body);
  }

  deleteUsuariosVip(body): Observable<any> {
    const options = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			}),
			body: body
    };
    
    return this.http.delete(`${this.baseUrl}/Empresas/api/vip`, options);
  }
  // ## Convenios definitivos ## //
}
