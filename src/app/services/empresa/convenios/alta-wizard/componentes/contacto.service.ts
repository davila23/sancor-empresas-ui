import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { environment } from '@env';
import { Observable, timer, of,  } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ContactoService {
    constructor(private http: HttpClient) {}

    baseUrl = environment.baseUrl;
    baseUrlEmpresas = environment.baseUrlEmpresas;

    /**
     * DEFINITIVO
     */

    getDomiciliosTemporalesD(convenioId): Observable<any> {
        const url = `${this.baseUrl}/Empresas/api/domicilioempresa?empresaId=${convenioId}`;

        return this.http.get(url).pipe(map(this.extractData));
    }

    postDomicilioD(value): Observable<any> {
        const url = `${this.baseUrl}/Empresas/api/domicilioempresa`;

        console.log(url);

        return this.http.post(url, value);
    }

    postTelD(value): Observable<any> {
        const url = `${this.baseUrl}/Empresas/api/telefonoemailempresa`;

        return this.http.post(url, value);
    }


    deleteTelD(value): Observable<any> {
        const options = {
			headers: new HttpHeaders({
			  'Content-Type': 'application/json',
			}),
			body: value
        };
        const url = `${this.baseUrl}/Empresas/api/telefonoemailempresa`;

        return this.http.delete(url, options);
    }
    /**
     * TEMPORARIO
     */
    getDomiciliosTemporales(convenioId): Observable<any> {
        const url = `${this.baseUrl}/Empresas/api/domicilioempresa/wizard?empresaId=${convenioId}`;

        return this.http.get(url).pipe(map(this.extractData));
    }

    getLocalidades(value): Observable<any> {
        const url = `${this.baseUrlEmpresas}/SancorSalud/webresources/ServicioLocalidad/autocompletar?texto=${value}`;

        return this.http.get(url);
    }

    postDomicilio(value): Observable<any> {
        const url = `${this.baseUrl}/Empresas/api/domicilioempresa/wizard`;

        console.log(url);

        return this.http.post(url, value);
    }

    postTel(value): Observable<any> {
        const url = `${this.baseUrl}/Empresas/api/telefonoemailempresa/wizard`;

        return this.http.post(url, value);
    }

    postValidarTel(value): Observable<any> {
        const url = `${this.baseUrl}/Empresas/api/telefonoemailempresa/validar`;

        return this.http.post(url, value);
    }

    deleteTel(value): Observable<any> {
        const options = {
			headers: new HttpHeaders({
			  'Content-Type': 'application/json',
			}),
			body: value
        };
        const url = `${this.baseUrl}/Empresas/api/telefonoemailempresa/wizard`;

        return this.http.delete(url, options);
    }

    private extractData(res: Response) {
        return res || {};
    }
}
