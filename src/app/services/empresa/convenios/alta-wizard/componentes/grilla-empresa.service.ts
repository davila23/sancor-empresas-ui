import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { GrillaProductoDTO } from '@app/models/grilla-producto.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductoGrillaEmpresaDTO } from '@app/models/producto-grilla-empresa.model';


@Injectable()
export class GrillaEmpresaService {

    constructor(private http: HttpClient) { }
    
    baseUrl = environment.baseUrl;

    /**
     * DEFINITIVO
     */
 

    addGrillaConvenioProductoD(grilla:ProductoGrillaEmpresaDTO):Observable<ProductoGrillaEmpresaDTO>{
        return this.http.post<ProductoGrillaEmpresaDTO>(`${this.baseUrl}/Empresas/api/grillaEmpresa/empresas`,grilla).pipe(
            catchError(e => throwError(new Error(e)))
        );
    }

    //GET todas las grillas
    getAllGrillasD(convenioId:Number):Observable<ProductoGrillaEmpresaDTO[]>{
        return this.http.get<ProductoGrillaEmpresaDTO[]>(`${this.baseUrl}/Empresas/api/grillaEmpresa?idConvenio=${convenioId}`);
    }
    
    //DELETE - /Empresas/api/grillaEmpresa/wizard?grillaId=10&convenioId=1&productoId=5
    deleteGrillaConvenioProductoD(grillaId:number,convenioId:number,productoId:number){
        return this.http.delete(`${this.baseUrl}/Empresas/api/grillaEmpresa?convenioId=${convenioId}&grillaId=${grillaId}&codigo=${productoId}`)
    }
    /**
     * TEMPORARIO
     */
    /* tipos: PYME */
    getGrillasPorCaracteristica(tipo:string):Observable<GrillaProductoDTO[]>{
        return this.http.get<GrillaProductoDTO[]>(`${this.baseUrl}/Empresas/api/grillaEmpresa/wizard/tipo?caracteristicas=${tipo}`).pipe(
            catchError(e => throwError(new Error(e)))
        )
    }

    /* nroGrilla */
    getGrillasPorNroGrilla(nroGrilla:number):Observable<GrillaProductoDTO[]>{
        return this.http.get<GrillaProductoDTO[]>(`${this.baseUrl}/Empresas/api/grillaEmpresa/wizard/tipo?nroGrilla=${nroGrilla}`).pipe(
            catchError(e => throwError(new Error(e)))
        );
    }

    addGrillaConvenioProducto(grilla:ProductoGrillaEmpresaDTO):Observable<ProductoGrillaEmpresaDTO>{
        return this.http.post<ProductoGrillaEmpresaDTO>(`${this.baseUrl}/Empresas/api/grillaEmpresa/wizard`,grilla).pipe(
            catchError(e => throwError(new Error(e)))
        );
    }

    //GET todas las grillas
    getAllGrillas(convenioId:Number):Observable<ProductoGrillaEmpresaDTO[]>{
        return this.http.get<ProductoGrillaEmpresaDTO[]>(`${this.baseUrl}/Empresas/api/grillaEmpresa/wizard?idConvenio=${convenioId}`);
    }
    
    //DELETE - /Empresas/api/grillaEmpresa/wizard?grillaId=10&convenioId=1&productoId=5
    deleteGrillaConvenioProducto(grillaId:number,convenioId:number,productoId:number){
        return this.http.delete(`${this.baseUrl}/Empresas/api/grillaEmpresa/wizard?convenioId=${convenioId}&grillaId=${grillaId}&codigo=${productoId}`)
    }
}