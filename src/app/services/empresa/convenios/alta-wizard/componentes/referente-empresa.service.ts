import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env';
import { ReferenteEmpresaDTO } from '@app/models/referente-empresa.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ReferenteEmpresaService {
    //ReferenteEmpresaDTO
    constructor(private http: HttpClient) { }

    baseUrl = environment.baseUrl;
     
    /**
     * DEFINITIVO
     */
    
     /*POST REFERENTES*/ 
    addReferenteD(referenteEmpresaDTO:ReferenteEmpresaDTO): Observable<ReferenteEmpresaDTO>{
        return this.http.post<ReferenteEmpresaDTO>(`${this.baseUrl}/Empresas/api/referenteempresa`, referenteEmpresaDTO).pipe(
            catchError(e => throwError(new Error(e)))
        );
    }

    /*GET REFERENTES*/
    getReferentesD(idEmpresa):Observable<ReferenteEmpresaDTO[]>{
    
        return this.http.get<ReferenteEmpresaDTO[]>(`${this.baseUrl}/Empresas/api/referenteempresa?empresaId=${idEmpresa}`).pipe(
            catchError(e => throwError(new Error(e)))
        );
    }

    deleteReferenteD(value): Observable<any> {

        const options = {
			headers: new HttpHeaders({
			  'Content-Type': 'application/json',
			}),
			body: value
        };

        const url = `${this.baseUrl}/Empresas/api/referenteempresa`;

        return this.http.delete(url, options);
    }

    /**
     * TEMPORARIO
     */

    /*POST REFERENTES*/ 
    addReferente(referenteEmpresaDTO:ReferenteEmpresaDTO): Observable<ReferenteEmpresaDTO>{
        return this.http.post<ReferenteEmpresaDTO>(`${this.baseUrl}/Empresas/api/referenteempresa/wizard`, referenteEmpresaDTO).pipe(
            catchError(e => throwError(new Error(e)))
        );
    }

    /*GET REFERENTES*/
    getReferentes(idEmpresa):Observable<ReferenteEmpresaDTO[]>{
    
        return this.http.get<ReferenteEmpresaDTO[]>(`${this.baseUrl}/Empresas/api/referenteempresa/wizard?empresaId=${idEmpresa}`).pipe(
            catchError(e => throwError(new Error(e)))
        );
    }

    deleteReferente(value): Observable<any> {

        const options = {
			headers: new HttpHeaders({
			  'Content-Type': 'application/json',
			}),
			body: value
        };

        const url = `${this.baseUrl}/Empresas/api/referenteempresa/wizard`;

        return this.http.delete(url, options);
    }
}