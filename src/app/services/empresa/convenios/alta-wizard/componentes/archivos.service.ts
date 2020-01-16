import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { catchError } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';

@Injectable()
export class ArchivosService {

    constructor(private http: HttpClient) { }
  
    baseUrl = environment.baseUrl;
    baseUrlEmpresas = environment.baseUrlEmpresas;

    getList(convenioId): Observable<any> {
        const url = `${this.baseUrl}/Empresas/api/adjuntoConvenio/wizard/${convenioId}`;

        return this.http.get(url);
    }
  
    postFile(value): Observable<any> {
        const url = `${this.baseUrl}/Empresas/api/adjuntoConvenio`;

        return this.http.post(url, value, {
            reportProgress: true,
            observe: 'events'
        }).pipe(catchError(e => throwError(new Error(e))));
    }

    downloadFile(idImagen): Observable<any> {
        const url = `${this.baseUrlEmpresas}/SancorSalud/webresources/ServicioDigitalizacion/buscarArchivo`;
        
        return this.http.post(url, {id: idImagen}, {
            reportProgress: true,
            observe: 'events'
        }).pipe(catchError(e => throwError(new Error(e))));
    }

    getTypes() {
        const url = `${this.baseUrl}/Empresas/api/tipoAdjunto`;

        return this.http.get(url);
    }

}