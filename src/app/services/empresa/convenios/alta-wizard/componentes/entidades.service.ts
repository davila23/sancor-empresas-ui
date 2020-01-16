import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RelacionEmpresaConFacturadoraDTO } from '@app/models/relacion-empresa.model';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '@env';
import { EmpresaDTO } from '@app/models/empresa/empresa.model';

@Injectable()
export class EntidadesService {

    constructor(private http: HttpClient) { }

    baseUrl = environment.baseUrl;

    /* DEFINITIVO */
    /*POST ENTIDADES*/
    addEntidadesD(entidadesRelacionadas: RelacionEmpresaConFacturadoraDTO): Observable<RelacionEmpresaConFacturadoraDTO> {
        return this.http.post<RelacionEmpresaConFacturadoraDTO>(`${this.baseUrl}/Empresas/api/empresa/saveRelacionFacturadora`, entidadesRelacionadas);
    }
    /*GET ENTIDADES*/
    getEntidadesRelacionadasD(empresaId: number): Observable<RelacionEmpresaConFacturadoraDTO[]> {
        return this.http.get<RelacionEmpresaConFacturadoraDTO[]>(`${this.baseUrl}/Empresas/api/empresa/empresasRelacionadasDeUnaFacturadoraDada?id=${empresaId}`);
    }

    /*deleteRelacionFacturadora*/
    deleteRelacionFacturadoraEmpresasD(relacionEmpresaConFacturadoraDTO: RelacionEmpresaConFacturadoraDTO) {
        return this.http.post(`${this.baseUrl}/Empresas/api/empresa/deleteRelacionFacturadora`, relacionEmpresaConFacturadoraDTO)
    }

    
    /* WIZARD */
    /*POST ENTIDADES*/
    addEntidades(entidadesRelacionadas: RelacionEmpresaConFacturadoraDTO): Observable<RelacionEmpresaConFacturadoraDTO> {
        return this.http.post<RelacionEmpresaConFacturadoraDTO>(`${this.baseUrl}/Empresas/api/empresa/saveRelacionFacturadora`, entidadesRelacionadas);
    }
    /*GET ENTIDADES*/
    getEntidadesRelacionadas(empresaId: number): Observable<RelacionEmpresaConFacturadoraDTO[]> {
        return this.http.get<RelacionEmpresaConFacturadoraDTO[]>(`${this.baseUrl}/Empresas/api/empresa/empresasRelacionadasDeUnaFacturadoraDada?id=${empresaId}`);
    }

    /*deleteRelacionFacturadora*/
    deleteRelacionFacturadoraEmpresas(relacionEmpresaConFacturadoraDTO: RelacionEmpresaConFacturadoraDTO) {
        return this.http.post(`${this.baseUrl}/Empresas/api/empresa/deleteRelacionFacturadora`, relacionEmpresaConFacturadoraDTO)
    }

    /* autocompletar Empresas */
    getEmpresasAutocomplete(texto: string): Observable<EmpresaDTO[]> {
        return this.http.get<EmpresaDTO[]>(`${this.baseUrl}/Empresas/api/empresa/autocompletar?texto=${texto}`)
    }
}